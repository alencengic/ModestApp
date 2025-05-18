import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import { dailyEnterScreenStyles } from "./DailyEnterScreen.styles";

import DailyJournalScreen from "@/views/DailyJournalScreen/DailyJournalScreen";

export default function DailyEnterScreen() {
  return (
    <SafeAreaView style={dailyEnterScreenStyles.safeArea}>
      <ScrollView>
        <DailyJournalScreen />
      </ScrollView>
    </SafeAreaView>
  );
}
