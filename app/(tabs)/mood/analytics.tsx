import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import MoodAnalyticsScreen from "@/views/MoodAnalyticsScreen/MoodAnalyticsScreen";

export default function DailyEnterScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <MoodAnalyticsScreen />
      </ScrollView>
    </SafeAreaView>
  );
}
