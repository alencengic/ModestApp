import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

export default function UserProfileSettings() {
  const { theme } = useTheme();
  const { profile, updateProfile, loading } = useUserProfile();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [workingDays, setWorkingDays] = useState<DayOfWeek[]>([]);
  const [sportDays, setSportDays] = useState<DayOfWeek[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setAge(profile.age?.toString() || "");
      setWeight(profile.weight?.toString() || "");
      setWeightUnit(profile.weight_unit);

      try {
        const working = profile.working_days ? JSON.parse(profile.working_days) : [];
        const sport = profile.sport_days ? JSON.parse(profile.sport_days) : [];
        setWorkingDays(working);
        setSportDays(sport);
      } catch (e) {
        console.error("Error parsing days:", e);
      }
    }
  }, [profile]);

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

  const handleSave = async () => {
    try {
      // Validate name (mandatory)
      if (!name.trim()) {
        Alert.alert("Name Required", "Please enter your name");
        return;
      }

      // Validate age (optional)
      const ageNum = age.trim() ? parseInt(age) : null;
      if (ageNum !== null && (isNaN(ageNum) || ageNum < 1 || ageNum > 150)) {
        Alert.alert("Invalid Age", "Please enter a valid age (1-150)");
        return;
      }

      // Validate weight (optional)
      const weightNum = weight.trim() ? parseFloat(weight) : null;
      if (weightNum !== null && (isNaN(weightNum) || weightNum <= 0 || weightNum > 500)) {
        Alert.alert("Invalid Weight", "Please enter a valid weight");
        return;
      }

      setIsSaving(true);

      await updateProfile({
        name: name.trim(),
        age: ageNum,
        weight: weightNum,
        weight_unit: weightUnit,
        working_days: workingDays,
        sport_days: sportDays,
      });

      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.textPrimary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
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
    weightContainer: {
      flexDirection: "row",
      gap: 12,
    },
    weightInputContainer: {
      flex: 1,
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
    saveButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: theme.borderRadius.round,
      alignItems: "center",
      marginTop: 20,
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      color: theme.colors.textOnPrimary,
      fontSize: 16,
      fontWeight: "700",
    },
  });

  const weekendDays = DAYS_OF_WEEK.filter((day) => !workingDays.includes(day.value));

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: theme.colors.textSecondary }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>User Profile</Text>
          <Text style={styles.subtitle}>
            Manage your personal information and preferences
          </Text>
        </View>

        {/* Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Name *</Text>
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
          <Text style={styles.sectionTitle}>Age</Text>
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
          <Text style={styles.sectionTitle}>Weight</Text>
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
            Select your typical working days
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
            Select days when you exercise or train
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

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
