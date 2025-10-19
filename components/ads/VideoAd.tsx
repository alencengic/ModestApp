import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { BrightTheme } from "@/constants/Theme";

interface VideoAdProps {
  onAdComplete?: () => void;
  rewardAmount?: number;
}

export const VideoAd: React.FC<VideoAdProps> = ({
  onAdComplete,
  rewardAmount
}) => {
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

const styles = StyleSheet.create({
  container: {
    marginVertical: BrightTheme.spacing.md,
  },
  card: {
    backgroundColor: BrightTheme.colors.surface,
    borderRadius: BrightTheme.borderRadius.lg,
    padding: BrightTheme.spacing.lg,
    alignItems: "center",
    ...BrightTheme.shadows.md,
    borderWidth: 2,
    borderColor: BrightTheme.colors.primary,
  },
  icon: {
    fontSize: 48,
    marginBottom: BrightTheme.spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: BrightTheme.colors.textPrimary,
    marginBottom: BrightTheme.spacing.xs,
  },
  reward: {
    fontSize: 16,
    fontWeight: "600",
    color: BrightTheme.colors.secondary,
    marginBottom: BrightTheme.spacing.md,
  },
  button: {
    backgroundColor: BrightTheme.colors.primary,
    paddingHorizontal: BrightTheme.spacing.xl,
    paddingVertical: BrightTheme.spacing.md,
    borderRadius: BrightTheme.borderRadius.round,
    ...BrightTheme.shadows.sm,
  },
  buttonText: {
    color: BrightTheme.colors.textOnPrimary,
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
    borderRadius: BrightTheme.borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    padding: BrightTheme.spacing.lg,
  },
  videoPlaceholder: {
    fontSize: 64,
    marginBottom: BrightTheme.spacing.md,
  },
  videoText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: BrightTheme.spacing.md,
  },
  countdownContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: BrightTheme.spacing.md,
    paddingVertical: BrightTheme.spacing.sm,
    borderRadius: BrightTheme.borderRadius.md,
  },
  countdownText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  completedText: {
    color: BrightTheme.colors.success,
    fontSize: 20,
    fontWeight: "700",
  },
});
