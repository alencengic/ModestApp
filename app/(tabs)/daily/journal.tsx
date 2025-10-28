import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import { createDailyEnterScreenStyles } from "./DailyEnterScreen.styles";
import { useTheme } from "@/context/ThemeContext";

import DailyJournalScreen from "@/views/DailyJournalScreen/DailyJournalScreen";

export default function DailyEnterScreen() {
  const { theme } = useTheme();
  const styles = createDailyEnterScreenStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <DailyJournalScreen />
      </ScrollView>
    </SafeAreaView>
  );
}
