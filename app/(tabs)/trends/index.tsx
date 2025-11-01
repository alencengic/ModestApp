import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useFont, SkFont } from "@shopify/react-native-skia";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { useQueryFoodIntakeChartData } from "@/hooks/queries/useMutationInsertFoodIntake";
import { createStyles } from "./_TrendsScreen.styles";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  const { t } = useTranslation();
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
  const [showAllFoods, setShowAllFoods] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const FOODS_TO_SHOW = 10;

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
    const diversityScore = Math.min((chartData.length / 10) * 100, 100).toFixed(
      0
    );

    // Top 3 foods (create a copy to avoid mutating chartData)
    const top3 = [...chartData].sort((a, b) => b.value - a.value).slice(0, 3);

    // Calculate if user is eating variety
    const topFoodPercentage = topItem
      ? ((topItem.value / totalEntries) * 100).toFixed(0)
      : "0";
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
        return t("trendsAnalytics.today");
      case "week":
        return t("trendsAnalytics.week");
      case "month":
        return t("trendsAnalytics.month");
      case "custom":
        return (
          t("trendsAnalytics.selected") +
          ": " +
          selectedDate.toLocaleDateString()
        );
      default:
        return "";
    }
  };

  if (chartAxisFont === null && !isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>{t("trendsAnalytics.loadingFont")}</Text>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>
            {t("trendsAnalytics.timePeriod")}
          </Text>
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
                {t("trendsAnalytics.today")}
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
                {t("trendsAnalytics.week")}
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
                {t("trendsAnalytics.month")}
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
                {t("trendsAnalytics.custom")}
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
                {t("trendsAnalytics.selected")}:{" "}
                {selectedDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          )}
        </View>

        {/* Summary Stats */}
        {insights && !isLoading && isDataValid && (
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>{t("trendsAnalytics.summary")}</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{insights.totalEntries}</Text>
                <Text style={styles.summaryLabel}>
                  {t("trendsAnalytics.totalEntries")}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{insights.uniqueFoods}</Text>
                <Text style={styles.summaryLabel}>
                  {t("trendsAnalytics.uniqueFoods")}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {insights.diversityScore}%
                </Text>
                <Text style={styles.summaryLabel}>
                  {t("trendsAnalytics.diversityScore")}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Insights & Recommendations */}
        {insights && !isLoading && isDataValid && (
          <View style={styles.insightsCard}>
            <Text style={styles.cardTitle}>
              {t("trendsAnalytics.insightsTips")}
            </Text>

            {insights.isBalanced ? (
              <View style={styles.insightItem}>
                <Text style={styles.insightIcon}>✅</Text>
                <View style={styles.insightText}>
                  <Text style={styles.insightTitle}>
                    {t("trendsAnalytics.greatVariety")}
                  </Text>
                  <Text style={styles.insightDesc}>
                    {t("trendsAnalytics.varietyDescription", {
                      percent: insights.topFoodPercentage,
                    })}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.insightItem}>
                <Text style={styles.insightIcon}>⚠️</Text>
                <View style={styles.insightText}>
                  <Text style={styles.insightTitle}>
                    {t("trendsAnalytics.tryVariety")}
                  </Text>
                  <Text style={styles.insightDesc}>
                    {t("trendsAnalytics.tryVarietyDescription", {
                      food: topItem?.label,
                      percent: insights.topFoodPercentage,
                    })}
                  </Text>
                </View>
              </View>
            )}

            {parseFloat(insights.diversityScore) >= 70 && (
              <View style={styles.insightItem}>
                <Text style={styles.insightIcon}>🌟</Text>
                <View style={styles.insightText}>
                  <Text style={styles.insightTitle}>
                    {t("trendsAnalytics.excellentDiversity")}
                  </Text>
                  <Text style={styles.insightDesc}>
                    {t("trendsAnalytics.excellentDiversityDescription", {
                      count: insights.uniqueFoods,
                    })}
                  </Text>
                </View>
              </View>
            )}

            {parseFloat(insights.diversityScore) < 50 && (
              <View style={styles.insightItem}>
                <Text style={styles.insightIcon}>💡</Text>
                <View style={styles.insightText}>
                  <Text style={styles.insightTitle}>
                    {t("trendsAnalytics.expandChoices")}
                  </Text>
                  <Text style={styles.insightDesc}>
                    {t("trendsAnalytics.expandChoicesDescription")}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.chartWrapper}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: theme.spacing.sm,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.chartTitle}>
                {t("trendsAnalytics.title")}
              </Text>
              <Text style={styles.chartSubtitle}>{getRangeLabel()}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowInfoModal(true)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: theme.colors.surface,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#C88B6B" />
              <Text
                style={{ marginTop: 16, color: theme.colors.textSecondary }}
              >
                {t("trendsAnalytics.loadingData")}
              </Text>
            </View>
          ) : isError ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateIcon}>⚠️</Text>
              <Text style={styles.errorText}>
                {t("trendsAnalytics.errorLoading")}
              </Text>
            </View>
          ) : !isDataValid ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateIcon}>📊</Text>
              <Text style={styles.emptyStateText}>
                {t("trendsAnalytics.noData")}
              </Text>
            </View>
          ) : (
            <>
              {/* Top 3 Foods Highlight */}
              {insights && insights.top3.length > 0 && (
                <View style={styles.topFoodsSection}>
                  <Text style={styles.topFoodsTitle}>
                    {t("trendsAnalytics.topFoods")}
                  </Text>
                  <View style={styles.topFoodsContainer}>
                    {insights.top3.map((item, index) => {
                      const percentage = (
                        (item.value / totalItems) *
                        100
                      ).toFixed(1);
                      const medals = ["🥇", "🥈", "🥉"];
                      return (
                        <View key={index} style={styles.topFoodCard}>
                          <Text style={styles.topFoodMedal}>
                            {medals[index]}
                          </Text>
                          <Text style={styles.topFoodName} numberOfLines={1}>
                            {item.label}
                          </Text>
                          <Text style={styles.topFoodValue}>
                            {item.value} {t("trendsAnalytics.entries")}
                          </Text>
                          <View style={styles.topFoodBar}>
                            <View
                              style={[
                                styles.topFoodBarFill,
                                {
                                  width: `${percentage}%` as any,
                                  backgroundColor: item.color,
                                },
                              ]}
                            />
                          </View>
                          <Text style={styles.topFoodPercentage}>
                            {percentage}%
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Visual Food Cards - Limited to top 10 by default */}
              <View style={styles.foodCardsContainer}>
                {sortedChartData
                  .slice(
                    0,
                    showAllFoods ? sortedChartData.length : FOODS_TO_SHOW
                  )
                  .map((item, index) => {
                    const percentage = (
                      (item.value / totalItems) *
                      100
                    ).toFixed(1);
                    const isTopFood = index < 3;
                    return (
                      <View
                        key={index}
                        style={[
                          styles.foodCard,
                          isTopFood && styles.foodCardHighlight,
                        ]}
                      >
                        <View
                          style={[
                            styles.foodCardBar,
                            {
                              backgroundColor: item.color,
                              width: `${percentage}%` as any,
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
                            <Text
                              style={styles.foodCardLabel}
                              numberOfLines={1}
                            >
                              {item.label}
                            </Text>
                            {isTopFood && (
                              <Text style={styles.rankBadge}>#{index + 1}</Text>
                            )}
                          </View>
                          <View style={styles.foodCardStats}>
                            <Text style={styles.foodCardValue}>
                              {item.value}
                            </Text>
                            <Text style={styles.foodCardPercentage}>
                              {percentage}%
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}

                {/* Show More/Less Button */}
                {sortedChartData.length > FOODS_TO_SHOW && (
                  <TouchableOpacity
                    onPress={() => setShowAllFoods(!showAllFoods)}
                    style={{
                      marginTop: theme.spacing.md,
                      padding: theme.spacing.md,
                      backgroundColor: theme.colors.surface,
                      borderRadius: theme.borderRadius.md,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors.primary,
                        fontWeight: "600",
                        fontSize: 14,
                      }}
                    >
                      {showAllFoods
                        ? t("trendsAnalytics.showLess")
                        : t("trendsAnalytics.showMore", {
                            count: sortedChartData.length - FOODS_TO_SHOW,
                          })}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Stats */}
              {totalItems > 0 && (
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{chartData.length}</Text>
                    <Text style={styles.statLabel}>
                      {t("trendsAnalytics.foods")}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{totalItems}</Text>
                    <Text style={styles.statLabel}>
                      {t("trendsAnalytics.totalEntries")}
                    </Text>
                  </View>
                  {topItem && (
                    <View style={styles.statItem}>
                      <Text
                        style={[styles.statValue, { fontSize: 16 }]}
                        numberOfLines={1}
                      >
                        {topItem.label}
                      </Text>
                      <Text style={styles.statLabel}>
                        {t("trendsAnalytics.mostFrequent")}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: theme.borderRadius.xl,
              borderTopRightRadius: theme.borderRadius.xl,
              padding: theme.spacing.lg,
              maxHeight: "80%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing.lg,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: theme.colors.textPrimary,
                }}
              >
                {t("trendsAnalytics.infoTitle")}
              </Text>
              <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={28}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Total Entries */}
              <View style={{ marginBottom: theme.spacing.lg }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  <MaterialCommunityIcons
                    name="chart-bar"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: theme.colors.textPrimary,
                      marginLeft: theme.spacing.sm,
                    }}
                  >
                    {t("trendsAnalytics.totalEntries")}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.colors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {t("trendsAnalytics.totalEntriesInfo")}
                </Text>
              </View>

              {/* Unique Foods */}
              <View style={{ marginBottom: theme.spacing.lg }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  <MaterialCommunityIcons
                    name="food-apple"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: theme.colors.textPrimary,
                      marginLeft: theme.spacing.sm,
                    }}
                  >
                    {t("trendsAnalytics.uniqueFoods")}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.colors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {t("trendsAnalytics.uniqueFoodsInfo")}
                </Text>
              </View>

              {/* Diversity Score */}
              <View style={{ marginBottom: theme.spacing.lg }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  <MaterialCommunityIcons
                    name="star-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: theme.colors.textPrimary,
                      marginLeft: theme.spacing.sm,
                    }}
                  >
                    {t("trendsAnalytics.diversityScore")}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.colors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {t("trendsAnalytics.diversityScoreInfo")}
                </Text>
              </View>

              {/* Top Foods */}
              <View style={{ marginBottom: theme.spacing.lg }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  <MaterialCommunityIcons
                    name="trophy-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: theme.colors.textPrimary,
                      marginLeft: theme.spacing.sm,
                    }}
                  >
                    {t("trendsAnalytics.topFoods")}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.colors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {t("trendsAnalytics.topFoodsInfo")}
                </Text>
              </View>

              {/* Tips */}
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  marginBottom: theme.spacing.md,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  <MaterialCommunityIcons
                    name="lightbulb-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: theme.colors.textPrimary,
                      marginLeft: theme.spacing.sm,
                    }}
                  >
                    {t("trendsAnalytics.tips")}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.colors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {t("trendsAnalytics.tipsInfo")}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TrendsAndAnalyticsScreen;
