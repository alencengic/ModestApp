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
import { useTranslation } from "react-i18next";
import { getWeatherMoodCorrelation } from "@/storage/weather_data";
import { createStyles } from "./WeatherMoodScreen.styles";
import { VideoAd } from "@/components/ads";
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
  const { t } = useTranslation();
  const styles = createStyles(theme);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [filterMood, setFilterMood] = useState<string | null>(null);

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
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    const humidities = correlationData.map((d) => d.humidity);
    const avgHumidity = humidities.reduce((a, b) => a + b, 0) / humidities.length;

    // Find best weather conditions for mood
    const positiveConditions: Record<string, number> = {};
    const positiveTemps: number[] = [];

    correlationData.forEach((entry) => {
      if (["Happy", "Very Happy", "Ecstatic"].includes(entry.mood)) {
        positiveConditions[entry.condition] =
          (positiveConditions[entry.condition] || 0) + 1;
        positiveTemps.push(entry.temperature);
      }
    });

    const bestCondition = Object.entries(positiveConditions).sort(
      (a, b) => b[1] - a[1]
    )[0];

    const optimalTemp = positiveTemps.length > 0
      ? (positiveTemps.reduce((a, b) => a + b, 0) / positiveTemps.length)
      : avgTemp;

    // Calculate mood distribution
    const positiveMoods = correlationData.filter(d =>
      ["Happy", "Very Happy", "Ecstatic"].includes(d.mood)
    ).length;
    const positivePercentage = ((positiveMoods / correlationData.length) * 100).toFixed(0);

    return {
      avgTemp: avgTemp.toFixed(1),
      minTemp: minTemp.toFixed(1),
      maxTemp: maxTemp.toFixed(1),
      optimalTemp: optimalTemp.toFixed(1),
      avgHumidity: avgHumidity.toFixed(0),
      bestCondition: bestCondition ? bestCondition[0] : "N/A",
      bestConditionCount: bestCondition ? bestCondition[1] : 0,
      positivePercentage,
      totalEntries: correlationData.length,
    };
  }, [correlationData]);

  // Filter data
  const filteredData = useMemo(() => {
    if (!filterMood || !correlationData) return correlationData;
    return correlationData.filter(entry => entry.mood === filterMood);
  }, [correlationData, filterMood]);

  // Get unique moods for filter
  const uniqueMoods = useMemo(() => {
    if (!correlationData) return [];
    return Array.from(new Set(correlationData.map(d => d.mood)));
  }, [correlationData]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#C88B6B" />
          <Text style={styles.loadingText}>{t("weatherMood.loadingData")}</Text>
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
            {t("weatherMood.errorLoading")}
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
            <Text style={styles.headerTitle}>{t("weatherMood.title")}</Text>
            <Text style={styles.headerSubtitle}>
              {t("weatherMood.subtitle")}
            </Text>
          </View>
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>🌤️</Text>
            <Text style={styles.emptyStateText}>
              {t("weatherMood.noData")}{"\n"}
              {t("weatherMood.noDataDesc")}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>{t("weatherMood.title")}</Text>
              <Text style={styles.headerSubtitle}>
                {t("weatherMood.subtitle")}
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
              <Text style={styles.modalTitle}>{t("weatherMood.infoTitle")}</Text>

              <Text style={styles.modalSectionTitle}>{t("weatherMood.infoWhatShows")}</Text>
              <Text style={styles.modalText}>
                {t("weatherMood.infoWhatShowsDesc")}
              </Text>

              <Text style={styles.modalSectionTitle}>{t("weatherMood.infoPatterns")}</Text>
              <Text style={styles.modalText}>
                {t("weatherMood.infoPatternsDesc")}
              </Text>

              <Text style={styles.modalSectionTitle}>{t("weatherMood.infoKeyInsights")}</Text>
              <Text style={styles.modalText}>
                {t("weatherMood.infoKeyInsightsDesc")}
              </Text>

              <Text style={styles.modalSectionTitle}>{t("weatherMood.infoHowToUse")}</Text>
              <Text style={styles.modalText}>
                {t("weatherMood.infoHowToUseDesc")}
              </Text>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowInfoModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>{t("weatherMood.gotIt")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Mood Filter */}
        <View style={styles.filterCard}>
          <Text style={styles.cardTitle}>{t("weatherMood.filterByMood")}</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                !filterMood && styles.filterButtonActive
              ]}
              onPress={() => setFilterMood(null)}
            >
              <Text style={[
                styles.filterButtonText,
                !filterMood && styles.filterButtonTextActive
              ]}>
                {t("weatherMood.all")}
              </Text>
            </TouchableOpacity>
            {uniqueMoods.map(mood => (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.filterButton,
                  filterMood === mood && styles.filterButtonActive
                ]}
                onPress={() => setFilterMood(mood)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterMood === mood && styles.filterButtonTextActive
                ]}>
                  {getMoodEmoji(mood)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {filterMood && (
            <Text style={styles.filterSubtext}>
              {t("weatherMood.showingEntries", { count: filteredData.length, mood: filterMood })}
            </Text>
          )}
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>{t("weatherMood.overview")}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{correlationData.length}</Text>
              <Text style={styles.summaryLabel}>{t("weatherMood.totalEntries")}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{insights?.positivePercentage}%</Text>
              <Text style={styles.summaryLabel}>{t("weatherMood.positiveMood")}</Text>
            </View>
          </View>
        </View>

        {/* Key Insights Card */}
        {insights && (
          <View style={styles.insightsCard}>
            <Text style={styles.cardTitle}>{t("weatherMood.weatherInsights")}</Text>

            {/* Temperature Range */}
            <View style={styles.tempRangeContainer}>
              <Text style={styles.tempRangeTitle}>{t("weatherMood.temperatureRange")}</Text>
              <View style={styles.tempRangeBar}>
                <View style={styles.tempRangeTrack}>
                  <View style={[styles.tempRangeFill, {
                    left: '0%',
                    width: '100%',
                    backgroundColor: theme.colors.border
                  }]} />
                  <View style={[styles.tempRangeOptimal, {
                    left: `${((parseFloat(insights.optimalTemp) - parseFloat(insights.minTemp)) / (parseFloat(insights.maxTemp) - parseFloat(insights.minTemp))) * 100}%`
                  }]} />
                </View>
              </View>
              <View style={styles.tempRangeLabels}>
                <Text style={styles.tempRangeLabel}>{insights.minTemp}°C</Text>
                <View style={styles.tempRangeOptimalLabel}>
                  <Text style={styles.tempRangeOptimalText}>⭐ {insights.optimalTemp}°C</Text>
                  <Text style={styles.tempRangeOptimalSubtext}>{t("weatherMood.yourHappyTemp")}</Text>
                </View>
                <Text style={styles.tempRangeLabel}>{insights.maxTemp}°C</Text>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.insightRow}>
              <View style={styles.insightItem}>
                <Text style={styles.insightEmoji}>🌡️</Text>
                <Text style={styles.insightLabel}>{t("weatherMood.avgTemp")}</Text>
                <Text style={styles.insightValue}>{insights.avgTemp}°C</Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightEmoji}>💧</Text>
                <Text style={styles.insightLabel}>{t("weatherMood.avgHumidity")}</Text>
                <Text style={styles.insightValue}>{insights.avgHumidity}%</Text>
              </View>
            </View>

            {insights.bestCondition !== "N/A" && (
              <View style={styles.bestWeatherContainer}>
                <Text style={styles.bestWeatherLabel}>
                  {t("weatherMood.bestWeather")}
                </Text>
                <View style={styles.bestWeatherBadge}>
                  <Text style={styles.bestWeatherText}>
                    {getWeatherEmoji(insights.bestCondition)} {insights.bestCondition}
                  </Text>
                  <Text style={styles.bestWeatherCount}>
                    ({insights.bestConditionCount} {t("weatherMood.positiveEntries")})
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Recommendations Card */}
        {insights && insights.bestCondition !== "N/A" && (
          <View style={styles.recommendationsCard}>
            <Text style={styles.cardTitle}>{t("weatherMood.personalizedTips")}</Text>
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationIcon}>🌤️</Text>
              <View style={styles.recommendationText}>
                <Text style={styles.recommendationTitle}>{t("weatherMood.planActivities", { condition: insights.bestCondition })}</Text>
                <Text style={styles.recommendationDesc}>
                  {t("weatherMood.feelBest", { condition: insights.bestCondition })}
                </Text>
              </View>
            </View>
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationIcon}>🌡️</Text>
              <View style={styles.recommendationText}>
                <Text style={styles.recommendationTitle}>{t("weatherMood.idealTemp", { temp: insights.optimalTemp })}</Text>
                <Text style={styles.recommendationDesc}>
                  {t("weatherMood.stayComfortable")}
                </Text>
              </View>
            </View>
            {parseFloat(insights.positivePercentage) >= 70 && (
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationIcon}>😊</Text>
                <View style={styles.recommendationText}>
                  <Text style={styles.recommendationTitle}>{t("weatherMood.greatConsistency")}</Text>
                  <Text style={styles.recommendationDesc}>
                    {t("weatherMood.positivePercentage", { percentage: insights.positivePercentage })}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Mood-Weather Patterns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("weatherMood.moodWeatherPatterns")}</Text>
          {stats?.map((pattern, index) => {
            const percentage = (pattern.count / correlationData.length) * 100;
            return (
              <View key={pattern.mood} style={styles.patternCard}>
                <View style={styles.patternHeader}>
                  <View style={styles.patternMoodContainer}>
                    <Text style={styles.patternEmoji}>
                      {getMoodEmoji(pattern.mood)}
                    </Text>
                    <Text style={styles.patternMood}>{pattern.mood}</Text>
                  </View>
                  <Text style={styles.patternWeatherEmoji}>
                    {getWeatherEmoji(pattern.mostCommonCondition)}
                  </Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${percentage}%`,
                          backgroundColor: theme.colors.primary
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressBarText}>
                    {pattern.count} ({percentage.toFixed(0)}%)
                  </Text>
                </View>

                <View style={styles.patternStats}>
                  <View style={styles.patternStat}>
                    <Text style={styles.patternLabel}>{t("weatherMood.avgTempLabel")}</Text>
                    <Text style={styles.patternValue}>
                      {pattern.avgTemp.toFixed(1)}°C
                    </Text>
                  </View>
                  <View style={styles.patternStat}>
                    <Text style={styles.patternLabel}>{t("weatherMood.weatherLabel")}</Text>
                    <Text style={styles.patternValue}>
                      {pattern.mostCommonCondition}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Recent Entries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("weatherMood.recentEntries")} {filterMood && `(${filterMood})`}
          </Text>
          {filteredData.slice(0, 10).map((entry, index) => (
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
                  <Text style={styles.entryLabel}>{t("weatherMood.moodLabel")}</Text>
                  <Text style={styles.entryValue}>{entry.mood}</Text>
                </View>
                <View style={styles.entryRow}>
                  <Text style={styles.entryLabel}>{t("weatherMood.weatherCondition")}</Text>
                  <Text style={styles.entryValue}>
                    {getWeatherEmoji(entry.condition)} {entry.condition}
                  </Text>
                </View>
                <View style={styles.entryRow}>
                  <Text style={styles.entryLabel}>{t("weatherMood.temperature")}</Text>
                  <Text style={styles.entryValue}>{entry.temperature}°C</Text>
                </View>
                <View style={styles.entryRow}>
                  <Text style={styles.entryLabel}>{t("weatherMood.humidity")}</Text>
                  <Text style={styles.entryValue}>{entry.humidity}%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeatherMoodScreen;
