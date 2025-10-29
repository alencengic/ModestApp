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
import { useTheme } from "@/context/ThemeContext";
import { useUserProfile } from "@/context/UserProfileContext";
import type { DayOfWeek, WeightUnit } from "@/storage/userProfile";

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

const ProfileSetupScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
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
        Alert.alert("Name Required", "Please enter your name");
        return;
      }

      // Validate age (optional, but must be valid if provided)
      const ageNum = age.trim() ? parseInt(age) : null;
      if (ageNum !== null && (isNaN(ageNum) || ageNum < 1 || ageNum > 150)) {
        Alert.alert("Invalid Age", "Please enter a valid age (1-150)");
        return;
      }

      // Validate weight (optional, but must be valid if provided)
      const weightNum = weight.trim() ? parseFloat(weight) : null;
      if (weightNum !== null && (isNaN(weightNum) || weightNum <= 0 || weightNum > 500)) {
        Alert.alert("Invalid Weight", "Please enter a valid weight");
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
      Alert.alert("Error", "Failed to save profile. Please try again.");
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
          <Text style={styles.title}>Personalize Your Experience</Text>
          <Text style={styles.subtitle}>
            Help us tailor insights to your lifestyle. You can change these anytime in Settings.
          </Text>
        </View>

        {/* Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Name *</Text>
          <Text style={styles.sectionDescription}>
            We'll use this to personalize your experience.
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="words"
          />
        </View>

        {/* Age Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age (Optional)</Text>
          <Text style={styles.sectionDescription}>
            Helps provide age-appropriate health insights.
          </Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Enter your age"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="number-pad"
          />
        </View>

        {/* Weight Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Weight (Optional)</Text>
          <Text style={styles.sectionDescription}>
            Your weight helps us provide more accurate health insights and calculations.
          </Text>
          <View style={styles.weightContainer}>
            <View style={styles.weightInputContainer}>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter weight"
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
                kg
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
                lbs
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Working Days Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Working Days</Text>
          <Text style={styles.sectionDescription}>
            Select the days you typically work. This helps identify patterns between work and wellbeing.
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
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {weekendDays.length > 0 && (
            <View style={styles.weekendInfo}>
              <Text style={styles.weekendInfoText}>
                Weekend: {weekendDays.map((d) => d.label).join(", ")}
              </Text>
            </View>
          )}
        </View>

        {/* Sport/Training Days Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sport/Training Days</Text>
          <Text style={styles.sectionDescription}>
            Select days when you exercise or train. We'll factor this into your wellness analysis.
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
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndContinue}>
            <Text style={styles.saveButtonText}>Save & Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSetupScreen;
