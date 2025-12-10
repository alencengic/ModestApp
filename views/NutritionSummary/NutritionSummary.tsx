import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { calculateTotalNutrition } from "@/constants/NutritionData";

interface NutritionSummaryProps {
  foods: string[];
  showCaffeine?: boolean;
  showMacros?: boolean;
  compact?: boolean;
}

export const NutritionSummary: React.FC<NutritionSummaryProps> = ({
  foods,
  showCaffeine = true,
  showMacros = true,
  compact = false,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const nutrition = useMemo(() => {
    return calculateTotalNutrition(foods);
  }, [foods]);

  if (foods.length === 0) {
    return null;
  }

  const getCaffeineStatus = (caffeine: number) => {
    if (caffeine === 0) return { text: t("nutrition.noCaffeine"), color: theme.colors.success };
    if (caffeine <= 100) return { text: t("nutrition.lowCaffeine"), color: theme.colors.success };
    if (caffeine <= 200) return { text: t("nutrition.moderateCaffeine"), color: theme.colors.warning };
    if (caffeine <= 400) return { text: t("nutrition.highCaffeine"), color: theme.colors.warning };
    return { text: t("nutrition.veryHighCaffeine"), color: theme.colors.error };
  };

  const getCalorieStatus = (calories: number) => {
    // Based on typical meal calories
    if (calories <= 400) return { text: t("nutrition.lightMeal"), color: theme.colors.success };
    if (calories <= 700) return { text: t("nutrition.normalMeal"), color: theme.colors.info };
    if (calories <= 1000) return { text: t("nutrition.heavyMeal"), color: theme.colors.warning };
    return { text: t("nutrition.veryHeavyMeal"), color: theme.colors.error };
  };

  const caffeineStatus = getCaffeineStatus(nutrition.totalCaffeine);
  const calorieStatus = getCalorieStatus(nutrition.totalCalories);

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.compactRow}>
          <Text style={[styles.compactLabel, { color: theme.colors.textSecondary }]}>
            {t("nutrition.calories")}:
          </Text>
          <Text style={[styles.compactValue, { color: theme.colors.textPrimary }]}>
            {nutrition.totalCalories} kcal
          </Text>
        </View>
        {showCaffeine && nutrition.totalCaffeine > 0 && (
          <View style={styles.compactRow}>
            <Text style={[styles.compactLabel, { color: theme.colors.textSecondary }]}>
              {t("nutrition.caffeine")}:
            </Text>
            <Text style={[styles.compactValue, { color: caffeineStatus.color }]}>
              {nutrition.totalCaffeine}mg
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {t("nutrition.summary")}
      </Text>

      {/* Calories */}
      <View style={styles.mainStat}>
        <View style={styles.statRow}>
          <Text style={[styles.statEmoji]}>🔥</Text>
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
            {nutrition.totalCalories}
          </Text>
          <Text style={[styles.statUnit, { color: theme.colors.textSecondary }]}>
            kcal
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: calorieStatus.color + "20" }]}>
          <Text style={[styles.statusText, { color: calorieStatus.color }]}>
            {calorieStatus.text}
          </Text>
        </View>
      </View>

      {/* Macros */}
      {showMacros && (
        <View style={styles.macrosContainer}>
          <View style={[styles.macroBox, { backgroundColor: theme.colors.primaryLight }]}>
            <Text style={[styles.macroValue, { color: theme.colors.primary }]}>
              {Math.round(nutrition.totalProtein)}g
            </Text>
            <Text style={[styles.macroLabel, { color: theme.colors.textSecondary }]}>
              {t("nutrition.protein")}
            </Text>
          </View>
          <View style={[styles.macroBox, { backgroundColor: theme.colors.warning + "20" }]}>
            <Text style={[styles.macroValue, { color: theme.colors.warning }]}>
              {Math.round(nutrition.totalCarbs)}g
            </Text>
            <Text style={[styles.macroLabel, { color: theme.colors.textSecondary }]}>
              {t("nutrition.carbs")}
            </Text>
          </View>
          <View style={[styles.macroBox, { backgroundColor: theme.colors.info + "20" }]}>
            <Text style={[styles.macroValue, { color: theme.colors.info }]}>
              {Math.round(nutrition.totalFat)}g
            </Text>
            <Text style={[styles.macroLabel, { color: theme.colors.textSecondary }]}>
              {t("nutrition.fat")}
            </Text>
          </View>
        </View>
      )}

      {/* Caffeine */}
      {showCaffeine && (
        <View style={[styles.caffeineContainer, { borderTopColor: theme.colors.border }]}>
          <View style={styles.caffeineRow}>
            <Text style={styles.caffeineEmoji}>☕</Text>
            <Text style={[styles.caffeineLabel, { color: theme.colors.textSecondary }]}>
              {t("nutrition.caffeine")}
            </Text>
            <Text style={[styles.caffeineValue, { color: caffeineStatus.color }]}>
              {nutrition.totalCaffeine}mg
            </Text>
          </View>
          {nutrition.totalCaffeine > 0 && (
            <View style={[styles.caffeineTip, { backgroundColor: caffeineStatus.color + "15" }]}>
              <Text style={[styles.caffeineTipText, { color: caffeineStatus.color }]}>
                {caffeineStatus.text}
                {nutrition.totalCaffeine > 200 && ` - ${t("nutrition.caffeineWarning")}`}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Breakdown hint */}
      <Text style={[styles.trackedCount, { color: theme.colors.textSecondary }]}>
        {t("nutrition.trackedFoods", { count: nutrition.breakdown.filter(b => b.nutrition).length, total: foods.length })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  mainStat: {
    alignItems: "center",
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  statEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  statValue: {
    fontSize: 36,
    fontWeight: "700",
  },
  statUnit: {
    fontSize: 16,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 16,
  },
  macroBox: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  macroLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  caffeineContainer: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  caffeineRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  caffeineEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  caffeineLabel: {
    fontSize: 14,
    flex: 1,
  },
  caffeineValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  caffeineTip: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  caffeineTipText: {
    fontSize: 12,
    textAlign: "center",
  },
  trackedCount: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 12,
  },
  // Compact styles
  compactContainer: {
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  compactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  compactLabel: {
    fontSize: 12,
  },
  compactValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default NutritionSummary;
