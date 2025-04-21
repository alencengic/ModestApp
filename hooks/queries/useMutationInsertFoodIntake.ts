import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  insertFoodIntake as dbInsertFoodIntake,
  getFoodIntakeChartData as dbGetChartData,
} from "@/storage/database";
import { ChartData } from "@/app/(tabs)/trends/trends";
import { handleQueryError } from "./helpers/handleQueryError.helper";

export const useMutationInsertFoodIntake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dbInsertFoodIntake,
    onError: handleQueryError("Failed to insert food intake"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chartData"] });
    },
  });
};

export const useQueryFoodIntakeChartData = (
  range: "day" | "week" | "month" | "custom",
  customDate?: Date
) => {
  return {
    queryKey: ["chartData", range, customDate?.toISOString()],
    queryFn: () => dbGetChartData(range, customDate),
  } satisfies Parameters<typeof useQuery<ChartData[]>>[0];
};
