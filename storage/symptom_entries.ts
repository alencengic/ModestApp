import type * as SQLite from "expo-sqlite";
import { openDatabase } from "./db_connection";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
async function getDb() {
  if (!dbPromise) dbPromise = openDatabase();
  return dbPromise;
}

export type MealTypeTag = "breakfast" | "lunch" | "dinner" | "snack";
export type BloatingLevel = "None" | "Mild" | "Moderate" | "Severe";

export type SymptomRow = {
  id: string;
  meal_id?: string | null;
  meal_type_tag?: MealTypeTag | null;
  created_at: string;
  bloating: BloatingLevel;
  energy: number;
  stool_consistency: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  diarrhea: 0 | 1;
  nausea: 0 | 1;
  pain: 0 | 1;
};

async function ensureSymptomTable(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS symptom_entries (
      id TEXT PRIMARY KEY,
      meal_id TEXT,
      meal_type_tag TEXT,
      created_at TEXT NOT NULL,
      bloating TEXT NOT NULL,
      energy INTEGER NOT NULL,
      stool_consistency INTEGER NOT NULL,
      diarrhea INTEGER NOT NULL,
      nausea INTEGER NOT NULL,
      pain INTEGER NOT NULL
    );
  `);
}

export async function insertSymptom(
  row: Omit<SymptomRow, "created_at"> & { created_at?: string }
) {
  const db = await getDb();
  await ensureSymptomTable(db);
  const created_at = row.created_at ?? new Date().toISOString();
  await db.runAsync(
    `INSERT INTO symptom_entries
     (id, meal_id, meal_type_tag, created_at, bloating, energy, stool_consistency, diarrhea, nausea, pain)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      row.id,
      row.meal_id ?? null,
      row.meal_type_tag ?? null,
      created_at,
      row.bloating,
      row.energy,
      row.stool_consistency,
      row.diarrhea,
      row.nausea,
      row.pain,
    ]
  );
}

export async function listSymptoms(limit = 200): Promise<SymptomRow[]> {
  const db = await getDb();
  await ensureSymptomTable(db);
  return db.getAllAsync<SymptomRow>(
    `SELECT * FROM symptom_entries
     ORDER BY datetime(created_at) DESC
     LIMIT ?`,
    [limit]
  );
}

export async function listSymptomsByDate(
  isoDate: string
): Promise<SymptomRow[]> {
  const db = await getDb();
  await ensureSymptomTable(db);
  return db.getAllAsync<SymptomRow>(
    `SELECT * FROM symptom_entries
     WHERE date(created_at) = date(?)
     ORDER BY datetime(created_at) DESC`,
    [isoDate]
  );
}

export async function listSymptomsByMeal(
  mealId: string
): Promise<SymptomRow[]> {
  const db = await getDb();
  await ensureSymptomTable(db);
  return db.getAllAsync<SymptomRow>(
    `SELECT * FROM symptom_entries
     WHERE meal_id = ?
     ORDER BY datetime(created_at) DESC`,
    [mealId]
  );
}

const BLOATING_TO_NUM: Record<BloatingLevel, 0 | 1 | 2 | 3> = {
  None: 0,
  Mild: 1,
  Moderate: 2,
  Severe: 3,
};

const toNum = (b: BloatingLevel): number => BLOATING_TO_NUM[b];

export type BloatingWeekPoint = { week_start: string; avg: number };

function startOfIsoWeek(date: Date): Date {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function aggBloatingPerWeek(): Promise<BloatingWeekPoint[]> {
  const db = await getDb();
  await ensureSymptomTable(db);
  const rows = await db.getAllAsync<SymptomRow>(
    `SELECT * FROM symptom_entries`
  );
  const byWeek = new Map<string, number[]>();
  for (const r of rows) {
    const ws = startOfIsoWeek(new Date(r.created_at)).toISOString();
    const arr = byWeek.get(ws) ?? [];
    arr.push(toNum(r.bloating));
    byWeek.set(ws, arr);
  }
  return Array.from(byWeek.entries()).map(([week_start, arr]) => ({
    week_start,
    avg: arr.reduce((a, b) => a + b, 0) / arr.length,
  }));
}

export type EnergyVsMeal = { meal: string; mean: number };

export async function aggEnergyVsMeal(): Promise<EnergyVsMeal[]> {
  const db = await getDb();
  await ensureSymptomTable(db);
  const rows = await db.getAllAsync<{ meal: string | null; mean: number }>(
    `SELECT meal_type_tag as meal, AVG(energy) as mean
     FROM symptom_entries
     GROUP BY meal_type_tag`
  );
  return rows.map((r) => ({ meal: r.meal ?? "unknown", mean: r.mean }));
}

export type StoolSlice = { label: string; count: number };

export async function aggStoolDistribution(): Promise<StoolSlice[]> {
  const db = await getDb();
  await ensureSymptomTable(db);
  const rows = await db.getAllAsync<{ stool_consistency: number; c: number }>(
    `SELECT stool_consistency, COUNT(*) as c
     FROM symptom_entries
     GROUP BY stool_consistency
     ORDER BY stool_consistency`
  );
  return rows.map((r) => ({ label: `#${r.stool_consistency}`, count: r.c }));
}
