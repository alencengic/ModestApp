import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { useFont, SkFont } from "@shopify/react-native-skia";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { useQueryFoodIntakeChartData } from "@/hooks/queries/useMutationInsertFoodIntake";
import { createStyles } from "./TrendsScreen.styles";
import { useTheme } from "@/context/ThemeContext";

export interface ChartDataItem {
  label: string;
  value: number;
  color: string;
  [key: string]: any;
}

// Modern color palette - each food gets a unique color
const CHART_COLORS = [
  "#5B9BD5", // Blue
  "#70AD47", // Green
  "#FFC000", // Orange
  "#C55A11", // Dark Orange
  "#9E480E", // Brown
  "#997300", // Olive
  "#4472C4", // Dark Blue
  "#ED7D31", // Light Orange
  "#A5A5A5", // Gray
  "#255E91", // Navy
];

const TrendsAndAnalyticsScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const chartAxisFont: SkFont | null = useFont(
    require("@/assets/fonts/SpaceMono-Regular.ttf"),
    12
  );

  const [range, setRange] = useState<"day" | "week" | "month" | "custom">(
    "week"
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const queryOptions = useQueryFoodIntakeChartData(range, selectedDate);
  const {
    data: rawDataFromQuery = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<ChartDataItem[], Error>({
    ...queryOptions,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
  });

  const chartData: ChartDataItem[] = useMemo(() => {
    const processedData = (rawDataFromQuery ?? [])
      .filter((item): item is ChartDataItem => {
        if (!item || typeof item !== "object") return false;
        const { label, value, color } = item;
        if (typeof label !== "string") return false;
        const trimmedLabel = label.trim();
        if (trimmedLabel === "" || trimmedLabel.toLowerCase() === "undefined")
          return false;
        if (typeof value !== "number" || isNaN(value) || value <= 0)
          return false;
        if (typeof color !== "string" || color.trim() === "") return false;
        return true;
      })
      .map((item, index) => ({
        ...item,
        label: item.label.trim(),
        value: item.value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));
    return processedData;
  }, [rawDataFromQuery]);

  const totalItems = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  const topItem = useMemo(() => {
    if (chartData.length === 0) return null;
    return chartData.reduce((prev, current) =>
      current.value > prev.value ? current : prev
    );
  }, [chartData]);

  // Calculate insights
  const insights = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;

    const totalEntries = chartData.reduce((sum, item) => sum + item.value, 0);
    const avgEntriesPerFood = (totalEntries / chartData.length).toFixed(1);

    // Find diversity score (more foods = higher diversity)
    const diversityScore = Math.min((chartData.length / 10) * 100, 100).toFixed(0);

    // Top 3 foods (create a copy to avoid mutating chartData)
    const top3 = [...chartData]
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    // Calculate if user is eating variety
    const topFoodPercentage = topItem ? ((topItem.value / totalEntries) * 100).toFixed(0) : 0;
    const isBalanced = parseFloat(topFoodPercentage) < 40;

    return {
      totalEntries,
      avgEntriesPerFood,
      diversityScore,
      top3,
      topFoodPercentage,
      isBalanced,
      uniqueFoods: chartData.length,
    };
  }, [chartData, topItem]);

  const isDataValid = useMemo(() => {
    if (!chartData || chartData.length === 0) return false;
    return chartData.every(
      (d) =>
        typeof d.label === "string" &&
        d.label.trim().toLowerCase() !== "undefined" &&
        d.label.trim() !== "" &&
        typeof d.value === "number" &&
        !isNaN(d.value) &&
        d.value > 0
    );
  }, [chartData]);

  const legendData = useMemo(() => {
    if (!isDataValid || !chartData) return [];
    return chartData.map((item) => ({
      name: item.label,
      symbol: { fill: item.color },
      value: item.value,
    }));
  }, [chartData, isDataValid]);

  // Sorted chart data for display (sorted by value, highest first)
  const sortedChartData = useMemo(() => {
    return [...chartData].sort((a, b) => b.value - a.value);
  }, [chartData]);

  const getRangeLabel = () => {
    switch (range) {
      case "day":
        return "Today";
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "custom":
        return selectedDate.toLocaleDateString();
      default:
        return "";
    }
  };

  if (chartAxisFont === null && !isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Loading font...</Text>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Time Period</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                range === "day" && styles.filterButtonActive,
              ]}
              onPress={() => {
                setRange("day");
                setSelectedDate(new Date());
              }}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  range === "day" && styles.filterButtonTextActive,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                range === "week" && styles.filterButtonActive,
              ]}
              onPress={() => {
                setRange("week");
                setSelectedDate(new Date());
              }}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  range === "week" && styles.filterButtonTextActive,
                ]}
              >
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                range === "month" && styles.filterButtonActive,
              ]}
              onPress={() => {
                setRange("month");
                setSelectedDate(new Date());
              }}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  range === "month" && styles.filterButtonTextActive,
                ]}
              >
                Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                range === "custom" && styles.filterButtonActive,
              ]}
              onPress={() => {
                setShowDatePicker(true);
              }}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  range === "custom" && styles.filterButtonTextActive,
                ]}
              >
                Custom
              </Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedDate(date);
                  setRange("custom");
                }
              }}
            />
          )}
          {range === "custom" && (
            <View style={styles.selectedDateDisplay}>
              <Text style={styles.selectedDateText}>
                Selected: {selectedDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          )}
        </View>

        {/* Summary Stats */}
        {insights && !isLoading && isDataValid && (
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{insights.totalEntries}</Text>
                <Text style={styles.summaryLabel}>Total Entries</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{insights.uniqueFoods}</Text>
                <Text style={styles.summaryLabel}>Unique Foods</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{insights.diversityScore}%</Text>
                <Text style={styles.summaryLabel}>Diversity Score</Text>
              </View>
            </View>
          </View>
        )}

        {/* Insights & Recommendations */}
        {insights && !isLoading && isDataValid && (
          <View style={styles.insightsCard}>
            <Text style={styles.cardTitle}>💡 Insights & Tips</Text>

            {insights.isBalanced ? (
              <View style={styles.insightItem}>
                <Text style={styles.insightIcon}>✅</Text>
                <View style={styles.insightText}>
                  <Text style={styles.insightTitle}>Great food variety!</Text>
                  <Text style={styles.insightDesc}>
                    Your top food is only {insights.topFoodPercentage}% of your diet. Keep it up!
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.insightItem}>
                <Text style={styles.insightIcon}>⚠️</Text>
                <View style={styles.insightText}>
                  <Text style={styles.insightTitle}>Try more variety</Text>
                  <Text style={styles.insightDesc}>
                    {topItem?.label} makes up {insights.topFoodPercentage}% of your diet. Consider diversifying.
                  </Text>
                </View>
              </View>
            )}

            {parseFloat(insights.diversityScore) >= 70 && (
              <View style={styles.insightItem}>
                <Text style={styles.insightIcon}>🌟</Text>
                <View style={styles.insightText}>
                  <Text style={styles.insightTitle}>Excellent diversity!</Text>
                  <Text style={styles.insightDesc}>
                    You're eating {insights.uniqueFoods} different foods. This promotes better nutrition.
                  </Text>
                </View>
              </View>
            )}

            {parseFloat(insights.diversityScore) < 50 && (
              <View style={styles.insightItem}>
                <Text style={styles.insightIcon}>💡</Text>
                <View style={styles.insightText}>
                  <Text style={styles.insightTitle}>Expand your food choices</Text>
                  <Text style={styles.insightDesc}>
                    Try adding 2-3 new foods this week to improve nutritional balance.
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.chartWrapper}>
          <Text style={styles.chartTitle}>Food Intake Analysis</Text>
          <Text style={styles.chartSubtitle}>{getRangeLabel()}</Text>

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#C88B6B" />
              <Text style={{ marginTop: 16, color: theme.colors.textSecondary }}>
                Loading chart data...
              </Text>
            </View>
          ) : isError ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateIcon}>⚠️</Text>
              <Text style={styles.errorText}>
                Error loading data. Please try again.
              </Text>
            </View>
          ) : !isDataValid ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateIcon}>📊</Text>
              <Text style={styles.emptyStateText}>
                No food intake data available for the selected period.{"\n"}
                Start tracking your meals to see insights!
              </Text>
            </View>
          ) : (
            <>
              {/* Top 3 Foods Highlight */}
              {insights && insights.top3.length > 0 && (
                <View style={styles.topFoodsSection}>
                  <Text style={styles.topFoodsTitle}>🏆 Top Foods</Text>
                  <View style={styles.topFoodsContainer}>
                    {insights.top3.map((item, index) => {
                      const percentage = ((item.value / totalItems) * 100).toFixed(1);
                      const medals = ["🥇", "🥈", "🥉"];
                      return (
                        <View key={index} style={styles.topFoodCard}>
                          <Text style={styles.topFoodMedal}>{medals[index]}</Text>
                          <Text style={styles.topFoodName} numberOfLines={1}>
                            {item.label}
                          </Text>
                          <Text style={styles.topFoodValue}>
                            {item.value} entries
                          </Text>
                          <View style={styles.topFoodBar}>
                            <View
                              style={[
                                styles.topFoodBarFill,
                                {
                                  width: `${percentage}%`,
                                  backgroundColor: item.color,
                                },
                              ]}
                            />
                          </View>
                          <Text style={styles.topFoodPercentage}>{percentage}%</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Visual Food Cards */}
              <View style={styles.foodCardsContainer}>
                {sortedChartData.map((item, index) => {
                  const percentage = ((item.value / totalItems) * 100).toFixed(1);
                  const isTopFood = index < 3;
                  return (
                    <View key={index} style={[
                      styles.foodCard,
                      isTopFood && styles.foodCardHighlight
                    ]}>
                      <View
                        style={[
                          styles.foodCardBar,
                          {
                            backgroundColor: item.color,
                            width: `${percentage}%`,
                          },
                        ]}
                      />
                      <View style={styles.foodCardContent}>
                        <View style={styles.foodCardHeader}>
                          <View
                            style={[
                              styles.foodCardDot,
                              { backgroundColor: item.color },
                            ]}
                          />
                          <Text style={styles.foodCardLabel} numberOfLines={1}>
                            {item.label}
                          </Text>
                          {isTopFood && (
                            <Text style={styles.rankBadge}>#{index + 1}</Text>
                          )}
                        </View>
                        <View style={styles.foodCardStats}>
                          <Text style={styles.foodCardValue}>{item.value}</Text>
                          <Text style={styles.foodCardPercentage}>
                            {percentage}%
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Stats */}
              {totalItems > 0 && (
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{chartData.length}</Text>
                    <Text style={styles.statLabel}>Foods</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{totalItems}</Text>
                    <Text style={styles.statLabel}>Total Entries</Text>
                  </View>
                  {topItem && (
                    <View style={styles.statItem}>
                      <Text
                        style={[styles.statValue, { fontSize: 16 }]}
                        numberOfLines={1}
                      >
                        {topItem.label}
                      </Text>
                      <Text style={styles.statLabel}>Most Frequent</Text>
                    </View>
                  )}
                </View>
              )}

            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrendsAndAnalyticsScreen;
