import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useUserProfile } from "@/context/UserProfileContext";
import type { DayOfWeek, WeightUnit } from "@/storage/userProfile";

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: "monday", label: "profileSetup.mon" },
  { value: "tuesday", label: "profileSetup.tue" },
  { value: "wednesday", label: "profileSetup.wed" },
  { value: "thursday", label: "profileSetup.thu" },
  { value: "friday", label: "profileSetup.fri" },
  { value: "saturday", label: "profileSetup.sat" },
  { value: "sunday", label: "profileSetup.sun" },
];

const ProfileSetupScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { updateProfile } = useUserProfile();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [workingDays, setWorkingDays] = useState<DayOfWeek[]>([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]);
  const [sportDays, setSportDays] = useState<DayOfWeek[]>([]);

  const toggleWorkingDay = (day: DayOfWeek) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const toggleSportDay = (day: DayOfWeek) => {
    if (sportDays.includes(day)) {
      setSportDays(sportDays.filter((d) => d !== day));
    } else {
      setSportDays([...sportDays, day]);
    }
  };

  const handleSaveAndContinue = async () => {
    try {
      // Validate name (mandatory)
      if (!name.trim()) {
        Alert.alert(t("profileSetup.nameRequired"), t("profileSetup.nameRequiredMessage"));
        return;
      }

      // Validate age (optional, but must be valid if provided)
      const ageNum = age.trim() ? parseInt(age) : null;
      if (ageNum !== null && (isNaN(ageNum) || ageNum < 1 || ageNum > 150)) {
        Alert.alert(t("profileSetup.invalidAge"), t("profileSetup.invalidAgeMessage"));
        return;
      }

      // Validate weight (optional, but must be valid if provided)
      const weightNum = weight.trim() ? parseFloat(weight) : null;
      if (weightNum !== null && (isNaN(weightNum) || weightNum <= 0 || weightNum > 500)) {
        Alert.alert(t("profileSetup.invalidWeight"), t("profileSetup.invalidWeightMessage"));
        return;
      }

      await updateProfile({
        name: name.trim(),
        age: ageNum,
        weight: weightNum,
        weight_unit: weightUnit,
        working_days: workingDays,
        sport_days: sportDays,
      });

      await AsyncStorage.setItem("hasCompletedProfileSetup", "true");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(t("profileSetup.error"), t("profileSetup.errorMessage"));
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("hasCompletedProfileSetup", "true");
    router.replace("/(tabs)");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    header: {
      marginBottom: 30,
      alignItems: "center",
    },
    emoji: {
      fontSize: 64,
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.textPrimary,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: 12,
    },
    sectionDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    weightContainer: {
      flexDirection: "row",
      gap: 12,
    },
    weightInputContainer: {
      flex: 1,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: 14,
      fontSize: 16,
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.surface,
    },
    unitSelector: {
      flexDirection: "row",
      gap: 8,
      marginTop: 8,
    },
    unitButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    unitButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    unitButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },
    unitButtonTextActive: {
      color: theme.colors.textOnPrimary,
    },
    daysContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    dayButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    dayButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    dayButtonText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },
    dayButtonTextActive: {
      color: theme.colors.textOnPrimary,
    },
    weekendInfo: {
      marginTop: 8,
      padding: 12,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
    },
    weekendInfoText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    buttons: {
      gap: 12,
      marginTop: 20,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: theme.borderRadius.round,
      alignItems: "center",
    },
    saveButtonText: {
      color: theme.colors.textOnPrimary,
      fontSize: 16,
      fontWeight: "700",
    },
    skipButton: {
      padding: 16,
      alignItems: "center",
    },
    skipButtonText: {
      color: theme.colors.textSecondary,
      fontSize: 15,
      fontWeight: "600",
    },
  });

  const weekendDays = DAYS_OF_WEEK.filter((day) => !workingDays.includes(day.value));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.emoji}>⚙️</Text>
          <Text style={styles.title}>{t("profileSetup.title")}</Text>
          <Text style={styles.subtitle}>
            {t("profileSetup.subtitle")}
          </Text>
        </View>

        {/* Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profileSetup.nameTitle")}</Text>
          <Text style={styles.sectionDescription}>
            {t("profileSetup.nameDescription")}
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t("profileSetup.namePlaceholder")}
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="words"
          />
        </View>

        {/* Age Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profileSetup.ageTitle")}</Text>
          <Text style={styles.sectionDescription}>
            {t("profileSetup.ageDescription")}
          </Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder={t("profileSetup.agePlaceholder")}
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="number-pad"
          />
        </View>

        {/* Weight Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profileSetup.weightTitle")}</Text>
          <Text style={styles.sectionDescription}>
            {t("profileSetup.weightDescription")}
          </Text>
          <View style={styles.weightContainer}>
            <View style={styles.weightInputContainer}>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder={t("profileSetup.weightPlaceholder")}
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                weightUnit === "kg" && styles.unitButtonActive,
              ]}
              onPress={() => setWeightUnit("kg")}
            >
              <Text
                style={[
                  styles.unitButtonText,
                  weightUnit === "kg" && styles.unitButtonTextActive,
                ]}
              >
                {t("profileSetup.kg")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                weightUnit === "lbs" && styles.unitButtonActive,
              ]}
              onPress={() => setWeightUnit("lbs")}
            >
              <Text
                style={[
                  styles.unitButtonText,
                  weightUnit === "lbs" && styles.unitButtonTextActive,
                ]}
              >
                {t("profileSetup.lbs")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Working Days Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profileSetup.workingDaysTitle")}</Text>
          <Text style={styles.sectionDescription}>
            {t("profileSetup.workingDaysDescription")}
          </Text>
          <View style={styles.daysContainer}>
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day.value}
                style={[
                  styles.dayButton,
                  workingDays.includes(day.value) && styles.dayButtonActive,
                ]}
                onPress={() => toggleWorkingDay(day.value)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    workingDays.includes(day.value) && styles.dayButtonTextActive,
                  ]}
                >
                  {t(day.label)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {weekendDays.length > 0 && (
            <View style={styles.weekendInfo}>
              <Text style={styles.weekendInfoText}>
                {t("profileSetup.weekend")} {weekendDays.map((d) => t(d.label)).join(", ")}
              </Text>
            </View>
          )}
        </View>

        {/* Sport/Training Days Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profileSetup.sportDaysTitle")}</Text>
          <Text style={styles.sectionDescription}>
            {t("profileSetup.sportDaysDescription")}
          </Text>
          <View style={styles.daysContainer}>
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day.value}
                style={[
                  styles.dayButton,
                  sportDays.includes(day.value) && styles.dayButtonActive,
                ]}
                onPress={() => toggleSportDay(day.value)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    sportDays.includes(day.value) && styles.dayButtonTextActive,
                  ]}
                >
                  {t(day.label)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndContinue}>
            <Text style={styles.saveButtonText}>{t("profileSetup.saveAndContinue")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>{t("profileSetup.skipForNow")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSetupScreen;
