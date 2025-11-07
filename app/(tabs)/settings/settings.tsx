import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage, SUPPORTED_LANGUAGES, type LanguageCode } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";
import { ThemeMode, ColorPaletteName, COLOR_PALETTES } from "@/constants/ColorPalettes";

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, themeMode, setThemeMode, colorPalette, setColorPalette, isDark } = useTheme();
  const { name } = useUserProfile();
  const { signOut, user, clearAuthData } = useAuth();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);

  const handleClearOnboardingData = async () => {
    Alert.alert(
      'Clear Onboarding Data',
      'This will reset onboarding and profile setup status. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              if (user?.id) {
                await Promise.all([
                  AsyncStorage.removeItem(`hasSeenOnboarding_${user.id}`),
                  AsyncStorage.removeItem(`hasCompletedProfileSetup_${user.id}`)
                ]);
                Alert.alert('Success', 'Onboarding data cleared. App will restart onboarding.');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to clear onboarding data');
            }
          },
        },
      ]
    );
  };

  const handleClearAuthData = async () => {
    Alert.alert(
      'Clear Auth Data',
      'This will clear all authentication and onboarding data. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAuthData();
              Alert.alert('Success', 'Auth data cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear auth data');
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled automatically by the auth context
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

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

  const handleLanguageChange = async (lang: LanguageCode) => {
    setIsSaving(true);
    try {
      await changeLanguage(lang);
    } catch (error) {
      console.error("Failed to change language:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const themeModes: { value: ThemeMode; label: string; description: string }[] = [
    { value: "light", label: t('settings.light'), description: t('settings.lightDescription') },
    { value: "dark", label: t('settings.dark'), description: t('settings.darkDescription') },
    { value: "auto", label: t('settings.auto'), description: t('settings.autoDescription') },
  ];

  const colorPalettes: { value: ColorPaletteName; label: string; description: string }[] = [
    { value: "bright", label: t('settings.bright'), description: t('settings.brightDescription') },
    { value: "ocean", label: t('settings.ocean'), description: t('settings.oceanDescription') },
    { value: "forest", label: t('settings.forest'), description: t('settings.forestDescription') },
    { value: "sunset", label: t('settings.sunset'), description: t('settings.sunsetDescription') },
    { value: "lavender", label: t('settings.lavender'), description: t('settings.lavenderDescription') },
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
    logoutSection: {
      padding: theme.spacing.lg,
      paddingTop: 0,
    },
    logoutButton: {
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    logoutButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    userInfo: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    userEmail: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    debugButton: {
      backgroundColor: theme.colors.warning,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    debugButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
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
              <Text style={styles.profileName}>{name || t('navigation.userProfile')}</Text>
              <Text style={styles.profileSubtext}>{t('settings.manageProfile')}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <Text style={styles.sectionDescription}>
            {t('settings.selectLanguage')}
          </Text>

          {SUPPORTED_LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.optionContainer}
              onPress={() => handleLanguageChange(lang.code)}
              disabled={isSaving}
            >
              <View style={styles.option}>
                <View style={styles.optionContent}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <Text style={{ fontSize: 24 }}>{lang.flag}</Text>
                    <View>
                      <Text style={styles.optionLabel}>{lang.name}</Text>
                      <Text style={styles.optionDescription}>{lang.nativeName}</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    currentLanguage === lang.code && styles.radioButtonSelected,
                  ]}
                >
                  {currentLanguage === lang.code && <View style={styles.radioButtonInner} />}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.divider} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.themeMode')}</Text>
          <Text style={styles.sectionDescription}>
            {t('settings.themeModeDescription')}
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

          <Text style={styles.sectionTitle}>{t('settings.colorPalette')}</Text>
          <Text style={styles.sectionDescription}>
            {t('settings.colorPaletteDescription')}
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

          <Text style={styles.sectionTitle}>{t('settings.preview')}</Text>
          <View style={styles.currentThemePreview}>
            <Text style={styles.previewTitle}>{t('settings.themePreview')}</Text>
            <Text style={styles.previewText}>
              {t('settings.themePreviewText')}
            </Text>
            <TouchableOpacity style={styles.previewButton}>
              <Text style={styles.previewButtonText}>{t('settings.sampleButton')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.logoutSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.userInfo}>
            <Text style={styles.optionLabel}>Signed in as</Text>
            <Text style={styles.userEmail}>{user?.email || 'Not signed in'}</Text>
          </View>

          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.debugButton} 
            onPress={handleClearAuthData}
          >
            <Text style={styles.debugButtonText}>Clear Auth Data (Debug)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.debugButton} 
            onPress={handleClearOnboardingData}
          >
            <Text style={styles.debugButtonText}>Clear Onboarding Data (Debug)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}