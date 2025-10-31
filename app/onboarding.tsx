import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage, SUPPORTED_LANGUAGES, type LanguageCode } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

const getSlides = (t: any) => [
  {
    id: "0",
    title: t('onboarding.language'),
    emoji: "🌍",
    description: t('onboarding.selectLanguage'),
    isLanguageSelection: true,
  },
  {
    id: "1",
    title: t('onboarding.welcome'),
    emoji: "👋",
    description: t('onboarding.welcomeDesc'),
  },
  {
    id: "2",
    title: t('onboarding.trackMood'),
    emoji: "😊",
    description: t('onboarding.trackMoodDesc'),
  },
  {
    id: "3",
    title: t('onboarding.monitorFood'),
    emoji: "🍎",
    description: t('onboarding.monitorFoodDesc'),
  },
  {
    id: "4",
    title: t('onboarding.dailyJournalTitle'),
    emoji: "📔",
    description: t('onboarding.dailyJournalDesc'),
  },
  {
    id: "5",
    title: t('onboarding.insights'),
    emoji: "📊",
    description: t('onboarding.insightsDesc'),
  },
];

const OnboardingScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = getSlides(t);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/profile-setup");
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/profile-setup");
  };

  const isLastSlide = currentSlide === slides.length - 1;
  const slide = slides[currentSlide];

  const handleLanguageSelect = async (langCode: LanguageCode) => {
    await changeLanguage(langCode);
    handleNext();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    skipButton: {
      position: "absolute",
      top: 50,
      right: 20,
      zIndex: 10,
      padding: 10,
    },
    skipText: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 30,
    },
    slideContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 60,
    },
    emoji: {
      fontSize: 100,
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.textPrimary,
      textAlign: "center",
      marginBottom: 20,
    },
    description: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      paddingHorizontal: 10,
    },
    pagination: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.border,
      marginHorizontal: 5,
    },
    activeDot: {
      width: 24,
      backgroundColor: theme.colors.primary,
    },
    footer: {
      paddingHorizontal: 30,
      paddingBottom: 40,
    },
    nextButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      borderRadius: theme.borderRadius.round,
      alignItems: "center",
    },
    nextText: {
      color: theme.colors.textOnPrimary,
      fontSize: 18,
      fontWeight: "600",
    },
    getStartedButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      borderRadius: theme.borderRadius.round,
      alignItems: "center",
    },
    getStartedText: {
      color: theme.colors.textOnPrimary,
      fontSize: 18,
      fontWeight: "600",
    },
    languageButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: theme.borderRadius.lg,
      marginVertical: 8,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    languageButtonActive: {
      backgroundColor: theme.colors.primary + "20",
      borderColor: theme.colors.primary,
    },
    languageInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    languageFlag: {
      fontSize: 32,
    },
    languageNames: {
      gap: 4,
    },
    languageName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    languageNativeName: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    checkmark: {
      fontSize: 24,
      color: theme.colors.primary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>{t('common.skip')}</Text>
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.slideContainer}>
          <Text style={styles.emoji}>{slide.emoji}</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>

          {/* Language Selection */}
          {slide.isLanguageSelection && (
            <View style={{ marginTop: 40, width: "100%" }}>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    currentLanguage === lang.code && styles.languageButtonActive,
                  ]}
                  onPress={() => handleLanguageSelect(lang.code)}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                    <View style={styles.languageNames}>
                      <Text style={styles.languageName}>{lang.name}</Text>
                      <Text style={styles.languageNativeName}>{lang.nativeName}</Text>
                    </View>
                  </View>
                  {currentLanguage === lang.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.footer}>
        {isLastSlide ? (
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.getStartedText}>{t('onboarding.getStarted')}</Text>
          </TouchableOpacity>
        ) : !slide.isLanguageSelection ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>{t('onboarding.continue')} →</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
