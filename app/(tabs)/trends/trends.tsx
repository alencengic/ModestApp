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
import { styles } from "./TrendsScreen.styles";
import { BannerAd } from "@/components/ads";
import { BrightTheme } from "@/constants/Theme";

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
        <BannerAd size="small" position="top" />

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
        </View>

        <View style={styles.chartWrapper}>
          <Text style={styles.chartTitle}>Food Intake Analysis</Text>
          <Text style={styles.chartSubtitle}>{getRangeLabel()}</Text>

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#C88B6B" />
              <Text style={{ marginTop: 16, color: BrightTheme.colors.textSecondary }}>
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
              {/* Visual Food Cards */}
              <View style={styles.foodCardsContainer}>
                {chartData.map((item, index) => {
                  const percentage = ((item.value / totalItems) * 100).toFixed(1);
                  return (
                    <View key={index} style={styles.foodCard}>
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

        <BannerAd size="medium" position="bottom" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrendsAndAnalyticsScreen;
