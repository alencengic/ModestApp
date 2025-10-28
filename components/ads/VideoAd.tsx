import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface VideoAdProps {
  onAdComplete?: () => void;
  rewardAmount?: number;
}

export const VideoAd: React.FC<VideoAdProps> = ({
  onAdComplete,
  rewardAmount
}) => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handlePlayAd = () => {
    setIsPlaying(true);
    setCountdown(5);

    // Simulate ad playing with countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsPlaying(false);
            onAdComplete?.();
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: theme.spacing.md,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      alignItems: "center",
      ...theme.shadows.md,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    icon: {
      fontSize: 48,
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    reward: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.secondary,
      marginBottom: theme.spacing.md,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.round,
      ...theme.shadows.sm,
    },
    buttonText: {
      color: theme.colors.textOnPrimary,
      fontSize: 16,
      fontWeight: "700",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      justifyContent: "center",
      alignItems: "center",
    },
    videoContainer: {
      width: "90%",
      aspectRatio: 16 / 9,
      backgroundColor: "#1a1a1a",
      borderRadius: theme.borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
    },
    videoPlaceholder: {
      fontSize: 64,
      marginBottom: theme.spacing.md,
    },
    videoText: {
      color: "#ffffff",
      fontSize: 18,
      fontWeight: "600",
      marginBottom: theme.spacing.md,
    },
    countdownContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    countdownText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "700",
    },
    completedText: {
      color: theme.colors.success,
      fontSize: 20,
      fontWeight: "700",
    },
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.icon}>🎬</Text>
          <Text style={styles.title}>Watch Video Ad</Text>
          {rewardAmount && (
            <Text style={styles.reward}>
              Earn {rewardAmount} points!
            </Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handlePlayAd}
          >
            <Text style={styles.buttonText}>▶ Play Ad</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={isPlaying}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.videoContainer}>
            <Text style={styles.videoPlaceholder}>📺</Text>
            <Text style={styles.videoText}>Video Ad Playing</Text>
            {countdown > 0 && (
              <View style={styles.countdownContainer}>
                <Text style={styles.countdownText}>
                  Ad ends in: {countdown}s
                </Text>
              </View>
            )}
            {countdown === 0 && (
              <Text style={styles.completedText}>✓ Ad Completed!</Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};
