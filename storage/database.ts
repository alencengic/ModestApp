import { ChartData } from "@/app/(tabs)/trends/trends";
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
      snacks TEXT
    );
  `);

  const tables = await db.getAllAsync(
    "SELECT name FROM sqlite_master WHERE type='table'"
  );

  return db;
};

export const insertFoodIntake = async (foodIntake: {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
}) => {
  const db = await openDatabase();
  const result = await db.runAsync(
    "INSERT INTO food_intakes (breakfast, lunch, dinner, snacks) VALUES (?, ?, ?, ?)",
    foodIntake.breakfast,
    foodIntake.lunch,
    foodIntake.dinner,
    foodIntake.snacks
  );

  return result;
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
  console.log(allRows);
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

interface FoodIntake {
  id: number;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
}

const generateColorMap = () => {
  const colorMap = new Map<string, string>();
  return (label: string): string => {
    if (!colorMap.has(label)) {
      const randomColor = Math.floor(Math.random() * 0xffffff);
      colorMap.set(label, `#${randomColor.toString(16).padStart(6, "0")}`);
    }
    return colorMap.get(label)!;
  };
};

export const getFoodIntakeChartData = async (): Promise<ChartData[]> => {
  const db = await openDatabase();
  try {
    const foodIntakes: FoodIntake[] = await db.getAllAsync(
      "SELECT * FROM food_intakes"
    );

    if (foodIntakes.length === 0) return [];

    const mealMap = new Map<string, number>();
    const getColor = generateColorMap();

    for (const row of foodIntakes) {
      [row.breakfast, row.lunch, row.dinner, row.snacks].forEach((meal) => {
        const trimmed = meal?.trim();
        if (trimmed) {
          const current = mealMap.get(trimmed) || 0;
          mealMap.set(trimmed, current + 1);
        }
      });
    }

    const chartData: ChartData[] = Array.from(mealMap.entries()).map(
      ([label, value]) => ({
        label,
        value,
        color: getColor(label),
      })
    );

    return chartData;
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
