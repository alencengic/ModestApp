import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  Button,
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

interface CustomLegendProps {
  data: Array<{ name: string; symbol: { fill: string } }>;
  fontFamily?: string;
  fontSize?: number;
}

const CustomLegend: React.FC<CustomLegendProps> = ({
  data,
  fontFamily,
  fontSize = 10,
}) => {
  if (!data || data.length === 0) {
    return null;
  }
  return (
    <View style={styles.legendContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.legendItem}>
          <View
            style={[styles.legendSwatch, { backgroundColor: item.symbol.fill }]}
          />
          <Text style={[{ fontFamily, fontSize }]}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

const TrendsAndAnalyticsScreen: React.FC = () => {
  const chartAxisFont: SkFont | null = useFont(
    require("@/assets/fonts/SpaceMono-Regular.ttf"),
    12
  );
  const legendFontFamily = "SpaceMono-Regular";

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
      .map((item) => ({
        ...item,
        label: item.label.trim(),
        value: item.value,
        color: item.color.trim(),
      }));
    return processedData;
  }, [rawDataFromQuery]);

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
    }));
  }, [chartData, isDataValid]);

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
          <Text style={styles.filterTitle}>Filter By</Text>
          <View style={styles.buttonGroup}>
            <Button
              title="Today"
              onPress={() => {
                setRange("day");
                setSelectedDate(new Date());
              }}
            />
            <Button
              title="This Week"
              onPress={() => {
                setRange("week");
                setSelectedDate(new Date());
              }}
            />
            <Button
              title="This Month"
              onPress={() => {
                setRange("month");
                setSelectedDate(new Date());
              }}
            />
            <Button
              title="Choose a Day"
              onPress={() => {
                setShowDatePicker(true);
              }}
            />
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
          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text>Loading chart data...</Text>
            </View>
          ) : isError ? (
            <View style={styles.centered}>
              <Text style={styles.errorText}>
                Error loading data. Please try again.
              </Text>
            </View>
          ) : !isDataValid ? (
            <View style={styles.centered}>
              <Text>
                No valid food intake data available for the selected period.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.chartViewContainer}>
                <CartesianChart
                  data={chartData}
                  xKey="label"
                  yKeys={["value"]}
                  domainPadding={{ left: 20, right: 20, top: 10, bottom: 10 }}
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
                            roundedCorners={{ topLeft: 5, topRight: 5 }}
                            color={currentData.color}
                            barWidth={30}
                          />
                        );
                      })}
                    </>
                  )}
                </CartesianChart>
              </View>
              <CustomLegend
                data={legendData}
                fontFamily={legendFontFamily}
                fontSize={10}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrendsAndAnalyticsScreen;
