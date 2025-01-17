import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import { dailyEnterScreenStyles } from "./DailyEnterScreen.styles";
import MoodRating from "./partials/MoodRating";
import ProductivityRating from "./partials/ProductivityRating";

const randomNumber = (): number => {
  return Math.floor(Math.random() * 26) + 125;
};

const generateRandomColor = (): string => {
  const randomColor = Math.floor(Math.random() * 0xffffff);
  return `#${randomColor.toString(16).padStart(6, "0")}`;
};

const data = (numberPoints = 5) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    value: randomNumber(),
    color: generateRandomColor(),
    label: `Label ${index + 1}`,
  }));

export default function DailyEnterScreen() {
  return (
    <SafeAreaView style={dailyEnterScreenStyles.safeArea}>
      <ScrollView>
        <MoodRating />
        <ProductivityRating />
      </ScrollView>
    </SafeAreaView>
  );
}
