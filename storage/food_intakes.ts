import { ChartDataItem } from "@/app/(tabs)/trends/trends";
import { DateTime } from "luxon";
import { openDatabase } from "./db_connection";

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

export interface FoodIntake {
  id: number;
  breakfast: string | null;
  lunch: string | null;
  dinner: string | null;
  snacks: string | null;
  date: string;
}

export const getAllFoodIntakes = async (): Promise<FoodIntake[]> => {
  const db = await openDatabase();
  const allRows = await db.getAllAsync("SELECT * FROM food_intakes");
  return allRows as FoodIntake[];
};

export const getFoodIntakeById = async (
  id: number
): Promise<FoodIntake | null> => {
  const db = await openDatabase();
  const foodIntake = await db.getFirstAsync(
    "SELECT * FROM food_intakes WHERE id = ?",
    id
  );
  return foodIntake as FoodIntake | null;
};

export const getFoodIntakeChartData = async (
  range: "day" | "week" | "month" | "custom",
  customDate?: Date
): Promise<ChartDataItem[]> => {
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

    const foodIntakes = (await db.getAllAsync(
      "SELECT * FROM food_intakes WHERE date >= ?",
      fromDate.toISODate()
    )) as FoodIntake[];

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
    const rows = (await db.getAllAsync(
      `SELECT DISTINCT ${key} FROM food_intakes WHERE ${key} IS NOT NULL AND ${key} != ''`
    )) as { [meal: string]: string }[];

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
