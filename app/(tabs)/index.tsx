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
import { BannerAd } from "@/components/ads";
import {
  sendTestNotification,
  getScheduledNotifications,
} from "@/services/notificationService";
import { Alert } from "react-native";
import { getMoodByDate } from "@/storage/mood_entries";
import { getProductivityByDate } from "@/storage/productivity_entries";
import { getFoodIntakeByDate } from "@/storage/food_intakes";
import { scaleFontSize, scale } from "@/utils/responsive";

const quickAccessItems: {
  title: string;
  icon: string;
  route: Href;
  emoji: string;
}[] = [
  {
    title: "Daily Journal",
    icon: "book-open-page-variant",
    route: "/daily/journal",
    emoji: "📔",
  },
  {
    title: "Trends",
    icon: "chart-line",
    route: "/trends/trends",
    emoji: "📊",
  },
  {
    title: "Mood Analytics",
    icon: "emoticon-happy-outline",
    route: "/mood/analytics",
    emoji: "😊",
  },
  {
    title: "Food Analytics",
    icon: "food-apple-outline",
    route: "/trends/food-analytics",
    emoji: "🍎",
  },
  {
    title: "Weather & Mood",
    icon: "weather-sunny",
    route: "/weather/weather-mood",
    emoji: "🌤️",
  },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const [hasExistingData, setHasExistingData] = useState(false);

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
      "Test Scheduled",
      "You'll receive a test notification in 2 seconds!"
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
        "Scheduled Notifications",
        `You have ${scheduled.length} notifications scheduled at: ${times}`
      );
    } else {
      Alert.alert("No Notifications", "No scheduled notifications found.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome back</Text>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push("/daily/daily")}
          >
            <Text style={styles.startButtonText}>
              {hasExistingData ? "Edit Today's Entry" : "Start Today's Entry"}
            </Text>
          </TouchableOpacity>

          <View style={styles.testButtonsContainer}>
            <TouchableOpacity
              style={styles.testButton}
              onPress={handleTestNotification}
            >
              <Text style={styles.testButtonText}>🔔 Test Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.testButton}
              onPress={handleCheckScheduled}
            >
              <Text style={styles.testButtonText}>📋 Check Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>

        <BannerAd size="small" position="top" />

        <Text style={styles.sectionTitle}>Quick Access</Text>
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
