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

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Welcome to ModestApp",
    emoji: "👋",
    description:
      "Your personal companion for tracking mood, food, and wellness habits. Start your journey to a healthier, happier you!",
  },
  {
    id: "2",
    title: "Track Your Mood",
    emoji: "😊",
    description:
      "Record your daily mood, productivity, and see how weather affects your emotional well-being.",
  },
  {
    id: "3",
    title: "Monitor Food Intake",
    emoji: "🍎",
    description:
      "Log your meals and discover patterns between what you eat and how you feel. Track symptoms and find your ideal diet.",
  },
  {
    id: "4",
    title: "Daily Journal",
    emoji: "📔",
    description:
      "Express your thoughts and feelings in a private journal. Write, edit, and review your entries anytime.",
  },
  {
    id: "5",
    title: "Insights & Analytics",
    emoji: "📊",
    description:
      "Visualize trends, discover correlations, and gain actionable insights about your health and habits.",
  },
];

const OnboardingScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(tabs)");
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(tabs)");
  };

  const isLastSlide = currentSlide === slides.length - 1;
  const slide = slides[currentSlide];

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
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.slideContainer}>
          <Text style={styles.emoji}>{slide.emoji}</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
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
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>Next →</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
