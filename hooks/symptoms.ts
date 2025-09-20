import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  insertSymptom,
  listSymptoms,
  listSymptomsByDate,
  listSymptomsByMeal,
  aggBloatingPerWeek,
  aggEnergyVsMeal,
  aggStoolDistribution,
  SymptomRow,
} from "../storage/symptom_entries";
import { nanoid } from "nanoid/non-secure";

export function useSymptomsList(limit = 200) {
  return useQuery({
    queryKey: ["symptoms", "list", limit],
    queryFn: () => listSymptoms(limit),
  });
}
export function useSymptomsByMeal(mealId?: string) {
  return useQuery({
    enabled: !!mealId,
    queryKey: ["symptoms", "meal", mealId],
    queryFn: () => listSymptomsByMeal(mealId!),
  });
}
export function useSymptomsByDate(isoDate: string) {
  return useQuery({
    queryKey: ["symptoms", "date", isoDate],
    queryFn: () => listSymptomsByDate(isoDate),
  });
}
export function useCreateSymptom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: Omit<SymptomRow, "id" | "created_at"> & { created_at?: string }
    ) => {
      const id = nanoid();
      await insertSymptom({ id, ...payload });
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["symptoms"] });
    },
  });
}
export function useSymptomAggregates() {
  return {
    bloatingPerWeek: useQuery({
      queryKey: ["symptoms", "agg", "bloatingPerWeek"],
      queryFn: aggBloatingPerWeek,
    }),
    energyVsMeal: useQuery({
      queryKey: ["symptoms", "agg", "energyVsMeal"],
      queryFn: aggEnergyVsMeal,
    }),
    stoolDist: useQuery({
      queryKey: ["symptoms", "agg", "stoolDist"],
      queryFn: aggStoolDistribution,
    }),
  };
}
