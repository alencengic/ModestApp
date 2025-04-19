import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  insertFoodIntake as dbInsertFoodIntake,
  getFoodIntakeChartData as dbGetChartData,
} from "@/storage/database";
import { handleQueryError } from "./helpers/handleQueryError.helper";

export const useMutationInsertFoodIntake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dbInsertFoodIntake,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chartData"] });
    },
    onError: handleQueryError("Failed to insert food intake"),
  });
};

export const useQueryFoodIntakeChartData = () => {
  return {
    queryKey: ["chartData"],
    queryFn: dbGetChartData,
  };
};
