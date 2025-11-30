import React from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import SymptomForm from "@/views/SymptomForm/SymptomForm";
import { useTheme } from "@/context/ThemeContext";

export default function PostMeal() {
  const { mealId, mealType } = useLocalSearchParams<{
    mealId?: string;
    mealType?: "breakfast" | "lunch" | "dinner" | "snack";
  }>();
  const router = useRouter();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    backButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    backButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: "600",
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: "Symptoms" }} />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>
          <SymptomForm
            mealId={mealId}
            defaultMealType={mealType}
            onSaved={() => router.back()}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
