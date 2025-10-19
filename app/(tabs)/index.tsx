import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Card } from "react-native-paper";
import { router, Href } from "expo-router";

import { BrightTheme } from "@/constants/Theme";
import { BannerAd } from "@/components/ads";
import {
  sendTestNotification,
  getScheduledNotifications,
} from "@/services/notificationService";
import { Alert } from "react-native";

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
            <Text style={styles.startButtonText}>Start Today's Entry</Text>
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
    fontSize: 28,
    fontWeight: "400",
    color: "#2C2C2C",
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#5e2607ff",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: BrightTheme.spacing.lg,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
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
    fontSize: 40,
    marginBottom: BrightTheme.spacing.sm,
  },
  cardText: {
    fontSize: 14,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrightTheme.colors.border,
  },
  testButtonText: {
    color: BrightTheme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "500",
  },
});
