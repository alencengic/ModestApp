import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

interface WaterIntakeTrackerProps {
  value: number;
  onChange: (value: number) => void;
  maxGlasses?: number;
}

const GLASS_SIZE_ML = 250; // 250ml per glass

export const WaterIntakeTracker: React.FC<WaterIntakeTrackerProps> = ({
  value,
  onChange,
  maxGlasses = 12,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const handleIncrement = () => {
    if (value < maxGlasses) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  const handleGlassPress = (glassIndex: number) => {
    // If tapping on a filled glass, set to that amount
    // If tapping on the first empty glass, fill it
    if (glassIndex < value) {
      // Tapping on a filled glass - set to that amount (unfill glasses after it)
      onChange(glassIndex);
    } else {
      // Tapping on an empty glass - fill up to and including that glass
      onChange(glassIndex + 1);
    }
  };

  const totalMl = value * GLASS_SIZE_ML;
  const totalLiters = (totalMl / 1000).toFixed(1);

  // Determine hydration status
  const getHydrationStatus = () => {
    if (value === 0) return { text: t("water.startDrinking"), color: theme.colors.textSecondary };
    if (value < 4) return { text: t("water.keepGoing"), color: theme.colors.warning };
    if (value < 8) return { text: t("water.goodProgress"), color: theme.colors.info };
    return { text: t("water.wellHydrated"), color: theme.colors.success };
  };

  const hydrationStatus = getHydrationStatus();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.icon]}>💧</Text>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {t("water.title")}
        </Text>
      </View>

      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        {t("water.subtitle")}
      </Text>

      {/* Counter display */}
      <View style={[styles.counterContainer, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.counterButton,
            { backgroundColor: value === 0 ? theme.colors.surfaceVariant : theme.colors.primary },
          ]}
          onPress={handleDecrement}
          disabled={value === 0}
        >
          <Text style={[styles.counterButtonText, { color: value === 0 ? theme.colors.textSecondary : "#fff" }]}>
            −
          </Text>
        </TouchableOpacity>

        <View style={styles.counterDisplay}>
          <Text style={[styles.counterValue, { color: theme.colors.primary }]}>
            {value}
          </Text>
          <Text style={[styles.counterLabel, { color: theme.colors.textSecondary }]}>
            {value === 1 ? t("water.glass") : t("water.glasses")}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.counterButton,
            { backgroundColor: value === maxGlasses ? theme.colors.surfaceVariant : theme.colors.primary },
          ]}
          onPress={handleIncrement}
          disabled={value === maxGlasses}
        >
          <Text style={[styles.counterButtonText, { color: value === maxGlasses ? theme.colors.textSecondary : "#fff" }]}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      {/* Visual glass grid */}
      <View style={styles.glassGrid}>
        {Array.from({ length: 8 }).map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleGlassPress(index)}
            style={styles.glassWrapper}
          >
            <View
              style={[
                styles.glass,
                {
                  backgroundColor: index < value ? theme.colors.primary + "30" : theme.colors.surfaceVariant,
                  borderColor: index < value ? theme.colors.primary : theme.colors.border,
                },
              ]}
            >
              <Text style={styles.glassIcon}>
                {index < value ? "💧" : "○"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats row */}
      <View style={[styles.statsRow, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
            {totalMl}ml
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            {t("water.total")}
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
            {totalLiters}L
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            {t("water.liters")}
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: hydrationStatus.color }]}>
            {Math.round((value / 8) * 100)}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            {t("water.dailyGoal")}
          </Text>
        </View>
      </View>

      {/* Hydration status */}
      <View style={[styles.statusContainer, { backgroundColor: hydrationStatus.color + "15" }]}>
        <Text style={[styles.statusText, { color: hydrationStatus.color }]}>
          {hydrationStatus.text}
        </Text>
      </View>

      {/* Quick add buttons */}
      <View style={styles.quickAddRow}>
        {[1, 2, 4].map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[styles.quickAddButton, { borderColor: theme.colors.primary }]}
            onPress={() => onChange(Math.min(value + amount, maxGlasses))}
          >
            <Text style={[styles.quickAddText, { color: theme.colors.primary }]}>
              +{amount} 💧
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 28,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
  },
  counterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  counterButtonText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  counterDisplay: {
    alignItems: "center",
    marginHorizontal: 30,
  },
  counterValue: {
    fontSize: 48,
    fontWeight: "bold",
  },
  counterLabel: {
    fontSize: 14,
    marginTop: -5,
  },
  glassGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  glassWrapper: {
    padding: 2,
  },
  glass: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  glassIcon: {
    fontSize: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  statusContainer: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  quickAddRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  quickAddButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  quickAddText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default WaterIntakeTracker;
