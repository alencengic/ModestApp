import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BrightTheme } from "@/constants/Theme";

interface BannerAdProps {
  size?: "small" | "medium" | "large";
  position?: "top" | "bottom" | "inline";
}

export const BannerAd: React.FC<BannerAdProps> = ({
  size = "small",
  position = "inline"
}) => {
  const getHeight = () => {
    switch (size) {
      case "small": return 50;
      case "medium": return 100;
      case "large": return 250;
      default: return 50;
    }
  };

  return (
    <View style={[
      styles.container,
      { height: getHeight() },
      position === "top" && styles.topPosition,
      position === "bottom" && styles.bottomPosition,
    ]}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>📱 Advertisement Space</Text>
        <Text style={styles.placeholderSize}>{size.toUpperCase()}</Text>
        <Text style={styles.placeholderDimensions}>
          {Dimensions.get("window").width - 32} x {getHeight()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: BrightTheme.spacing.sm,
    overflow: "hidden",
  },
  topPosition: {
    marginTop: 0,
    marginBottom: BrightTheme.spacing.md,
  },
  bottomPosition: {
    marginTop: BrightTheme.spacing.md,
    marginBottom: 0,
  },
  placeholder: {
    flex: 1,
    backgroundColor: BrightTheme.colors.surfaceLight,
    borderRadius: BrightTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: BrightTheme.colors.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    padding: BrightTheme.spacing.sm,
  },
  placeholderText: {
    fontSize: 16,
    color: BrightTheme.colors.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
  },
  placeholderSize: {
    fontSize: 12,
    color: BrightTheme.colors.primary,
    fontWeight: "700",
    marginBottom: 2,
  },
  placeholderDimensions: {
    fontSize: 10,
    color: BrightTheme.colors.textLight,
  },
});
