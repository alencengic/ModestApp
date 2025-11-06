import { supabase } from '@/lib/supabase';

export type MealType = "breakfast" | "lunch" | "dinner" | "snacks" | null;

export interface Meal {
  id: string;
  user_id: string;
  name: string;
  meal_type: MealType;
  foods: string;
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

/**
 * Get all meals for the authenticated user
 */
export const getAllMeals = async (): Promise<Meal[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Get meals by type
 */
export const getMealsByType = async (mealType: MealType): Promise<Meal[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  if (!mealType) {
    return getAllMeals();
  }

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', user.id)
    .eq('meal_type', mealType)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Get meal by ID
 */
export const getMealById = async (id: string): Promise<Meal | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};

/**
 * Insert a new meal
 */
export const insertMeal = async (mealInput: MealInput): Promise<Meal> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const id = generateId();
  const now = new Date().toISOString();

  const meal = {
    id,
    user_id: user.id,
    name: mealInput.name,
    meal_type: mealInput.meal_type || null,
    foods: mealInput.foods.join(", "),
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from('meals')
    .insert(meal)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update a meal
 */
export const updateMeal = async (
  id: string,
  updates: Partial<MealInput>
): Promise<Meal | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.meal_type !== undefined) updateData.meal_type = updates.meal_type;
  if (updates.foods !== undefined) updateData.foods = updates.foods.join(", ");

  const { data, error } = await supabase
    .from('meals')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};

/**
 * Delete a meal
 */
export const deleteMeal = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
};

/**
 * Search meals by name
 */
export const searchMealsByName = async (query: string): Promise<Meal[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', user.id)
    .ilike('name', `%${query}%`)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
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