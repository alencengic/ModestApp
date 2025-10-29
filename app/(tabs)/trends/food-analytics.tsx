import React from "react";
import { Stack } from "expo-router";
import FoodAnalyticsScreen from "@/views/FoodAnalyticsScreen";

export default function FoodAnalytics() {
  return (
    <>
      <Stack.Screen options={{ title: "Food Analytics" }} />
      <FoodAnalyticsScreen />
    </>
  );
}
