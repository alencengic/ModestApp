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
    /*
      Note: The journal_entries table schema is:
      CREATE TABLE IF NOT EXISTS journal_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        note TEXT,
        date TEXT
      );
      It is created dynamically if it doesn't exist when insertJournalEntry is called.
      This is mentioned here for completeness as it's part of the overall database schema.
    */
  `);

  return db;
};
