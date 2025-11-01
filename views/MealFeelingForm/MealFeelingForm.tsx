import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type FeelingType = "great" | "good" | "okay" | "bad" | "terrible";

interface MealFeelingFormProps {
  mealName: string;
  mealItems: string[];
  feeling: FeelingType | null;
  onChange: (feeling: FeelingType) => void;
}

export const MealFeelingForm: React.FC<MealFeelingFormProps> = ({
  mealName,
  mealItems,
  feeling,
  onChange,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const FEELING_OPTIONS: { value: FeelingType; icon: keyof typeof MaterialCommunityIcons.glyphMap; labelKey: string; color: string }[] = [
    { value: "great", icon: "emoticon-excited-outline", labelKey: "daily.great", color: "#A8B896" },
    { value: "good", icon: "emoticon-happy-outline", labelKey: "daily.good", color: "#D4CBBB" },
    { value: "okay", icon: "emoticon-neutral-outline", labelKey: "daily.okay", color: "#E8C4B0" },
    { value: "bad", icon: "emoticon-sad-outline", labelKey: "daily.bad", color: "#E8B4A0" },
    { value: "terrible", icon: "emoticon-cry-outline", labelKey: "daily.terrible", color: "#C88B6B" },
  ];

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
      gap: theme.spacing.md,
    },
    feelingButton: {
      width: 100,
      height: 100,
      borderRadius: theme.borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.sm,
    },
    feelingButtonActive: {
      borderWidth: 3,
      borderColor: theme.colors.primary,
    },
    feelingIcon: {
      marginBottom: theme.spacing.xs,
    },
    feelingLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      textAlign: "center",
      lineHeight: 14,
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
      <Text style={styles.title}>{t('daily.howDidYouFeel')}</Text>

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
            <View style={styles.feelingIcon}>
              <MaterialCommunityIcons 
                name={option.icon} 
                size={32} 
                color={theme.colors.textPrimary} 
              />
            </View>
            <Text style={styles.feelingLabel}>{t(option.labelKey)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {!feeling && (
        <Text style={styles.hint}>{t('daily.selectFeeling')}</Text>
      )}
    </View>
  );
};
