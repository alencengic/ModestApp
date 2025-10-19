import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BrightTheme } from "@/constants/Theme";

type FeelingType = "great" | "good" | "okay" | "bad" | "terrible";

interface MealFeelingFormProps {
  mealName: string;
  mealItems: string[];
  feeling: FeelingType | null;
  onChange: (feeling: FeelingType) => void;
}

const FEELING_OPTIONS: { value: FeelingType; emoji: string; label: string; color: string }[] = [
  { value: "great", emoji: "😄", label: "Great", color: "#A8B896" },
  { value: "good", emoji: "🙂", label: "Good", color: "#D4CBBB" },
  { value: "okay", emoji: "😐", label: "Okay", color: "#E8C4B0" },
  { value: "bad", emoji: "😕", label: "Bad", color: "#E8B4A0" },
  { value: "terrible", emoji: "😢", label: "Terrible", color: "#C88B6B" },
];

export const MealFeelingForm: React.FC<MealFeelingFormProps> = ({
  mealName,
  mealItems,
  feeling,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How did you feel after eating?</Text>

      {mealItems.length > 0 && (
        <View style={styles.mealSummary}>
          <Text style={styles.mealLabel}>{mealName}:</Text>
          <Text style={styles.mealItems}>{mealItems.join(", ")}</Text>
        </View>
      )}

      <View style={styles.feelingsContainer}>
        {FEELING_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.feelingButton,
              { backgroundColor: option.color },
              feeling === option.value && styles.feelingButtonActive,
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text style={styles.feelingEmoji}>{option.emoji}</Text>
            <Text style={styles.feelingLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {!feeling && (
        <Text style={styles.hint}>Select how you felt after this meal</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BrightTheme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
    textAlign: "center",
    marginBottom: BrightTheme.spacing.lg,
  },
  mealSummary: {
    backgroundColor: BrightTheme.colors.surface,
    padding: BrightTheme.spacing.md,
    borderRadius: BrightTheme.borderRadius.md,
    marginBottom: BrightTheme.spacing.lg,
  },
  mealLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
    marginBottom: BrightTheme.spacing.xs,
  },
  mealItems: {
    fontSize: 14,
    color: BrightTheme.colors.textSecondary,
    lineHeight: 20,
  },
  feelingsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: BrightTheme.spacing.md,
  },
  feelingButton: {
    width: "45%",
    aspectRatio: 1,
    borderRadius: BrightTheme.borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    padding: BrightTheme.spacing.md,
  },
  feelingButtonActive: {
    borderWidth: 3,
    borderColor: BrightTheme.colors.primary,
  },
  feelingEmoji: {
    fontSize: 48,
    marginBottom: BrightTheme.spacing.sm,
  },
  feelingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
  },
  hint: {
    fontSize: 14,
    color: BrightTheme.colors.textSecondary,
    textAlign: "center",
    marginTop: BrightTheme.spacing.lg,
  },
});
