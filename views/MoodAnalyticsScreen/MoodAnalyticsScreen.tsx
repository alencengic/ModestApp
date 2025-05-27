import React, { useState, useMemo, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  Button,
  StyleSheet,
  Platform,
} from "react-native";
import { CartesianChart, Bar } from "victory-native";
import { useFont, SkFont } from "@shopify/react-native-skia";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { getMoodDataForRange } from "@/storage/database";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  filterContainer: {
    padding: 15,
    backgroundColor: "white",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  chartWrapper: {
    margin: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 250,
    padding: 20,
  },
  centeredText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  chartViewContainer: {
    height: 350,
    width: "100%",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    marginRight: 8,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 12,
    color: "#333",
  },
});

export interface MoodDataItem {
  date: string;
  mood: string;
  color: string;
  value: number;
}

interface CustomLegendProps {
  data: Array<{ name: string; symbol: { fill: string } }>;
  fontFamily?: string;
  fontSize?: number;
}

const CustomLegend: React.FC<CustomLegendProps> = ({
  data,
  fontFamily,
  fontSize = 12,
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
          <Text style={[styles.legendText, { fontFamily, fontSize }]}>
            {item.name}
          </Text>
        </View>
      ))}
    </View>
  );
};

const MoodAnalyticsScreen: React.FC = () => {
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

  const {
    data: rawData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<Array<{ date: string; mood: string }>, Error>({
    queryKey: ["moodAnalytics", range, selectedDate.toISOString()],
    queryFn: async () => {
      let fromDate: Date;
      let toDate: Date;
      const selectedLuxonDate = DateTime.fromJSDate(selectedDate);

      switch (range) {
        case "day":
          fromDate = selectedLuxonDate.startOf("day").toJSDate();
          toDate = selectedLuxonDate.endOf("day").toJSDate();
          break;
        case "week":
          fromDate = selectedLuxonDate.startOf("week").toJSDate();
          toDate = selectedLuxonDate.endOf("week").toJSDate();
          break;
        case "month":
          fromDate = selectedLuxonDate.startOf("month").toJSDate();
          toDate = selectedLuxonDate.endOf("month").toJSDate();
          break;
        case "custom":
          fromDate = selectedLuxonDate.startOf("day").toJSDate();
          toDate = selectedLuxonDate.endOf("day").toJSDate();
          break;
        default:
          fromDate = selectedLuxonDate.startOf("day").toJSDate();
          toDate = selectedLuxonDate.endOf("day").toJSDate();
      }
      const result = await getMoodDataForRange(fromDate, toDate);
      return result || [];
    },
  });

  const moodColorMap: Record<string, string> = {
    Sad: "#3498db",
    Neutral: "#95a5a6",
    Happy: "#2ecc71",
    "Very Happy": "#f1c40f",
    Ecstatic: "#e67e22",
  };

  const chartData: MoodDataItem[] = useMemo(() => {
    return (rawData || [])
      .filter((item) => {
        if (
          !item ||
          typeof item.date !== "string" ||
          typeof item.mood !== "string"
        ) {
          return false;
        }
        const trimmedMood = item.mood.trim();
        if (trimmedMood === "" || trimmedMood.toLowerCase() === "undefined") {
          return false;
        }
        const dt = DateTime.fromISO(item.date);
        if (!dt.isValid) {
          return false;
        }
        return true;
      })
      .map((item) => {
        const dt = DateTime.fromISO(item.date);
        const trimmedMood = item.mood.trim();
        return {
          date: dt.toFormat("ccc dd"),
          mood: trimmedMood,
          color: moodColorMap[trimmedMood] || "#bdc3c7",
          value: 1,
        };
      });
  }, [rawData, moodColorMap]);

  const legendData = useMemo(() => {
    const uniqueMoods = new Map<string, string>();
    chartData.forEach((item) => {
      if (item.mood && !uniqueMoods.has(item.mood)) {
        uniqueMoods.set(item.mood, item.color);
      }
    });
    return Array.from(uniqueMoods.entries()).map(([name, color]) => ({
      name,
      symbol: { fill: color },
    }));
  }, [chartData]);

  const handleSetRange = (newRange: "day" | "week" | "month") => {
    setSelectedDate(new Date());
    setRange(newRange);
  };

  const handleDateChange = (event: any, selected?: Date) => {
    const currentDate = selected || selectedDate;
    setShowDatePicker(Platform.OS === "ios");
    if (selected) {
      setSelectedDate(currentDate);
      setRange("custom");
    }
  };

  const renderChartContent = () => {
    return (
      <>
        <View style={styles.chartViewContainer}>
          <CartesianChart
            data={chartData}
            xKey="date"
            yKeys={["value"]}
            axisOptions={{
              font: chartAxisFont ?? undefined,
              formatXLabel: () => "",
              formatYLabel: () => "",
              lineColor: "#E0E0E0",
              tickCount: 5,
            }}
            domainPadding={{ left: 25, right: 25, top: 20, bottom: 10 }}
          >
            {({ points, chartBounds }) => {
              return points.value.map((point, index) => {
                const currentData = chartData[index];
                if (!point || !currentData) {
                  return null;
                }
                return (
                  <Bar
                    key={`${currentData.date}-${index}-${currentData.mood}`}
                    chartBounds={chartBounds}
                    points={[point]}
                    barWidth={Math.max(10, 350 / (chartData.length * 1.5 + 1))}
                    color={currentData.color}
                    roundedCorners={{ topLeft: 5, topRight: 5 }}
                  />
                );
              });
            }}
          </CartesianChart>
        </View>
        <CustomLegend
          data={legendData}
          fontFamily={legendFontFamily}
          fontSize={12}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Select Period</Text>
          <View style={styles.buttonGroup}>
            <Button title="Today" onPress={() => handleSetRange("day")} />
            <Button title="This Week" onPress={() => handleSetRange("week")} />
            <Button
              title="This Month"
              onPress={() => handleSetRange("month")}
            />
            <Button
              title="Choose Day"
              onPress={() => setShowDatePicker(true)}
            />
          </View>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.chartWrapper}>
          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.centeredText}>Loading mood data...</Text>
            </View>
          ) : isError ? (
            <View style={styles.centered}>
              <Text style={styles.errorText}>
                Error loading data. Please try again.
                {queryError && `\n(${queryError.message})`}
              </Text>
            </View>
          ) : chartData.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.centeredText}>
                No mood data available for the selected period.
              </Text>
            </View>
          ) : (
            renderChartContent()
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodAnalyticsScreen;
