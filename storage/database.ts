import { ChartData } from "@/app/(tabs)/trends/trends";
import * as SQLite from "expo-sqlite";
import { DateTime } from "luxon";

// Define types for table structures
export interface FoodIntake {
  id: number;
  breakfast: string | null;
  lunch: string | null;
  dinner: string | null;
  snacks: string | null;
  date: string; // ISO Date string e.g. "2023-10-26"
}

export interface MoodRating {
  id: number;
  mood: string;
  date: string; // ISO Date string e.g. "2023-10-26"
}

export interface FoodMoodCorrelation {
  foodName: string;
  averageMoodScore: number;
  occurrences: number;
}

const MOOD_SCORE_MAP: Record<string, number> = {
  Sad: -2,
  Neutral: 0,
  Happy: 1,
  "Very Happy": 2,
  Ecstatic: 3,
};

const splitMealItems = (mealString: string | null | undefined): string[] => {
  if (!mealString) {
    return [];
  }
  return mealString
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

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
    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note TEXT,
      date TEXT
    );
    CREATE TABLE IF NOT EXISTS mood_ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mood TEXT,
      date TEXT UNIQUE
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

export const dropEntryTables = async () => {
  const db = await openDatabase();

  await db.execAsync(`
    DROP TABLE IF EXISTS food_intakes;
    DROP TABLE IF EXISTS mood_ratings;
    DROP TABLE IF EXISTS journal_entries;
  `);
};

export const insertJournalEntry = async (note: string, date: string) => {
  const db = await openDatabase();

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

  const fromISO = DateTime.fromJSDate(fromDate).startOf("day").toISODate();
  const toISO = DateTime.fromJSDate(toDate).endOf("day").toISODate();

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

export const insertOrUpdateMood = async (mood: string, date: string) => {
  const db = await openDatabase();

  return await db.runAsync(
    `INSERT INTO mood_ratings (mood, date) VALUES (?, ?)
     ON CONFLICT(date) DO UPDATE SET mood = excluded.mood`,
    mood,
    date
  );
};

export const getMoodByDate = async (date: string): Promise<string | null> => {
  const db = await openDatabase();
  const row = await db.getFirstAsync(
    "SELECT mood FROM mood_ratings WHERE date = ?",
    date
  );
  return row?.mood ?? null;
};

export const getMoodDataForRange = async (
  fromDate: Date,
  toDate: Date
): Promise<{ date: string; mood: string }[]> => {
  const db = await openDatabase();
  const fromISO = DateTime.fromJSDate(fromDate).startOf("day").toISODate();
  const toISO = DateTime.fromJSDate(toDate).endOf("day").toISODate();

  return await db.getAllAsync(
    `SELECT date, mood FROM mood_ratings WHERE date BETWEEN ? AND ? ORDER BY date ASC`,
    fromISO,
    toISO
  );
};

export const getFoodMoodCorrelationData = async (
  minOccurrences: number = 1
): Promise<FoodMoodCorrelation[]> => {
  const db = await openDatabase();

  const foodIntakes: FoodIntake[] = await db.getAllAsync(
    "SELECT * FROM food_intakes"
  );
  const moodRatings: MoodRating[] = await db.getAllAsync(
    "SELECT * FROM mood_ratings"
  );

  if (!foodIntakes.length || !moodRatings.length) {
    return [];
  }

  const moodByDate: Record<string, number> = {};
  moodRatings.forEach((rating) => {
    if (MOOD_SCORE_MAP[rating.mood] !== undefined) {
      moodByDate[rating.date] = MOOD_SCORE_MAP[rating.mood];
    }
  });

  const foodStats: Record<
    string,
    { sumMoodScore: number; occurrences: number }
  > = {};

  foodIntakes.forEach((intake) => {
    const moodScore = moodByDate[intake.date];
    if (moodScore === undefined) {
      return; // Skip if no mood rating for this date
    }

    const meals = [
      intake.breakfast,
      intake.lunch,
      intake.dinner,
      intake.snacks,
    ];

    meals.forEach((mealString) => {
      const items = splitMealItems(mealString);
      items.forEach((item) => {
        if (!foodStats[item]) {
          foodStats[item] = { sumMoodScore: 0, occurrences: 0 };
        }
        foodStats[item].sumMoodScore += moodScore;
        foodStats[item].occurrences += 1;
      });
    });
  });

  const aggregatedData: FoodMoodCorrelation[] = Object.entries(foodStats).map(
    ([foodName, stats]) => {
      return {
        foodName,
        averageMoodScore: stats.sumMoodScore / stats.occurrences,
        occurrences: stats.occurrences,
      };
    }
  );

  aggregatedData.sort((a, b) => b.averageMoodScore - a.averageMoodScore);

  return aggregatedData;
};
