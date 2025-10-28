import React from "react";
import { SafeAreaView, ScrollView, View, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

import MoodAnalyticsScreen from "@/views/MoodAnalyticsScreen/MoodAnalyticsScreen";

export default function DailyEnterScreen() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <MoodAnalyticsScreen />
      </ScrollView>
    </SafeAreaView>
  );
}
