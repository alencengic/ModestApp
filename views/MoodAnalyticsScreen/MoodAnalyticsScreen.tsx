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
import { useTranslation } from "react-i18next";

const MoodAnalyticsScreen: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const styles = createStyles(theme);

  const analysisOptions = [
    {
      id: "lifestyle",
      title: t('moodAnalytics.lifestyleFactors'),
      description: t('moodAnalytics.lifestyleDescription'),
      emoji: "📊",
      route: "/(tabs)/mood/lifestyle-analysis" as any,
      color: theme.colors.primary,
    },
    {
      id: "food",
      title: t('moodAnalytics.foodImpactAnalysis'),
      description: t('moodAnalytics.foodImpactDescription'),
      emoji: "🍎",
      route: "/(tabs)/mood/food-impact-analysis" as any,
      color: theme.colors.secondary,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
          <Text style={styles.infoTitle}>{t('moodAnalytics.aboutAnalytics')}</Text>
          <Text style={styles.infoText}>
            {t('moodAnalytics.aboutText')}
          </Text>
          <View style={styles.infoBullets}>
            <Text style={styles.infoBullet}>{t('moodAnalytics.trackPatterns')}</Text>
            <Text style={styles.infoBullet}>{t('moodAnalytics.identifyFoods')}</Text>
            <Text style={styles.infoBullet}>{t('moodAnalytics.makeDecisions')}</Text>
          </View>
          <Text style={styles.infoNote}>
            {t('moodAnalytics.moreDataNote')}
          </Text>
        </View>

        <BannerAd size="medium" position="bottom" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodAnalyticsScreen;
