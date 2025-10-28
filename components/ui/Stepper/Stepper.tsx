import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { scaleFontSize, scale } from "@/utils/responsive";

export interface StepConfig {
  title: string;
  component: React.ReactNode;
}

interface StepperProps {
  steps: StepConfig[];
  onComplete: () => void | Promise<void>;
  onStepChange?: (stepIndex: number) => void;
  allowSkipAfterStep?: number; // Allow skipping after this step index (0-based)
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  onComplete,
  onStepChange,
  allowSkipAfterStep = -1, // Default: no skipping allowed
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const canSkip = allowSkipAfterStep >= 0 && currentStep > allowSkipAfterStep;

  const handleNext = async () => {
    if (isLastStep) {
      setIsCompleting(true);
      try {
        await onComplete();

        setCurrentStep(0);
        onStepChange?.(0);

        // Navigate to home screen after completion
        router.push("/(tabs)");
      } catch (error) {
        console.error("Error completing stepper:", error);
      } finally {
        setIsCompleting(false);
      }
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  const handleSkip = async () => {
    // Skip to the last step to complete
    setIsCompleting(true);
    try {
      await onComplete();
      setCurrentStep(0);
      onStepChange?.(0);

      // Navigate to home screen after completion
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error completing stepper:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    progressScroll: {
      maxHeight: scale(60),
      marginBottom: theme.spacing.sm,
    },
    progressScrollContent: {
      paddingHorizontal: theme.spacing.md,
      alignItems: "center",
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: theme.spacing.sm,
    },
    stepCounter: {
      fontSize: scaleFontSize(14),
      fontWeight: "600",
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
    stepIndicatorWrapper: {
      flexDirection: "row",
      alignItems: "center",
    },
    stepIndicator: {
      width: scale(44),
      height: scale(44),
      borderRadius: scale(22),
      backgroundColor: theme.colors.surfaceLight,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: scale(3),
      borderColor: theme.colors.border,
    },
    stepIndicatorSmall: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(16),
      borderWidth: scale(2),
    },
    stepIndicatorActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    stepIndicatorCurrent: {
      borderWidth: scale(4),
      borderColor: theme.colors.primaryDark,
      ...theme.shadows.md,
    },
    stepNumber: {
      fontSize: scaleFontSize(18),
      fontWeight: "bold",
      color: theme.colors.textLight,
    },
    stepNumberSmall: {
      fontSize: scaleFontSize(14),
    },
    stepNumberActive: {
      color: theme.colors.textOnPrimary,
    },
    stepConnector: {
      width: scale(40),
      height: scale(3),
      backgroundColor: theme.colors.border,
    },
    stepConnectorSmall: {
      width: scale(30),
      height: scale(2),
    },
    stepConnectorActive: {
      backgroundColor: theme.colors.primary,
    },
    stepTitle: {
      fontSize: scaleFontSize(24),
      fontWeight: "600",
      textAlign: "center",
      marginBottom: theme.spacing.lg,
      color: theme.colors.textPrimary,
      letterSpacing: -0.3,
    },
    contentContainer: {
      flex: 1,
      marginBottom: theme.spacing.lg,
    },
    navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },
    button: {
      flex: 1,
      paddingVertical: scale(10),
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.round,
      alignItems: "center",
    },
    backButton: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    nextButton: {
      backgroundColor: theme.colors.primary,
    },
    skipButton: {
      backgroundColor: theme.colors.secondary || "#FFA500",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonDisabled: {
      opacity: 0.4,
    },
    buttonText: {
      fontSize: scaleFontSize(13),
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    buttonTextDisabled: {
      color: theme.colors.textLight,
    },
    nextButtonText: {
      fontSize: scaleFontSize(13),
      fontWeight: "600",
      color: theme.colors.textOnPrimary,
    },
    skipButtonText: {
      fontSize: scaleFontSize(13),
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
  });

  return (
    <View style={styles.container}>
      {/* Progress Indicator - Scrollable for many steps */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.progressScrollContent}
        style={styles.progressScroll}
      >
        <View style={styles.progressContainer}>
          {steps.map((_, index) => {
            // Make icons smaller for steps 4 and later (index >= 3)
            const isSmallStep = index >= 3;
            return (
              <View key={index} style={styles.stepIndicatorWrapper}>
                <View
                  style={[
                    styles.stepIndicator,
                    isSmallStep && styles.stepIndicatorSmall,
                    index <= currentStep && styles.stepIndicatorActive,
                    index === currentStep && styles.stepIndicatorCurrent,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumber,
                      isSmallStep && styles.stepNumberSmall,
                      index <= currentStep && styles.stepNumberActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.stepConnector,
                      isSmallStep && styles.stepConnectorSmall,
                      index < currentStep && styles.stepConnectorActive,
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Step Counter Text */}
      <Text style={styles.stepCounter}>
        Step {currentStep + 1} of {steps.length}
      </Text>

      {/* Step Title */}
      <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>

      {/* Step Content */}
      <View style={styles.contentContainer}>
        {steps[currentStep].component}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.backButton,
            isFirstStep && styles.buttonDisabled,
          ]}
          onPress={handleBack}
          disabled={isFirstStep}
        >
          <Text
            style={[
              styles.buttonText,
              isFirstStep && styles.buttonTextDisabled,
            ]}
          >
            Back
          </Text>
        </TouchableOpacity>

        {canSkip && !isLastStep && (
          <TouchableOpacity
            style={[styles.button, styles.skipButton]}
            onPress={handleSkip}
            disabled={isCompleting}
          >
            <Text style={styles.skipButtonText}>
              {isCompleting ? "Saving..." : "Skip & Save"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={handleNext}
          disabled={isCompleting}
        >
          <Text style={styles.nextButtonText}>
            {isLastStep ? (isCompleting ? "Saving..." : "Save All") : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
