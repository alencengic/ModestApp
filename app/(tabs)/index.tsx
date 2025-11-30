import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Card } from "react-native-paper";
import { router, Href, useFocusEffect } from "expo-router";
import { DateTime } from "luxon";
import React, { useState, useCallback, useEffect } from "react";
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
import { StreakCard } from "@/components/StreakCard";
import { useQuery } from "@tanstack/react-query";
import { getUserStreak } from "@/storage/supabase/streaks";
import { getLatestWeeklyInsights } from "@/services/weeklyInsightsService";

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
  const quickAccessItems = getQuickAccessItems(t);

  // Fetch user streak data
  const { data: streak, isLoading: streakLoading, error: streakError } = useQuery({
    queryKey: ['userStreak'],
    queryFn: getUserStreak,
    enabled: !!user,
  });

  // Fetch weekly insights
  const { data: weeklyInsights, isLoading: insightsLoading } = useQuery({
    queryKey: ['weeklyInsights'],
    queryFn: getLatestWeeklyInsights,
    enabled: !!user,
  });

  // Debug logging
  useEffect(() => {
    if (streakError) {
      console.error('Error fetching streak:', streakError);
    }
    if (streak) {
      console.log('Streak data:', streak);
    }
  }, [streak, streakError]);

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
    insightsCard: {
      margin: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      ...theme.shadows.md,
    },
    insightsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    insightsTitle: {
      fontSize: scaleFontSize(18),
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    viewAllButton: {
      paddingHorizontal: scale(12),
      paddingVertical: scale(6),
      borderRadius: scale(12),
      backgroundColor: theme.colors.primary + '20',
    },
    viewAllText: {
      fontSize: scaleFontSize(12),
      fontWeight: '600',
      color: theme.colors.primary,
    },
    insightPreview: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    insightEmoji: {
      fontSize: 20,
      marginRight: theme.spacing.sm,
    },
    insightContent: {
      flex: 1,
    },
    insightTitle: {
      fontSize: scaleFontSize(14),
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs / 2,
    },
    insightDescription: {
      fontSize: scaleFontSize(13),
      color: theme.colors.textSecondary,
      lineHeight: 18,
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

      checkExistingData();
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

        {!streakLoading && (
          <StreakCard
            currentStreak={streak?.current_streak ?? 0}
            longestStreak={streak?.longest_streak ?? 0}
            totalEntries={streak?.total_entries ?? 0}
            onPress={() => router.push('/achievements' as any)}
          />
        )}

        {/* Weekly Insights Card */}
        {!insightsLoading && weeklyInsights && weeklyInsights.insights.length > 0 && (
          <View style={styles.insightsCard}>
            <View style={styles.insightsHeader}>
              <Text style={styles.insightsTitle}>This Week's Insights</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push('/insights' as any)}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {weeklyInsights.insights.slice(0, 3).map((insight) => (
              <View key={insight.id} style={styles.insightPreview}>
                <Text style={styles.insightEmoji}>{insight.emoji}</Text>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDescription} numberOfLines={2}>
                    {insight.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

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

        <BannerAd size="medium" position="bottom" />
      </ScrollView>
    </SafeAreaView>
  );
}
