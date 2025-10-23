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

import { BrightTheme } from "@/constants/Theme";
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
  color: string;
}[] = [
  {
    title: "Daily Journal",
    icon: "book-open-page-variant",
    route: "/daily/journal",
    emoji: "📔",
    color: "#e6b397ff",
  },
  {
    title: "Trends",
    icon: "chart-line",
    route: "/trends/trends",
    emoji: "📊",
    color: "#e6b397ff",
  },
  {
    title: "Mood Analytics",
    icon: "emoticon-happy-outline",
    route: "/mood/analytics",
    emoji: "😊",
    color: "#e6b397ff",
  },
  {
    title: "Food Analytics",
    icon: "food-apple-outline",
    route: "/trends/food-analytics",
    emoji: "🍎",
    color: "#e6b397ff",
  },
  {
    title: "Weather & Mood",
    icon: "weather-sunny",
    route: "/weather/weather-mood",
    emoji: "🌤️",
    color: "#e6b397ff",
  },
];

export default function HomeScreen() {
  const [hasExistingData, setHasExistingData] = useState(false);

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
              {hasExistingData ? "Continue Today's Entry" : "Start Today's Entry"}
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
          {quickAccessItems.map((item) => (
            <Card
              key={item.title}
              style={[styles.card, { backgroundColor: item.color }]}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5E6D3",
  },
  container: {
    paddingBottom: BrightTheme.spacing.xl,
  },
  header: {
    paddingHorizontal: BrightTheme.spacing.xl,
    paddingTop: BrightTheme.spacing.xl,
    paddingBottom: BrightTheme.spacing.lg,
    alignItems: "center",
    backgroundColor: "#F5E6D3",
  },
  headerTitle: {
    fontSize: scaleFontSize(28),
    fontWeight: "400",
    color: "#2C2C2C",
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#5e2607ff",
    paddingHorizontal: scale(32),
    paddingVertical: scale(12),
    borderRadius: scale(24),
    marginTop: BrightTheme.spacing.lg,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: scaleFontSize(16),
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: scaleFontSize(18),
    fontWeight: "700",
    color: "#2C2C2C",
    marginHorizontal: BrightTheme.spacing.md,
    marginBottom: BrightTheme.spacing.md,
    marginTop: BrightTheme.spacing.md,
  },
  quickAccessContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: BrightTheme.spacing.md,
  },
  card: {
    width: "48%",
    marginBottom: BrightTheme.spacing.md,
    borderRadius: BrightTheme.borderRadius.lg,
    elevation: 0,
    shadowOpacity: 0,
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: BrightTheme.spacing.xl,
  },
  emoji: {
    fontSize: scaleFontSize(40),
    marginBottom: BrightTheme.spacing.sm,
  },
  cardText: {
    fontSize: scaleFontSize(14),
    fontWeight: "600",
    color: "#2C2C2C",
    textAlign: "center",
  },
  testButtonsContainer: {
    flexDirection: "row",
    gap: BrightTheme.spacing.sm,
    marginTop: BrightTheme.spacing.md,
  },
  testButton: {
    backgroundColor: BrightTheme.colors.background,
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: BrightTheme.colors.border,
  },
  testButtonText: {
    color: BrightTheme.colors.textPrimary,
    fontSize: scaleFontSize(13),
    fontWeight: "500",
  },
});
