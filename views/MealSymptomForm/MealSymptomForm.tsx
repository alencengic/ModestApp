import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Pressable } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export interface MealSymptomData {
  bloating: "None" | "Mild" | "Moderate" | "Severe";
  energy: 1 | 2 | 3 | 4 | 5;
  stool: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  diarrhea: boolean;
  nausea: boolean;
  pain: boolean;
}

const ENERGY_LABELS = {
  1: "Very Low",
  2: "Low",
  3: "Normal",
  4: "Good",
  5: "Energized"
};

const BRISTOL_SCALE_INFO = {
  1: { label: "Type 1", desc: "Separate hard lumps" },
  2: { label: "Type 2", desc: "Lumpy and sausage-like" },
  3: { label: "Type 3", desc: "Sausage with cracks" },
  4: { label: "Type 4", desc: "Smooth and soft (Normal)" },
  5: { label: "Type 5", desc: "Soft blobs" },
  6: { label: "Type 6", desc: "Mushy consistency" },
  7: { label: "Type 7", desc: "Liquid consistency" }
};

interface MealSymptomFormProps {
  mealName: string;
  mealItems: string[];
  symptomData: MealSymptomData | null;
  onChange: (data: MealSymptomData) => void;
}

export const MealSymptomForm: React.FC<MealSymptomFormProps> = ({
  mealName,
  mealItems,
  symptomData,
  onChange,
}) => {
  const { theme } = useTheme();
  const [everythingNormal, setEverythingNormal] = useState(true);
  const [bloating, setBloating] = useState<"None" | "Mild" | "Moderate" | "Severe">(
    symptomData?.bloating || "None"
  );
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(symptomData?.energy || 3);
  const [stool, setStool] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(symptomData?.stool || 4);
  const [diarrhea, setDiarrhea] = useState(symptomData?.diarrhea || false);
  const [nausea, setNausea] = useState(symptomData?.nausea || false);
  const [pain, setPain] = useState(symptomData?.pain || false);
  const [showBristolInfo, setShowBristolInfo] = useState(false);

  // Track if this is the first render to avoid calling onChange on mount
  const isFirstRender = useRef(true);

  const handleToggleNormal = () => {
    const newValue = !everythingNormal;
    setEverythingNormal(newValue);

    if (newValue) {
      // Set to normal values
      setBloating("None");
      setEnergy(3);
      setStool(4);
      setDiarrhea(false);
      setNausea(false);
      setPain(false);
    }
  };

  // Notify parent of changes (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onChange({
      bloating,
      energy,
      stool,
      diarrhea,
      nausea,
      pain,
    });
  }, [bloating, energy, stool, diarrhea, nausea, pain]);

  const bloatingOptions: Array<"None" | "Mild" | "Moderate" | "Severe"> = [
    "None",
    "Mild",
    "Moderate",
    "Severe",
  ];

  const getBloatingColor = (option: string) => {
    switch (option) {
      case "None": return "#4CAF50";
      case "Mild": return "#FFC107";
      case "Moderate": return "#FF9800";
      case "Severe": return "#F44336";
      default: return theme.colors.border;
    }
  };

  const getEnergyColor = (level: number) => {
    const colors = ["#F44336", "#FF9800", "#FFC107", "#8BC34A", "#4CAF50"];
    return colors[level - 1];
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
    },
    header: {
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 22,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
    normalToggle: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    normalToggleActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    normalToggleContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    normalToggleLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      flex: 1,
    },
    normalToggleIcon: {
      fontSize: 28,
    },
    normalToggleTextContainer: {
      flex: 1,
    },
    normalToggleTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: 2,
    },
    normalToggleTitleActive: {
      color: theme.colors.textOnPrimary,
    },
    normalToggleSubtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    normalToggleSubtitleActive: {
      color: theme.colors.textOnPrimary,
      opacity: 0.9,
    },
    normalToggleCheckbox: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    normalToggleCheckboxActive: {
      backgroundColor: theme.colors.textOnPrimary,
      borderColor: theme.colors.textOnPrimary,
    },
    normalToggleCheckmark: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.md,
    },
    dividerText: {
      textAlign: "center",
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontWeight: "600",
      marginVertical: theme.spacing.sm,
    },
    mealSummary: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    mealLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    mealItems: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    infoButton: {
      padding: theme.spacing.xs,
    },
    infoButtonText: {
      fontSize: 18,
      color: theme.colors.primary,
    },
    subtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    buttonRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    buttonWrapper: {
      alignItems: "center",
      flex: 1,
      maxWidth: "18%",
    },
    button: {
      width: 44,
      height: 44,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonSmall: {
      width: 38,
      height: 38,
    },
    selectedButton: {
      borderWidth: 3,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    buttonLabel: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      textAlign: "center",
    },
    selectedButtonText: {
      fontWeight: "700",
    },
    toggleSection: {
      marginTop: theme.spacing.lg,
    },
    toggleGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      justifyContent: "flex-start",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      width: "100%",
      maxHeight: "80%",
      maxWidth: 500,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    modalCloseButton: {
      padding: theme.spacing.xs,
    },
    modalCloseText: {
      fontSize: 24,
      color: theme.colors.textSecondary,
    },
    modalContent: {
      padding: theme.spacing.lg,
    },
    bristolItem: {
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    bristolItemLast: {
      borderBottomWidth: 0,
    },
    bristolLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    bristolDesc: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          How do you feel after {mealName.toLowerCase()}?
        </Text>

        {mealItems.length > 0 && (
          <View style={styles.mealSummary}>
            <Text style={styles.mealLabel}>{mealName}:</Text>
            <Text style={styles.mealItems}>{mealItems.join(", ")}</Text>
          </View>
        )}

        {/* Everything Normal Toggle */}
        <TouchableOpacity
          style={[
            styles.normalToggle,
            everythingNormal && styles.normalToggleActive,
          ]}
          onPress={handleToggleNormal}
        >
          <View style={styles.normalToggleContent}>
            <View style={styles.normalToggleLeft}>
              <Text style={styles.normalToggleIcon}>✓</Text>
              <View style={styles.normalToggleTextContainer}>
                <Text
                  style={[
                    styles.normalToggleTitle,
                    everythingNormal && styles.normalToggleTitleActive,
                  ]}
                >
                  Everything was normal
                </Text>
                <Text
                  style={[
                    styles.normalToggleSubtitle,
                    everythingNormal && styles.normalToggleSubtitleActive,
                  ]}
                >
                  No symptoms or issues
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.normalToggleCheckbox,
                everythingNormal && styles.normalToggleCheckboxActive,
              ]}
            >
              {everythingNormal && (
                <Text style={styles.normalToggleCheckmark}>✓</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {!everythingNormal && (
          <Text style={styles.dividerText}>OR PROVIDE DETAILS BELOW</Text>
        )}
      </View>

      {/* Show detailed form only when not normal */}
      {!everythingNormal && (
        <>
          {/* General Wellbeing */}
          <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.label}>General Wellbeing</Text>
        </View>

        {/* Energy Level */}
        <Text style={styles.subtitle}>Energy Level</Text>
        <View style={styles.buttonRow}>
          {[1, 2, 3, 4, 5].map((level) => (
            <View key={level} style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[
                  styles.button,
                  energy === level && styles.selectedButton,
                  energy === level && { borderColor: getEnergyColor(level) },
                ]}
                onPress={() => setEnergy(level as 1 | 2 | 3 | 4 | 5)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    energy === level && styles.selectedButtonText,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
              <Text style={styles.buttonLabel}>
                {ENERGY_LABELS[level as keyof typeof ENERGY_LABELS]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Digestive Symptoms */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.label}>Digestive Symptoms</Text>
        </View>

        {/* Bloating */}
        <Text style={styles.subtitle}>Bloating</Text>
        <View style={styles.buttonRow}>
          {bloatingOptions.map((option, index) => (
            <View key={option} style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[
                  styles.button,
                  bloating === option && styles.selectedButton,
                  bloating === option && { borderColor: getBloatingColor(option) },
                ]}
                onPress={() => setBloating(option)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    bloating === option && styles.selectedButtonText,
                  ]}
                >
                  {index + 1}
                </Text>
              </TouchableOpacity>
              <Text style={styles.buttonLabel}>{option}</Text>
            </View>
          ))}
        </View>

        {/* Bristol Stool Scale */}
        <View style={styles.toggleSection}>
          <View style={styles.cardHeader}>
            <Text style={styles.subtitle}>Bristol Stool Scale</Text>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => setShowBristolInfo(true)}
            >
              <Text style={styles.infoButtonText}>ⓘ</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            {[1, 2, 3, 4, 5, 6, 7].map((scale) => (
              <TouchableOpacity
                key={scale}
                style={[
                  styles.button,
                  styles.buttonSmall,
                  stool === scale && styles.selectedButton,
                  stool === scale && { borderColor: theme.colors.primary },
                ]}
                onPress={() => setStool(scale as 1 | 2 | 3 | 4 | 5 | 6 | 7)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    stool === scale && styles.selectedButtonText,
                  ]}
                >
                  {scale}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {stool && (
            <Text style={[styles.subtitle, { marginTop: theme.spacing.sm }]}>
              {BRISTOL_SCALE_INFO[stool].desc}
            </Text>
          )}
        </View>

        {/* Additional Symptoms */}
        <View style={styles.toggleSection}>
          <Text style={styles.subtitle}>Additional Symptoms</Text>
          <View style={styles.toggleGrid}>
            {[
              { label: "Diarrhea", value: diarrhea, setter: setDiarrhea },
              { label: "Nausea", value: nausea, setter: setNausea },
              { label: "Pain", value: pain, setter: setPain },
            ].map(({ label, value, setter }) => (
              <View key={label} style={styles.buttonWrapper}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    value && styles.selectedButton,
                    value && { borderColor: theme.colors.primary },
                  ]}
                  onPress={() => setter(!value)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      value && styles.selectedButtonText,
                    ]}
                  >
                    {value ? "✓" : "✕"}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.buttonLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
        </>
      )}

      {/* Bristol Scale Info Modal */}
      <Modal
        visible={showBristolInfo}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowBristolInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bristol Stool Scale</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowBristolInfo(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {Object.entries(BRISTOL_SCALE_INFO).map(([key, value], index) => (
                <View
                  key={key}
                  style={[
                    styles.bristolItem,
                    index === 6 && styles.bristolItemLast
                  ]}
                >
                  <Text style={styles.bristolLabel}>{value.label}</Text>
                  <Text style={styles.bristolDesc}>{value.desc}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
