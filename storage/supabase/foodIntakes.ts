import { supabase } from '@/lib/supabase';
import { DateTime } from 'luxon';

export interface FoodIntake {
  id: number;
  user_id: string;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface FoodIntakeInput {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  date: string;
}

export interface ChartDataItem {
  label: string;
  value: number;
  color: string;
  [key: string]: any;
}

export const insertFoodIntake = async (foodIntake: FoodIntakeInput) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('food_intakes')
    .insert({
      user_id: user.id,
      ...foodIntake,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateFoodIntake = async (
  id: number,
  foodIntake: Omit<FoodIntakeInput, 'date'>
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('food_intakes')
    .update({
      ...foodIntake,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getFoodIntakeByDate = async (date: string): Promise<FoodIntake | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('food_intakes')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};

export const getAllFoodIntakes = async (): Promise<FoodIntake[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('food_intakes')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getFoodIntakesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<FoodIntake[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('food_intakes')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getUniqueFoodsByType = async (): Promise<Record<
  "breakfast" | "lunch" | "dinner" | "snacks",
  string[]
>> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const result: Record<"breakfast" | "lunch" | "dinner" | "snacks", string[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };

  // Get all food intakes for the user
  const { data, error } = await supabase
    .from('food_intakes')
    .select('breakfast, lunch, dinner, snacks')
    .eq('user_id', user.id);

  if (error) throw error;

  if (data) {
    const uniqueFoods = {
      breakfast: new Set<string>(),
      lunch: new Set<string>(),
      dinner: new Set<string>(),
      snacks: new Set<string>(),
    };

    data.forEach((intake) => {
      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach((mealType) => {
        const foods = intake[mealType as keyof typeof intake];
        if (foods && typeof foods === 'string' && foods.trim()) {
          // Split by comma and clean up
          foods.split(',').forEach((food) => {
            const cleanFood = food.trim();
            if (cleanFood) {
              uniqueFoods[mealType as keyof typeof uniqueFoods].add(cleanFood);
            }
          });
        }
      });
    });

    // Convert sets to arrays
    Object.keys(uniqueFoods).forEach((mealType) => {
      result[mealType as keyof typeof result] = Array.from(
        uniqueFoods[mealType as keyof typeof uniqueFoods]
      );
    });
  }

  return result;
};

export const clearFoodIntakes = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('food_intakes')
    .delete()
    .eq('user_id', user.id);

  if (error) throw error;
};

export const getFoodIntakeChartData = async (
  range: "day" | "week" | "month" | "custom",
  customDate?: Date
): Promise<ChartDataItem[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

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

    // Get end of today to include all of today's data
    const toDate = DateTime.now().endOf("day");

    const { data: foodIntakes, error } = await supabase
      .from('food_intakes')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', fromDate.toISODate())
      .lte('date', toDate.toISODate());

    if (error) throw error;
    if (!foodIntakes || foodIntakes.length === 0) return [];

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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const categories = ["breakfast", "lunch", "dinner", "snacks"] as const;
  const result: Record<string, string[]> = {};

  // Get all food intakes for the user
  const { data, error } = await supabase
    .from('food_intakes')
    .select('breakfast, lunch, dinner, snacks')
    .eq('user_id', user.id);

  if (error) throw error;

  if (data) {
    const uniqueFoods = {
      breakfast: new Set<string>(),
      lunch: new Set<string>(),
      dinner: new Set<string>(),
      snacks: new Set<string>(),
    };

    data.forEach((intake) => {
      categories.forEach((category) => {
        const foods = intake[category];
        if (foods && typeof foods === 'string' && foods.trim()) {
          // Split by comma and clean up
          foods.split(',').forEach((food) => {
            const cleanFood = food.trim();
            if (cleanFood) {
              uniqueFoods[category].add(cleanFood);
            }
          });
        }
      });
    });

    // Convert sets to arrays
    categories.forEach((category) => {
      result[category] = Array.from(uniqueFoods[category]);
    });
  } else {
    categories.forEach((category) => {
      result[category] = [];
    });
  }

  return result as Record<"breakfast" | "lunch" | "dinner" | "snacks", string[]>;
};