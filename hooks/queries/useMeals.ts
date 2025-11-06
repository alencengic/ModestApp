import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllMeals,
  getMealsByType,
  getMealById,
  insertMeal,
  updateMeal,
  deleteMeal,
  searchMealsByName,
  type Meal,
  type MealInput,
  type MealType,
} from "@/storage/database";

// Query keys
export const mealsKeys = {
  all: ["meals"] as const,
  byType: (type: MealType) => ["meals", "type", type] as const,
  byId: (id: string) => ["meals", "id", id] as const,
  search: (query: string) => ["meals", "search", query] as const,
};

/**
 * Get all meals
 */
export const useGetAllMeals = () => {
  return useQuery({
    queryKey: mealsKeys.all,
    queryFn: getAllMeals,
  });
};

/**
 * Get meals by type
 */
export const useGetMealsByType = (mealType: MealType) => {
  return useQuery({
    queryKey: mealsKeys.byType(mealType),
    queryFn: () => getMealsByType(mealType),
  });
};

/**
 * Get meal by ID
 */
export const useGetMealById = (id: string) => {
  return useQuery({
    queryKey: mealsKeys.byId(id),
    queryFn: () => getMealById(id),
    enabled: !!id,
  });
};

/**
 * Search meals by name
 */
export const useSearchMeals = (query: string) => {
  return useQuery({
    queryKey: mealsKeys.search(query),
    queryFn: () => searchMealsByName(query),
    enabled: query.length > 0,
  });
};

/**
 * Insert new meal
 */
export const useInsertMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: insertMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealsKeys.all });
    },
  });
};

/**
 * Update meal
 */
export const useUpdateMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MealInput> }) =>
      updateMeal(id, data),
    onSuccess: (meal) => {
      queryClient.invalidateQueries({ queryKey: mealsKeys.all });
      if (meal) {
        queryClient.invalidateQueries({ queryKey: mealsKeys.byId(meal.id) });
      }
    },
  });
};

/**
 * Delete meal
 */
export const useDeleteMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealsKeys.all });
    },
  });
};
