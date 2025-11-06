import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

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
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      textAlign: "center",
      marginBottom: theme.spacing.lg,
    },
    mealSummary: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
    },
    mealLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    mealItems: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    feelingsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: theme.spacing.sm,
    },
    feelingButton: {
      width: "30%",
      aspectRatio: 1,
      borderRadius: theme.borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.sm,
    },
    feelingButtonActive: {
      borderWidth: 3,
      borderColor: theme.colors.primary,
    },
    feelingEmoji: {
      fontSize: 32,
      marginBottom: theme.spacing.xs,
    },
    feelingLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      textAlign: "center",
    },
    hint: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.lg,
    },
  });

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
