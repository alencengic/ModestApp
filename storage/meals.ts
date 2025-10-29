import { DateTime } from "luxon";
import { openDatabase } from "./db_connection";

export type MealType = "breakfast" | "lunch" | "dinner" | "snacks" | null;

export interface Meal {
  id: string;
  name: string;
  meal_type: MealType;
  foods: string; // comma-separated list of foods
  created_at: string;
  updated_at: string;
}

export interface MealInput {
  name: string;
  meal_type?: MealType;
  foods: string[];
}

// Helper to generate unique ID
const generateId = () => {
  return `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper to get current ISO timestamp
const getCurrentTimestamp = () => {
  return DateTime.now().toISO();
};

/**
 * Get all meals
 */
export const getAllMeals = async (): Promise<Meal[]> => {
  const db = await openDatabase();
  const meals = await db.getAllAsync<Meal>(
    "SELECT * FROM meals ORDER BY updated_at DESC"
  );
  return meals;
};

/**
 * Get meals by type
 */
export const getMealsByType = async (mealType: MealType): Promise<Meal[]> => {
  const db = await openDatabase();
  if (!mealType) {
    return getAllMeals();
  }
  const meals = await db.getAllAsync<Meal>(
    "SELECT * FROM meals WHERE meal_type = ? ORDER BY updated_at DESC",
    [mealType]
  );
  return meals;
};

/**
 * Get meal by ID
 */
export const getMealById = async (id: string): Promise<Meal | null> => {
  const db = await openDatabase();
  const meal = await db.getFirstAsync<Meal>(
    "SELECT * FROM meals WHERE id = ?",
    [id]
  );
  return meal || null;
};

/**
 * Insert a new meal
 */
export const insertMeal = async (mealInput: MealInput): Promise<Meal> => {
  const db = await openDatabase();
  const id = generateId();
  const now = getCurrentTimestamp();

  const meal: Meal = {
    id,
    name: mealInput.name,
    meal_type: mealInput.meal_type || null,
    foods: mealInput.foods.join(", "),
    created_at: now,
    updated_at: now,
  };

  await db.runAsync(
    `INSERT INTO meals (id, name, meal_type, foods, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [meal.id, meal.name, meal.meal_type, meal.foods, meal.created_at, meal.updated_at]
  );

  return meal;
};

/**
 * Update an existing meal
 */
export const updateMeal = async (
  id: string,
  mealInput: Partial<MealInput>
): Promise<Meal | null> => {
  const db = await openDatabase();
  const existing = await getMealById(id);

  if (!existing) {
    return null;
  }

  const now = getCurrentTimestamp();
  const updated: Meal = {
    ...existing,
    name: mealInput.name ?? existing.name,
    meal_type: mealInput.meal_type !== undefined ? mealInput.meal_type : existing.meal_type,
    foods: mealInput.foods ? mealInput.foods.join(", ") : existing.foods,
    updated_at: now,
  };

  await db.runAsync(
    `UPDATE meals
     SET name = ?, meal_type = ?, foods = ?, updated_at = ?
     WHERE id = ?`,
    [updated.name, updated.meal_type, updated.foods, updated.updated_at, id]
  );

  return updated;
};

/**
 * Delete a meal
 */
export const deleteMeal = async (id: string): Promise<boolean> => {
  const db = await openDatabase();
  const result = await db.runAsync("DELETE FROM meals WHERE id = ?", [id]);
  return result.changes > 0;
};

/**
 * Search meals by name
 */
export const searchMealsByName = async (query: string): Promise<Meal[]> => {
  const db = await openDatabase();
  const meals = await db.getAllAsync<Meal>(
    "SELECT * FROM meals WHERE name LIKE ? ORDER BY updated_at DESC",
    [`%${query}%`]
  );
  return meals;
};

/**
 * Get meal foods as array
 */
export const getMealFoodsArray = (meal: Meal): string[] => {
  return meal.foods
    .split(",")
    .map((food) => food.trim())
    .filter((food) => food.length > 0);
};
