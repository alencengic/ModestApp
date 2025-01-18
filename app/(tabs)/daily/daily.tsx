import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import { dailyEnterScreenStyles } from "./DailyEnterScreen.styles";
import { MoodRating, ProductivityRating } from "./(partials)";

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
