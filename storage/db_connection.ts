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

    CREATE TABLE IF NOT EXISTS weather_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      temperature REAL NOT NULL,
      condition TEXT NOT NULL,
      humidity INTEGER NOT NULL,
      pressure REAL NOT NULL,
      location_name TEXT,
      fetched_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS mood_ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mood TEXT NOT NULL,
      date TEXT UNIQUE NOT NULL,
      weather_id INTEGER,
      FOREIGN KEY (weather_id) REFERENCES weather_data(id)
    );

    CREATE TABLE IF NOT EXISTS meals (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      meal_type TEXT,
      foods TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT,
      age INTEGER,
      weight REAL,
      weight_unit TEXT DEFAULT 'kg',
      working_days TEXT,
      sport_days TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      weight REAL NOT NULL,
      weight_unit TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Migration: Add missing columns to weather_data if they don't exist
  try {
    const tableInfo = await db.getAllAsync(`PRAGMA table_info(weather_data)`);
    const columnNames = tableInfo.map((col: any) => col.name);

    if (!columnNames.includes('condition')) {
      console.log('Migrating weather_data: adding condition column');
      await db.execAsync(`ALTER TABLE weather_data ADD COLUMN condition TEXT NOT NULL DEFAULT 'Unknown';`);
    }

    if (!columnNames.includes('humidity')) {
      console.log('Migrating weather_data: adding humidity column');
      await db.execAsync(`ALTER TABLE weather_data ADD COLUMN humidity INTEGER NOT NULL DEFAULT 0;`);
    }

    if (!columnNames.includes('pressure')) {
      console.log('Migrating weather_data: adding pressure column');
      await db.execAsync(`ALTER TABLE weather_data ADD COLUMN pressure REAL NOT NULL DEFAULT 0;`);
    }

    if (!columnNames.includes('location_name')) {
      console.log('Migrating weather_data: adding location_name column');
      await db.execAsync(`ALTER TABLE weather_data ADD COLUMN location_name TEXT;`);
    }

    if (!columnNames.includes('fetched_at')) {
      console.log('Migrating weather_data: adding fetched_at column');
      await db.execAsync(`ALTER TABLE weather_data ADD COLUMN fetched_at TEXT NOT NULL DEFAULT '';`);
    }
  } catch (error) {
    console.log('Weather data migration error:', error);
  }

  // Migration: Add missing columns to user_profile if they don't exist
  try {
    const profileTableInfo = await db.getAllAsync(`PRAGMA table_info(user_profile)`);
    const profileColumnNames = profileTableInfo.map((col: any) => col.name);

    if (!profileColumnNames.includes('name')) {
      console.log('Migrating user_profile: adding name column');
      await db.execAsync(`ALTER TABLE user_profile ADD COLUMN name TEXT;`);
    }

    if (!profileColumnNames.includes('age')) {
      console.log('Migrating user_profile: adding age column');
      await db.execAsync(`ALTER TABLE user_profile ADD COLUMN age INTEGER;`);
    }
  } catch (error) {
    console.log('User profile migration error:', error);
  }

  return db;
};
