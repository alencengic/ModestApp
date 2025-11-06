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
import { useState, useCallback } from "react";

import { useTheme } from "@/context/ThemeContext";
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

const getQuickAccessItems = (t: any): {
  title: string;
  icon: string;
  route: Href;
  emoji: string;
}[] => [
  {
    title: t('navigation.dailyJournal'),
    icon: "book-open-page-variant",
    route: "/daily/journal",
    emoji: "📔",
  },
  {
    title: t('navigation.trendsAnalytics'),
    icon: "chart-line",
    route: "/trends/trends",
    emoji: "📊",
  },
  {
    title: t('navigation.moodAnalytics'),
    icon: "emoticon-happy-outline",
    route: "/mood/analytics",
    emoji: "😊",
  },
  {
    title: t('trendsAnalytics.title'),
    icon: "food-apple-outline",
    route: "/trends/food-analytics",
    emoji: "🍎",
  },
  {
    title: t('navigation.weatherMood'),
    icon: "weather-sunny",
    route: "/weather/weather-mood",
    emoji: "🌤️",
  },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const { name } = useUserProfile();
  const { t } = useTranslation();
  const [hasExistingData, setHasExistingData] = useState(false);
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
    },
    cardContent: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    emoji: {
      fontSize: scaleFontSize(40),
      marginBottom: theme.spacing.sm,
    },
    cardText: {
      fontSize: scaleFontSize(14),
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
  });

  // Re-check data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const checkExistingData = async () => {
        const today = DateTime.now().toISODate() as string;

        // Check if there's any data for today
        const [mood, productivity, foodIntake] = await Promise.all([
          getMoodByDate(today),
          getProductivityByDate(today),
          getFoodIntakeByDate(today),
        ]);

        // If any data exists for today, show "Continue" text
        setHasExistingData(!!(mood || productivity || foodIntake));
      };

      checkExistingData();
    }, [])
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
            onPress={() => router.push("/daily/daily")}
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
          {quickAccessItems.map((item, index) => (
            <Card
              key={item.title}
              style={[
                styles.card,
                { backgroundColor: theme.colors.cardColors[Object.keys(theme.colors.cardColors)[index] as keyof typeof theme.colors.cardColors] || theme.colors.surface }
              ]}
              onPress={() => router.push(item.route)}
            >
              <Card.Content style={styles.cardContent}>
                <Text style={styles.emoji}>{item.emoji}</Text>
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
