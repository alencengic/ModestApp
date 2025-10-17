import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { CartesianChart, Bar } from "victory-native";
import { useFont, SkFont } from "@shopify/react-native-skia";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { useQueryFoodIntakeChartData } from "@/hooks/queries/useMutationInsertFoodIntake";
import { styles } from "./TrendsScreen.styles";

export interface ChartDataItem {
  label: string;
  value: number;
  color: string;
  [key: string]: any;
}

// Modern color palette for charts
const CHART_COLORS = [
  "#007AFF", // Blue
  "#5856D6", // Purple
  "#AF52DE", // Pink
  "#FF2D55", // Red
  "#FF3B30", // Orange-Red
  "#FF9500", // Orange
  "#FFCC00", // Yellow
  "#34C759", // Green
  "#00C7BE", // Teal
  "#30B0C7", // Cyan
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
  } = useQuery<ChartDataItem[], Error>(queryOptions);

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
        color: CHART_COLORS[index % CHART_COLORS.length], // Use modern color palette
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
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={{ marginTop: 16, color: "#666" }}>
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
              <View style={styles.chartViewContainer}>
                <CartesianChart
                  data={chartData}
                  xKey="label"
                  yKeys={["value"]}
                  domainPadding={{ left: 20, right: 20, top: 20, bottom: 10 }}
                >
                  {({ points, chartBounds }) => (
                    <>
                      {points.value.map((point, index) => {
                        const currentData = chartData[index];
                        if (
                          !point ||
                          !currentData ||
                          currentData.value == null ||
                          currentData.value <= 0 ||
                          typeof currentData.color !== "string" ||
                          currentData.color.trim() === "" ||
                          typeof currentData.label !== "string" ||
                          currentData.label.trim().toLowerCase() ===
                            "undefined" ||
                          currentData.label.trim() === ""
                        ) {
                          return null;
                        }
                        return (
                          <Bar
                            key={`${currentData.label}-${index}`}
                            chartBounds={chartBounds}
                            points={[point]}
                            roundedCorners={{ topLeft: 8, topRight: 8 }}
                            color={currentData.color}
                            barWidth={40}
                          />
                        );
                      })}
                    </>
                  )}
                </CartesianChart>
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

              {/* Legend */}
              <View style={styles.legendContainer}>
                {legendData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendSwatch,
                        { backgroundColor: item.symbol.fill },
                      ]}
                    />
                    <Text style={styles.legendText}>
                      {item.name} ({item.value})
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrendsAndAnalyticsScreen;
