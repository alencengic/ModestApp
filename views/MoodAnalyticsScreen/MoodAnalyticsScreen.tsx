import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { CartesianChart, Bar } from "victory-native";
import { useFont, SkFont } from "@shopify/react-native-skia";
import { useQuery } from "@tanstack/react-query";
import {
  getFoodMoodCorrelationData,
  FoodMoodCorrelation,
} from "@/storage/database";
import { styles } from "./MoodAnalyticsScreen.styles";

export interface MoodDataItem {
  date: string;
  mood: string;
  color: string;
  value: number;
}

export interface FoodMoodChartDataItem {
  foodNameKey: string;
  avgMoodScoreKey: number;
  originalAverageMoodScore: number;
  color: string;
  occurrences: number;
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

  const POSITIVE_MOOD_COLOR = "#3CB371";
  const NEUTRAL_MOOD_COLOR = "#A9A9A9";
  const NEGATIVE_MOOD_COLOR = "#CD5C5C";

  const foodMoodCorrelationLegendData = [
    { name: "Positive Mood Link", symbol: { fill: POSITIVE_MOOD_COLOR } },
    { name: "Neutral Mood Link", symbol: { fill: NEUTRAL_MOOD_COLOR } },
    { name: "Negative Mood Link", symbol: { fill: NEGATIVE_MOOD_COLOR } },
  ];

  const useQueryFoodMoodCorrelation = (minOccurrences: number = 3) => {
    return {
      queryKey: ["foodMoodCorrelation"],
      queryFn: async () => getFoodMoodCorrelationData(minOccurrences),
    };
  };

  const foodMoodQueryOptions = useQueryFoodMoodCorrelation(3);
  const {
    data: rawFoodMoodData = [],
    isLoading: isLoadingFoodMood,
    isError: isErrorFoodMood,
    error: foodMoodQueryError,
  } = useQuery<FoodMoodCorrelation[], Error>(foodMoodQueryOptions);

  const foodMoodChartData: FoodMoodChartDataItem[] = useMemo(() => {
    const NEUTRAL_BAR_VISIBLE_HEIGHT = 0.1;

    return (rawFoodMoodData || []).map((item) => {
      let barColor;
      let yValueForChart;

      if (item.averageMoodScore > 0.2) {
        barColor = POSITIVE_MOOD_COLOR;
        yValueForChart = item.averageMoodScore;
      } else if (item.averageMoodScore < -0.2) {
        barColor = NEGATIVE_MOOD_COLOR;
        yValueForChart = item.averageMoodScore;
      } else {
        barColor = NEUTRAL_MOOD_COLOR;
        yValueForChart = NEUTRAL_BAR_VISIBLE_HEIGHT;
      }

      return {
        foodNameKey:
          item.foodName.length > 12
            ? `${item.foodName.substring(0, 10)}...`
            : item.foodName,
        avgMoodScoreKey: yValueForChart,
        originalAverageMoodScore: item.averageMoodScore,
        color: barColor,
        occurrences: item.occurrences,
      };
    });
  }, [
    rawFoodMoodData,
    POSITIVE_MOOD_COLOR,
    NEUTRAL_MOOD_COLOR,
    NEGATIVE_MOOD_COLOR,
  ]);

  const renderFoodMoodCorrelationChart = () => {
    if (isLoadingFoodMood) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.centeredText}>
            Loading food & mood insights...
          </Text>
        </View>
      );
    }
    if (isErrorFoodMood) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            Error loading food-mood data. {foodMoodQueryError?.message}
          </Text>
        </View>
      );
    }
    if (foodMoodChartData.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.centeredText}>
            Not enough data for Food-Mood Correlation. Keep logging your meals
            and moods!
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.chartViewContainer}>
        <CartesianChart
          data={foodMoodChartData}
          xKey="foodNameKey"
          yKeys={["avgMoodScoreKey"]}
          domainPadding={{ left: 30, right: 30, top: 20, bottom: 30 }}
          axisOptions={{
            font: chartAxisFont,
            labelColor: "#8E8E93",
            lineColor: "#E0E0E0",
          }}
        >
          {({ points, chartBounds }) => (
            <>
              {points.avgMoodScoreKey.map((point, index) => {
                const currentData = foodMoodChartData[index];
                if (!point || !currentData) return null;
                return (
                  <Bar
                    key={`${currentData.foodNameKey}-${index}`}
                    chartBounds={chartBounds}
                    points={[point]}
                    roundedCorners={{ topLeft: 5, topRight: 5 }}
                    color={currentData.color}
                    barWidth={Math.max(
                      15,
                      350 / (foodMoodChartData.length * 1.5 + 1)
                    )}
                  />
                );
              })}
            </>
          )}
        </CartesianChart>
        <CustomLegend
          data={foodMoodCorrelationLegendData}
          fontFamily={legendFontFamily}
          fontSize={12}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.chartWrapper}>
          <Text style={styles.chartSectionTitle}>Food & Mood Insights</Text>
          {renderFoodMoodCorrelationChart()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodAnalyticsScreen;
