import { StyleSheet, ScrollView, SafeAreaView, View } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { router, Href } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const quickAccessItems: { title: string; icon: string; route: Href }[] = [
  {
    title: "Daily Entry",
    icon: "calendar-check",
    route: "/daily/daily",
  },
  {
    title: "Daily Journal",
    icon: "book-open-page-variant",
    route: "/daily/journal",
  },
  {
    title: "Trends",
    icon: "chart-line",
    route: "/trends/trends",
  },
  {
    title: "Mood Analytics",
    icon: "emoticon-happy-outline",
    route: "/mood/analytics",
  },
  {
    title: "Food Analytics",
    icon: "food-apple-outline",
    route: "/trends/food-analytics",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
        </ThemedView>

        <View style={styles.quickAccessContainer}>
          {quickAccessItems.map((item) => (
            <Card
              key={item.title}
              style={styles.card}
              onPress={() => router.push(item.route)}
            >
              <Card.Content style={styles.cardContent}>
                <IconButton icon={item.icon} size={30} />
                <Text style={styles.cardText}>{item.title}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 24,
  },
  quickAccessContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 16,
    elevation: 4,
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  cardText: {
    marginTop: 8,
    textAlign: "center",
  },
});
