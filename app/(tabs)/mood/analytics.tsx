import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
