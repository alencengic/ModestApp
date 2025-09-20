import React from "react";
import { Stack } from "expo-router";
import SymptomTrendsScreen from "@/views/SymptomTrendsScreen/SymptomTrendsScreen";

export default function Trends() {
  return (
    <>
      <Stack.Screen options={{ title: "Symptom Trends" }} />
      <SymptomTrendsScreen />
    </>
  );
}
