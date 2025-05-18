import { ChartData } from "@/app/(tabs)/trends/trends";
import * as SQLite from "expo-sqlite";
import { DateTime } from "luxon";

export const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("modest_app.db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS food_intakes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        breakfast TEXT,
        lunch TEXT,
        dinner TEXT,
        snacks TEXT,
        date TEXT
    );
  `);

  return db;
};

export const insertFoodIntake = async (foodIntake: {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  date: string;
}) => {
  const db = await openDatabase();
  return await db.runAsync(
    "INSERT INTO food_intakes (breakfast, lunch, dinner, snacks, date) VALUES (?, ?, ?, ?, ?)",
    foodIntake.breakfast,
    foodIntake.lunch,
    foodIntake.dinner,
    foodIntake.snacks,
    foodIntake.date
  );
};

export const updateFoodIntake = async (
  id: number,
  foodIntake: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  }
) => {
  const db = await openDatabase();
  const result = await db.runAsync(
    "UPDATE food_intakes SET breakfast = ?, lunch = ?, dinner = ?, snacks = ? WHERE id = ?",
    foodIntake.breakfast,
    foodIntake.lunch,
    foodIntake.dinner,
    foodIntake.snacks,
    id
  );

  return result;
};

export const deleteFoodIntake = async (id: number) => {
  const db = await openDatabase();
  const result = await db.runAsync("DELETE FROM food_intakes WHERE id = ?", id);

  return result;
};

export const getAllFoodIntakes = async () => {
  const db = await openDatabase();
  const allRows = await db.getAllAsync("SELECT * FROM food_intakes");

  return allRows;
};

export const getFoodIntakeById = async (id: number) => {
  const db = await openDatabase();
  const foodIntake = await db.getFirstAsync(
    "SELECT * FROM food_intakes WHERE id = ?",
    id
  );

  return foodIntake;
};

export const getFoodIntakeChartData = async (
  range: "day" | "week" | "month" | "custom",
  customDate?: Date
): Promise<ChartData[]> => {
  const db = await openDatabase();
  try {
    let fromDate: DateTime;

    if (range === "custom" && customDate) {
      fromDate = DateTime.fromJSDate(customDate).startOf("day");
    } else {
      const now = DateTime.now();
      switch (range) {
        case "day":
          fromDate = now.startOf("day");
          break;
        case "week":
          fromDate = now.startOf("week");
          break;
        case "month":
          fromDate = now.startOf("month");
          break;
        default:
          fromDate = now.startOf("day");
          break;
      }
    }

    const foodIntakes = await db.getAllAsync(
      "SELECT * FROM food_intakes WHERE date >= ?",
      fromDate.toISODate()
    );

    if (foodIntakes.length === 0) return [];

    const mealMap = new Map<string, number>();
    const colorMap = new Map<string, string>();
    const getColor = (label: string) => {
      if (!colorMap.has(label)) {
        const randomColor = Math.floor(Math.random() * 0xffffff);
        colorMap.set(label, `#${randomColor.toString(16).padStart(6, "0")}`);
      }
      return colorMap.get(label)!;
    };

    for (const row of foodIntakes) {
      [row.breakfast, row.lunch, row.dinner, row.snacks].forEach((meal) => {
        const trimmed = meal?.trim();
        if (trimmed) {
          const current = mealMap.get(trimmed) || 0;
          mealMap.set(trimmed, current + 1);
        }
      });
    }

    return Array.from(mealMap.entries()).map(([label, value]) => ({
      label,
      value,
      color: getColor(label),
    }));
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
};

export const getDistinctMeals = async (): Promise<
  Record<"breakfast" | "lunch" | "dinner" | "snacks", string[]>
> => {
  const db = await openDatabase();

  const categories = ["breakfast", "lunch", "dinner", "snacks"] as const;

  const result: Record<string, string[]> = {};

  for (const key of categories) {
    const rows = await db.getAllAsync(
      `SELECT DISTINCT ${key} FROM food_intakes WHERE ${key} IS NOT NULL AND ${key} != ''`
    );
    result[key] = rows.map((row) => row[key]);
  }

  return result as Record<
    "breakfast" | "lunch" | "dinner" | "snacks",
    string[]
  >;
};

export const clearFoodIntakes = async () => {
  const db = await openDatabase();
  await db.runAsync("DELETE FROM food_intakes");
};

export const dropFoodIntakeTable = async () => {
  const db = await openDatabase();
  await db.execAsync("DROP TABLE IF EXISTS food_intakes");
};

export const insertJournalEntry = async (note: string, date: string) => {
  const db = await openDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note TEXT,
      date TEXT
    );
  `);

  return await db.runAsync(
    "INSERT INTO journal_entries (note, date) VALUES (?, ?)",
    note,
    date
  );
};

export const getJournalEntriesByRange = async (
  fromDate: Date,
  toDate: Date
): Promise<{ content: string; date: string }[]> => {
  const db = await openDatabase();

  const fromISO = DateTime.fromJSDate(fromDate).startOf("day").toISO();
  const toISO = DateTime.fromJSDate(toDate).endOf("day").toISO();

  const rows = await db.getAllAsync(
    `SELECT note as content, date FROM journal_entries WHERE date BETWEEN ? AND ? ORDER BY date DESC`,
    fromISO,
    toISO
  );

  return rows.map((row) => ({
    content: row.content,
    date: row.date,
  }));
};
