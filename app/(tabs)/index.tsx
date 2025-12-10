import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Card } from "react-native-paper";
import { router, Href, useFocusEffect } from "expo-router";
import { DateTime } from "luxon";
import { useState, useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { BannerAd } from "@/components/ads";
import { useTranslation } from "react-i18next";
import {
  sendTestNotification,
  getScheduledNotifications,
} from "@/services/notificationService";
import { Alert } from "react-native";
import { getMoodByDate } from "@/storage/database";
import { getProductivityByDate } from "@/storage/database";
import { getFoodIntakeByDate } from "@/storage/database";
import { scaleFontSize, scale } from "@/utils/responsive";

// Import new services
import { calculateMoodPrediction, MoodPrediction } from "@/services/moodPredictionService";
import { getAchievements, getStreakData, Achievement, StreakData } from "@/services/achievementService";
import { generateWeeklySummary, WeeklySummary } from "@/services/weeklyDigestService";
import { detectTrendAlerts, TrendAlert } from "@/services/trendsAndExportService";
import { getWaterMoodCorrelation, WaterMoodAnalysis } from "@/storage/correlations";

const getQuickAccessItems = (t: any): {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  route: Href;
}[] => [
  {
    title: t('navigation.dailyJournal'),
    icon: "book-open-outline",
    route: "/daily-journal" as any,
  },
  {
    title: t('navigation.trendsAnalytics'),
    icon: "chart-line-variant",
    route: "/trends" as any,
  },
  {
    title: t('navigation.moodAnalytics'),
    icon: "emoticon-excited-outline",
    route: "/mood" as any,
  },
  {
    title: t('navigation.myMeals'),
    icon: "silverware-variant",
    route: "/meals/meals" as any,
  },
  {
    title: t('navigation.weatherMood'),
    icon: "weather-partly-cloudy",
    route: "/weather/weather-mood" as any,
  },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { name } = useUserProfile();
  const { t } = useTranslation();
  const [hasExistingData, setHasExistingData] = useState(false);
  const [moodPrediction, setMoodPrediction] = useState<MoodPrediction | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [weeklyDigest, setWeeklyDigest] = useState<WeeklySummary | null>(null);
  const [trendAlerts, setTrendAlerts] = useState<TrendAlert[]>([]);
  const [waterInsights, setWaterInsights] = useState<WaterMoodAnalysis | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const quickAccessItems = getQuickAccessItems(t);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = DateTime.now().hour;
    if (hour < 12) return t('home.goodMorning');
    if (hour < 18) return t('home.goodAfternoon');
    return t('home.goodEvening');
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      paddingBottom: theme.spacing.xl,
    },
    header: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      fontSize: scaleFontSize(28),
      fontWeight: "400",
      color: theme.colors.textPrimary,
      textAlign: "center",
    },
    startButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: scale(24),
      paddingVertical: scale(10),
      borderRadius: scale(20),
      marginTop: theme.spacing.lg,
    },
    startButtonText: {
      color: theme.colors.textOnPrimary,
      fontSize: scaleFontSize(14),
      fontWeight: "500",
    },
    sectionTitle: {
      fontSize: scaleFontSize(18),
      fontWeight: "700",
      color: theme.colors.textPrimary,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    quickAccessContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.md,
    },
    card: {
      width: "48%",
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      elevation: 0,
      shadowOpacity: 0,
      backgroundColor: theme.colors.surface,
    },
    cardContent: {
      alignItems: "center",
      paddingVertical: theme.spacing.lg,
    },
    iconContainer: {
      marginBottom: theme.spacing.sm,
    },
    cardText: {
      fontSize: scaleFontSize(13),
      fontWeight: "600",
      color: theme.colors.textPrimary,
      textAlign: "center",
    },
    testButtonsContainer: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    testButton: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: scale(16),
      paddingVertical: scale(8),
      borderRadius: scale(16),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    testButtonText: {
      color: theme.colors.textPrimary,
      fontSize: scaleFontSize(13),
      fontWeight: "500",
    },
    insightsSection: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
    },
    insightCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    insightTitle: {
      fontSize: scaleFontSize(16),
      fontWeight: "700",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    insightText: {
      fontSize: scaleFontSize(14),
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    predictionContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: theme.spacing.sm,
    },
    predictionEmoji: {
      fontSize: scaleFontSize(32),
      marginRight: theme.spacing.sm,
    },
    predictionDetails: {
      flex: 1,
    },
    predictionLevel: {
      fontSize: scaleFontSize(18),
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    predictionConfidence: {
      fontSize: scaleFontSize(12),
      color: theme.colors.textSecondary,
    },
    achievementBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.primaryLight,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    achievementText: {
      fontSize: scaleFontSize(12),
      color: theme.colors.primary,
      marginLeft: 4,
    },
    achievementsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: theme.spacing.sm,
    },
    streakContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: theme.spacing.sm,
    },
    streakText: {
      fontSize: scaleFontSize(24),
      fontWeight: "700",
      color: theme.colors.primary,
      marginRight: theme.spacing.sm,
    },
    streakLabel: {
      fontSize: scaleFontSize(14),
      color: theme.colors.textSecondary,
    },
    alertCard: {
      backgroundColor: theme.colors.warning + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    alertText: {
      fontSize: scaleFontSize(13),
      color: theme.colors.warning,
    },
    loadingContainer: {
      padding: theme.spacing.lg,
      alignItems: "center",
    },
  });

  // Re-check data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Only check data if user is authenticated
      if (!user) return;
      
      const checkExistingData = async () => {
        try {
          const today = DateTime.now().toISODate() as string;

          // Check if there's any data for today
          const [mood, productivity, foodIntake] = await Promise.all([
            getMoodByDate(today),
            getProductivityByDate(today),
            getFoodIntakeByDate(today),
          ]);

          // If any data exists for today, show "Continue" text
          setHasExistingData(!!(mood || productivity || foodIntake));
        } catch (error) {
          console.error('Error checking existing data:', error);
          setHasExistingData(false);
        }
      };

      const loadInsights = async () => {
        setIsLoadingInsights(true);
        try {
          // Load all insights in parallel
          const [prediction, achievementsList, streak, digest, alerts, water] = await Promise.all([
            calculateMoodPrediction().catch(() => null),
            getAchievements().catch(() => []),
            getStreakData().catch(() => null),
            generateWeeklySummary().catch(() => null),
            detectTrendAlerts().catch(() => []),
            getWaterMoodCorrelation().catch(() => null),
          ]);

          setMoodPrediction(prediction);
          setAchievements(achievementsList.filter(a => a.earnedDate));
          setStreakData(streak);
          setWeeklyDigest(digest);
          setTrendAlerts(alerts);
          setWaterInsights(water);
        } catch (error) {
          console.error('Error loading insights:', error);
        } finally {
          setIsLoadingInsights(false);
        }
      };

      checkExistingData();
      loadInsights();
    }, [user])
  );

  const handleTestNotification = async () => {
    await sendTestNotification();
    Alert.alert(
      t('home.testScheduled'),
      t('home.testScheduledMessage')
    );
  };

  const handleCheckScheduled = async () => {
    const scheduled = await getScheduledNotifications();
    if (scheduled.length > 0) {
      const times = scheduled
        .map((n) => {
          if (n.trigger && "hour" in n.trigger) {
            return `${n.trigger.hour}:${n.trigger.minute
              ?.toString()
              .padStart(2, "0")}`;
          }
          return "Unknown time";
        })
        .join(", ");
      Alert.alert(
        t('home.scheduledNotifications'),
        t('home.scheduledCount', { count: scheduled.length, times })
      );
    } else {
      Alert.alert(t('home.noNotifications'), t('home.noNotificationsMessage'));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {getGreeting()}{name ? `, ${name}` : ""}
          </Text>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push("/daily-entry")}
          >
            <Text style={styles.startButtonText}>
              {hasExistingData ? t('home.editEntry') : t('home.startEntry')}
            </Text>
          </TouchableOpacity>

          <View style={styles.testButtonsContainer}>
            <TouchableOpacity
              style={styles.testButton}
              onPress={handleTestNotification}
            >
              <Text style={styles.testButtonText}>{t('home.testNotification')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.testButton}
              onPress={handleCheckScheduled}
            >
              <Text style={styles.testButtonText}>{t('home.checkSchedule')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <BannerAd size="small" position="top" />

        <Text style={styles.sectionTitle}>{t('home.quickAccess')}</Text>
        <View style={styles.quickAccessContainer}>
          {quickAccessItems.map((item) => (
            <Card
              key={item.title}
              style={styles.card}
              onPress={() => router.push(item.route)}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={44}
                    color={theme.colors.primary}
                    strokeWidth={0.5}
                  />
                </View>
                <Text style={styles.cardText}>{item.title}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Insights Section */}
        <Text style={styles.sectionTitle}>Your Insights</Text>
        <View style={styles.insightsSection}>
          {isLoadingInsights ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.insightText}>Loading insights...</Text>
            </View>
          ) : (
            <>
              {/* Trend Alerts */}
              {trendAlerts.length > 0 && (
                <View style={styles.insightCard}>
                  <Text style={styles.insightTitle}>⚠️ Trend Alerts</Text>
                  {trendAlerts.slice(0, 2).map((alert, idx) => (
                    <View key={idx} style={styles.alertCard}>
                      <Text style={styles.alertText}>{alert.message}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Mood Prediction */}
              {moodPrediction && (
                <View style={styles.insightCard}>
                  <Text style={styles.insightTitle}>🔮 Today's Mood Prediction</Text>
                  <View style={styles.predictionContainer}>
                    <Text style={styles.predictionEmoji}>
                      {moodPrediction.predictedMood >= 8 ? '😄' :
                       moodPrediction.predictedMood >= 6 ? '😊' :
                       moodPrediction.predictedMood >= 4 ? '😐' : '😔'}
                    </Text>
                    <View style={styles.predictionDetails}>
                      <Text style={styles.predictionLevel}>
                        Predicted mood: {moodPrediction.predictedMood}/10
                      </Text>
                      <Text style={styles.predictionConfidence}>
                        Confidence: {Math.round(moodPrediction.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                  {moodPrediction.recommendations?.[0] && (
                    <Text style={styles.insightText}>
                      💡 {moodPrediction.recommendations[0]}
                    </Text>
                  )}
                </View>
              )}

              {/* Streak & Achievements */}
              {(streakData || achievements.length > 0) && (
                <View style={styles.insightCard}>
                  <Text style={styles.insightTitle}>🏆 Your Progress</Text>
                  {streakData && (
                    <View style={styles.streakContainer}>
                      <Text style={styles.streakText}>🔥 {streakData.currentStreak}</Text>
                      <Text style={styles.streakLabel}>
                        day streak • Best: {streakData.longestStreak} days
                      </Text>
                    </View>
                  )}
                  {achievements.length > 0 && (
                    <View style={styles.achievementsRow}>
                      {achievements.slice(0, 4).map((achievement) => (
                        <View key={achievement.id} style={styles.achievementBadge}>
                          <Text>{achievement.icon}</Text>
                          <Text style={styles.achievementText}>{achievement.name}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* Weekly Digest Summary */}
              {weeklyDigest && (
                <View style={styles.insightCard}>
                  <Text style={styles.insightTitle}>📊 This Week</Text>
                  <Text style={styles.insightText}>
                    Average mood: {weeklyDigest.averageMood.toFixed(1)}/10 •
                    Trend: {weeklyDigest.moodTrend === 'improving' ? '📈 Improving' :
                            weeklyDigest.moodTrend === 'declining' ? '📉 Declining' : '➡️ Stable'}
                  </Text>
                  {weeklyDigest.keyInsights?.[0] && (
                    <Text style={styles.insightText}>
                      {weeklyDigest.keyInsights[0]}
                    </Text>
                  )}
                </View>
              )}

              {/* Water Intake Insights */}
              {waterInsights && waterInsights.totalDaysTracked > 0 && (
                <View style={styles.insightCard}>
                  <Text style={styles.insightTitle}>💧 Hydration Insights</Text>
                  <View style={styles.streakContainer}>
                    <Text style={styles.streakText}>
                      {waterInsights.averageWaterIntake.toFixed(1)}
                    </Text>
                    <Text style={styles.streakLabel}>
                      avg. glasses/day • {waterInsights.totalDaysTracked} days tracked
                    </Text>
                  </View>
                  <Text style={styles.insightText}>
                    {waterInsights.insights.moodImpact === 'positive'
                      ? '📈 Higher hydration correlates with better mood!'
                      : waterInsights.insights.moodImpact === 'negative'
                      ? '📉 Consider drinking more water for improved mood'
                      : '💡 Keep tracking to discover hydration patterns'}
                  </Text>
                  <Text style={[styles.insightText, { marginTop: 4 }]}>
                    {waterInsights.insights.recommendation}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        <BannerAd size="medium" position="bottom" />
      </ScrollView>
    </SafeAreaView>
  );
}
