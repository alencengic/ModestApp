import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getWeatherMoodCorrelation } from "@/storage/weather_data";
import { styles } from "./WeatherMoodScreen.styles";
import { BannerAd, VideoAd } from "@/components/ads";

interface MoodWeatherData {
  mood: string;
  temperature: number;
  condition: string;
  humidity: number;
  pressure: number;
  date: string;
}

const getMoodEmoji = (mood: string): string => {
  const moodMap: Record<string, string> = {
    Sad: "😢",
    Neutral: "😔",
    Happy: "🙂",
    "Very Happy": "😄",
    Ecstatic: "😁",
  };
  return moodMap[mood] || "😐";
};

const getWeatherEmoji = (condition: string): string => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("sunny") || lowerCondition.includes("clear")) {
    return "☀️";
  } else if (lowerCondition.includes("cloud")) {
    return "☁️";
  } else if (lowerCondition.includes("rain")) {
    return "🌧️";
  } else if (lowerCondition.includes("snow")) {
    return "❄️";
  } else if (
    lowerCondition.includes("thunder") ||
    lowerCondition.includes("storm")
  ) {
    return "⛈️";
  } else if (
    lowerCondition.includes("fog") ||
    lowerCondition.includes("mist")
  ) {
    return "🌫️";
  }
  return "🌤️";
};

const WeatherMoodScreen: React.FC = () => {
  const {
    data: correlationData = [],
    isLoading,
    isError,
  } = useQuery<MoodWeatherData[], Error>({
    queryKey: ["weatherMoodCorrelation"],
    queryFn: async () => {
      const data = await getWeatherMoodCorrelation();
      return data as MoodWeatherData[];
    },
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
  });

  const stats = useMemo(() => {
    if (!correlationData || correlationData.length === 0) {
      return null;
    }

    const moodCounts: Record<
      string,
      { count: number; avgTemp: number; conditions: string[] }
    > = {};

    correlationData.forEach((entry) => {
      if (!moodCounts[entry.mood]) {
        moodCounts[entry.mood] = {
          count: 0,
          avgTemp: 0,
          conditions: [],
        };
      }
      moodCounts[entry.mood].count++;
      moodCounts[entry.mood].avgTemp += entry.temperature;
      moodCounts[entry.mood].conditions.push(entry.condition);
    });

    Object.keys(moodCounts).forEach((mood) => {
      moodCounts[mood].avgTemp =
        moodCounts[mood].avgTemp / moodCounts[mood].count;
    });

    const moodWeatherPatterns = Object.entries(moodCounts).map(
      ([mood, data]) => {
        const conditionCounts: Record<string, number> = {};
        data.conditions.forEach((cond) => {
          conditionCounts[cond] = (conditionCounts[cond] || 0) + 1;
        });

        const mostCommonCondition = Object.entries(conditionCounts).sort(
          (a, b) => b[1] - a[1]
        )[0];

        return {
          mood,
          avgTemp: data.avgTemp,
          count: data.count,
          mostCommonCondition: mostCommonCondition
            ? mostCommonCondition[0]
            : "N/A",
        };
      }
    );

    return moodWeatherPatterns.sort((a, b) => b.count - a.count);
  }, [correlationData]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#C88B6B" />
          <Text style={styles.loadingText}>Loading correlation data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateIcon}>⚠️</Text>
          <Text style={styles.errorText}>
            Error loading data. Please try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!correlationData || correlationData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Weather & Mood</Text>
            <Text style={styles.headerSubtitle}>
              Discover how weather affects your mood
            </Text>
          </View>
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>🌤️</Text>
            <Text style={styles.emptyStateText}>
              No correlation data available yet.{"\n"}
              Start tracking your mood to see weather patterns!
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <BannerAd size="small" position="top" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weather & Mood</Text>
          <Text style={styles.headerSubtitle}>
            Discover how weather affects your mood
          </Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Summary</Text>
          <Text style={styles.summaryText}>
            Tracking {correlationData.length} mood entries with weather data
          </Text>
        </View>

        {/* Mood-Weather Patterns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood-Weather Patterns</Text>
          {stats?.map((pattern, index) => (
            <View key={pattern.mood} style={styles.patternCard}>
              <View style={styles.patternHeader}>
                <Text style={styles.patternEmoji}>
                  {getMoodEmoji(pattern.mood)}{" "}
                  {getWeatherEmoji(pattern.mostCommonCondition)}
                </Text>
                <Text style={styles.patternMood}>{pattern.mood}</Text>
              </View>
              <View style={styles.patternStats}>
                <View style={styles.patternStat}>
                  <Text style={styles.patternLabel}>Occurrences</Text>
                  <Text style={styles.patternValue}>{pattern.count}</Text>
                </View>
                <View style={styles.patternStat}>
                  <Text style={styles.patternLabel}>Avg Temperature</Text>
                  <Text style={styles.patternValue}>
                    {pattern.avgTemp.toFixed(1)}°C
                  </Text>
                </View>
              </View>
              <View style={styles.patternCondition}>
                <Text style={styles.patternConditionText}>
                  Most common: {pattern.mostCommonCondition}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Entries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          {correlationData.slice(0, 10).map((entry, index) => (
            <View key={`${entry.date}-${index}`} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryDate}>
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
                <Text style={styles.entryMoodEmoji}>
                  {getMoodEmoji(entry.mood)}
                </Text>
              </View>
              <View style={styles.entryDetails}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryLabel}>Mood:</Text>
                  <Text style={styles.entryValue}>{entry.mood}</Text>
                </View>
                <View style={styles.entryRow}>
                  <Text style={styles.entryLabel}>Weather:</Text>
                  <Text style={styles.entryValue}>
                    {getWeatherEmoji(entry.condition)} {entry.condition}
                  </Text>
                </View>
                <View style={styles.entryRow}>
                  <Text style={styles.entryLabel}>Temperature:</Text>
                  <Text style={styles.entryValue}>{entry.temperature}°C</Text>
                </View>
                <View style={styles.entryRow}>
                  <Text style={styles.entryLabel}>Humidity:</Text>
                  <Text style={styles.entryValue}>{entry.humidity}%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <BannerAd size="medium" position="bottom" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeatherMoodScreen;
