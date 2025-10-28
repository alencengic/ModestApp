import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getWeatherMoodCorrelation } from "@/storage/weather_data";
import { createStyles } from "./WeatherMoodScreen.styles";
import { BannerAd, VideoAd } from "@/components/ads";
import { useTheme } from "@/context/ThemeContext";

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
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [showInfoModal, setShowInfoModal] = useState(false);

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

  // Calculate additional insights
  const insights = useMemo(() => {
    if (!correlationData || correlationData.length === 0) return null;

    const temps = correlationData.map((d) => d.temperature);
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;

    const humidities = correlationData.map((d) => d.humidity);
    const avgHumidity = humidities.reduce((a, b) => a + b, 0) / humidities.length;

    // Find best weather conditions for mood
    const positiveConditions: Record<string, number> = {};
    correlationData.forEach((entry) => {
      if (["Happy", "Very Happy", "Ecstatic"].includes(entry.mood)) {
        positiveConditions[entry.condition] =
          (positiveConditions[entry.condition] || 0) + 1;
      }
    });

    const bestCondition = Object.entries(positiveConditions).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      avgTemp: avgTemp.toFixed(1),
      avgHumidity: avgHumidity.toFixed(0),
      bestCondition: bestCondition ? bestCondition[0] : "N/A",
      bestConditionCount: bestCondition ? bestCondition[1] : 0,
    };
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
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Weather & Mood</Text>
              <Text style={styles.headerSubtitle}>
                Discover how weather affects your mood
              </Text>
            </View>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => setShowInfoModal(true)}
            >
              <Text style={styles.infoButtonText}>ⓘ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Modal */}
        <Modal
          visible={showInfoModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowInfoModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Weather & Mood Insights</Text>

              <Text style={styles.modalSectionTitle}>What This Shows:</Text>
              <Text style={styles.modalText}>
                This screen correlates your logged mood entries with weather data at the time of logging.
              </Text>

              <Text style={styles.modalSectionTitle}>Mood-Weather Patterns:</Text>
              <Text style={styles.modalText}>
                • Shows which moods occur most frequently{"\n"}
                • Average temperature when feeling each mood{"\n"}
                • Most common weather conditions for each mood
              </Text>

              <Text style={styles.modalSectionTitle}>Key Insights:</Text>
              <Text style={styles.modalText}>
                • Average weather conditions across all entries{"\n"}
                • Weather conditions associated with positive moods{"\n"}
                • Temperature and humidity trends
              </Text>

              <Text style={styles.modalSectionTitle}>How to Use:</Text>
              <Text style={styles.modalText}>
                Track your mood daily to build a comprehensive dataset. Over time, you'll discover patterns that help you understand how weather influences your well-being.
              </Text>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowInfoModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Got it!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Summary</Text>
          <Text style={styles.summaryText}>
            Tracking {correlationData.length} mood entries with weather data
          </Text>
        </View>

        {/* Key Insights Card */}
        {insights && (
          <View style={styles.insightsCard}>
            <Text style={styles.cardTitle}>Key Insights</Text>
            <View style={styles.insightRow}>
              <View style={styles.insightItem}>
                <Text style={styles.insightEmoji}>🌡️</Text>
                <Text style={styles.insightLabel}>Avg Temperature</Text>
                <Text style={styles.insightValue}>{insights.avgTemp}°C</Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightEmoji}>💧</Text>
                <Text style={styles.insightLabel}>Avg Humidity</Text>
                <Text style={styles.insightValue}>{insights.avgHumidity}%</Text>
              </View>
            </View>
            {insights.bestCondition !== "N/A" && (
              <View style={styles.bestWeatherContainer}>
                <Text style={styles.bestWeatherLabel}>
                  Your Best Weather for Positive Mood:
                </Text>
                <View style={styles.bestWeatherBadge}>
                  <Text style={styles.bestWeatherText}>
                    {getWeatherEmoji(insights.bestCondition)} {insights.bestCondition}
                  </Text>
                  <Text style={styles.bestWeatherCount}>
                    ({insights.bestConditionCount} positive mood entries)
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

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
