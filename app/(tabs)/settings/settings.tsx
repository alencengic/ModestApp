import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { ThemeMode, ColorPaletteName, COLOR_PALETTES } from "@/constants/ColorPalettes";

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, themeMode, setThemeMode, colorPalette, setColorPalette, isDark } = useTheme();
  const { name } = useUserProfile();
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeModeChange = async (mode: ThemeMode) => {
    setIsSaving(true);
    try {
      await setThemeMode(mode);
    } catch (error) {
      console.error("Failed to change theme mode:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleColorPaletteChange = async (palette: ColorPaletteName) => {
    setIsSaving(true);
    try {
      await setColorPalette(palette);
    } catch (error) {
      console.error("Failed to change color palette:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const themeModes: { value: ThemeMode; label: string; description: string }[] = [
    { value: "light", label: "Light", description: "Always use light mode" },
    { value: "dark", label: "Dark", description: "Always use dark mode" },
    { value: "auto", label: "Auto", description: "Follow system settings" },
  ];

  const colorPalettes: { value: ColorPaletteName; label: string; description: string }[] = [
    { value: "bright", label: "Bright", description: "Warm and inviting beige tones" },
    { value: "ocean", label: "Ocean", description: "Cool and calming blue tones" },
    { value: "forest", label: "Forest", description: "Fresh and natural green tones" },
    { value: "sunset", label: "Sunset", description: "Vibrant and energetic orange tones" },
    { value: "lavender", label: "Lavender", description: "Soft and peaceful purple tones" },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    section: {
      padding: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    sectionDescription: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
    },
    optionContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    optionContent: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    optionLabel: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs / 2,
    },
    optionDescription: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
    },
    radioButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    radioButtonSelected: {
      backgroundColor: theme.colors.primary,
    },
    radioButtonInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.textOnPrimary,
    },
    palettePreview: {
      flexDirection: "row",
      gap: theme.spacing.xs,
      marginTop: theme.spacing.sm,
    },
    paletteColor: {
      width: 24,
      height: 24,
      borderRadius: theme.borderRadius.sm,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.divider,
      marginVertical: theme.spacing.lg,
    },
    currentThemePreview: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.md,
      ...theme.shadows.md,
    },
    previewTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    previewText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    previewButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: "center",
    },
    previewButtonText: {
      color: theme.colors.textOnPrimary,
      fontSize: theme.typography.body.fontSize,
      fontWeight: "600",
    },
    profileCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      ...theme.shadows.sm,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.textPrimary,
      marginBottom: 4,
    },
    profileSubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    chevron: {
      fontSize: 20,
      color: theme.colors.primary,
      fontWeight: "700",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* User Profile Card */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => router.push("/(tabs)/settings/user-profile")}
          >
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{name || "User"}</Text>
              <Text style={styles.profileSubtext}>Manage your profile</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme Mode</Text>
          <Text style={styles.sectionDescription}>
            Choose how the app should display: light, dark, or follow your system settings
          </Text>

          {themeModes.map((mode) => (
            <TouchableOpacity
              key={mode.value}
              style={styles.optionContainer}
              onPress={() => handleThemeModeChange(mode.value)}
              disabled={isSaving}
            >
              <View style={styles.option}>
                <View style={styles.optionContent}>
                  <Text style={styles.optionLabel}>{mode.label}</Text>
                  <Text style={styles.optionDescription}>{mode.description}</Text>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    themeMode === mode.value && styles.radioButtonSelected,
                  ]}
                >
                  {themeMode === mode.value && <View style={styles.radioButtonInner} />}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Color Palette</Text>
          <Text style={styles.sectionDescription}>
            Select your preferred color scheme for the app
          </Text>

          {colorPalettes.map((palette) => {
            const paletteColors = COLOR_PALETTES[palette.value];
            const displayPalette = isDark ? paletteColors.dark : paletteColors.light;

            return (
              <TouchableOpacity
                key={palette.value}
                style={styles.optionContainer}
                onPress={() => handleColorPaletteChange(palette.value)}
                disabled={isSaving}
              >
                <View style={styles.option}>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionLabel}>{palette.label}</Text>
                    <Text style={styles.optionDescription}>{palette.description}</Text>
                    <View style={styles.palettePreview}>
                      <View
                        style={[
                          styles.paletteColor,
                          { backgroundColor: displayPalette.colors.primary },
                        ]}
                      />
                      <View
                        style={[
                          styles.paletteColor,
                          { backgroundColor: displayPalette.colors.secondary },
                        ]}
                      />
                      <View
                        style={[
                          styles.paletteColor,
                          { backgroundColor: displayPalette.colors.accent },
                        ]}
                      />
                      <View
                        style={[
                          styles.paletteColor,
                          { backgroundColor: displayPalette.colors.success },
                        ]}
                      />
                    </View>
                  </View>
                  <View
                    style={[
                      styles.radioButton,
                      colorPalette === palette.value && styles.radioButtonSelected,
                    ]}
                  >
                    {colorPalette === palette.value && <View style={styles.radioButtonInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.currentThemePreview}>
            <Text style={styles.previewTitle}>Theme Preview</Text>
            <Text style={styles.previewText}>
              This is how your app will look with the current theme settings. The text, backgrounds,
              and accents all adapt to your chosen palette.
            </Text>
            <TouchableOpacity style={styles.previewButton}>
              <Text style={styles.previewButtonText}>Sample Button</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
