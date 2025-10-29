import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { createStyles } from "./MoodAnalyticsScreen.styles";
import { useTheme } from "@/context/ThemeContext";
import { BannerAd } from "@/components/ads";
import { scaleFontSize } from "@/utils/responsive";

const MoodAnalyticsScreen: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  const analysisOptions = [
    {
      id: "lifestyle",
      title: "Lifestyle Factors",
      description: "Analyze how work schedule and exercise habits impact your well-being",
      emoji: "📊",
      route: "/(tabs)/mood/lifestyle-analysis" as any,
      color: theme.colors.primary,
    },
    {
      id: "food",
      title: "Food Impact Analysis",
      description: "Discover which foods affect your mood and productivity",
      emoji: "🍎",
      route: "/(tabs)/mood/food-impact-analysis" as any,
      color: theme.colors.secondary,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>😊</Text>
          <Text style={styles.headerTitle}>
            Mood & Productivity Analytics
          </Text>
          <Text style={styles.headerDescription}>
            Understand how food and lifestyle choices affect your well-being
          </Text>
        </View>

        <BannerAd size="small" position="top" />

        <View style={styles.optionsContainer}>
          {analysisOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionCard, { borderLeftColor: option.color }]}
              onPress={() => router.push(option.route)}
            >
              <View style={styles.optionEmojiContainer}>
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Text style={styles.optionChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Analytics</Text>
          <Text style={styles.infoText}>
            These tools help you identify patterns in your mood and productivity by analyzing your daily entries.
          </Text>
          <View style={styles.infoBullets}>
            <Text style={styles.infoBullet}>• Track lifestyle patterns and their effects</Text>
            <Text style={styles.infoBullet}>• Identify foods that boost or lower your mood</Text>
            <Text style={styles.infoBullet}>• Make informed decisions about your health</Text>
          </View>
          <Text style={styles.infoNote}>
            The more entries you add, the more accurate your insights become.
          </Text>
        </View>

        <BannerAd size="medium" position="bottom" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodAnalyticsScreen;
