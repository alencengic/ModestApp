import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import SymptomForm from "@/views/SymptomForm/SymptomForm";

export default function PostMeal() {
  const { mealId, mealType } = useLocalSearchParams<{
    mealId?: string;
    mealType?: "breakfast" | "lunch" | "dinner" | "snack";
  }>();

  return (
    <>
      <Stack.Screen options={{ title: "Symptoms" }} />
      <SymptomForm
        mealId={mealId}
        defaultMealType={mealType}
        onSaved={() => history.back()}
      />
    </>
  );
}
