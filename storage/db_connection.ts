import * as SQLite from "expo-sqlite";

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

    CREATE TABLE IF NOT EXISTS mood_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mood_label TEXT,
      emoji TEXT,
      date TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS productivity_ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productivity INTEGER NOT NULL,
      date TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS symptom_entries (
      id TEXT PRIMARY KEY NOT NULL,
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

  return db;
};
