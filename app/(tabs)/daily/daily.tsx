import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import { dailyEnterScreenStyles } from "./DailyEnterScreen.styles";

import ProductivityRating from "@/views/ProductivityRating";
import FoodIntakeForm from "@/views/FoodIntakeForm";
import WeatherDisplay from "@/views/WeatherDisplay";
import MoodRating from "@/views/MoodRating";

export default function DailyEnterScreen() {
  return (
    <SafeAreaView style={dailyEnterScreenStyles.safeArea}>
      <ScrollView>
        <MoodRating />
        <ProductivityRating />
        <FoodIntakeForm />
        <WeatherDisplay location="New York" />
      </ScrollView>
    </SafeAreaView>
  );
}
