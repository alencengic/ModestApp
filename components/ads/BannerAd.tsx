import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface BannerAdProps {
  size?: "small" | "medium" | "large";
  position?: "top" | "bottom" | "inline";
}

export const BannerAd: React.FC<BannerAdProps> = ({
  size = "small",
  position = "inline"
}) => {
  const { theme } = useTheme();

  const getHeight = () => {
    switch (size) {
      case "small": return 50;
      case "medium": return 100;
      case "large": return 250;
      default: return 50;
    }
  };

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      marginVertical: theme.spacing.sm,
      overflow: "hidden",
    },
    topPosition: {
      marginTop: 0,
      marginBottom: theme.spacing.md,
    },
    bottomPosition: {
      marginTop: theme.spacing.md,
      marginBottom: 0,
    },
    placeholder: {
      flex: 1,
      backgroundColor: theme.colors.surfaceLight,
      borderRadius: theme.borderRadius.md,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: "dashed",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.sm,
    },
    placeholderText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginBottom: 4,
    },
    placeholderSize: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: "700",
      marginBottom: 2,
    },
    placeholderDimensions: {
      fontSize: 10,
      color: theme.colors.textLight,
    },
  });

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
