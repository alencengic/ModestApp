import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { BrightTheme } from "@/constants/Theme";

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BrightTheme.spacing.lg,
    backgroundColor: BrightTheme.colors.background,
  },
  progressScroll: {
    maxHeight: 60,
    marginBottom: BrightTheme.spacing.sm,
  },
  progressScrollContent: {
    paddingHorizontal: BrightTheme.spacing.md,
    alignItems: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: BrightTheme.spacing.sm,
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: "600",
    color: BrightTheme.colors.textSecondary,
    textAlign: "center",
    marginBottom: BrightTheme.spacing.md,
  },
  stepIndicatorWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BrightTheme.colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: BrightTheme.colors.border,
  },
  stepIndicatorSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
  },
  stepIndicatorActive: {
    backgroundColor: BrightTheme.colors.primary,
    borderColor: BrightTheme.colors.primary,
  },
  stepIndicatorCurrent: {
    borderWidth: 4,
    borderColor: BrightTheme.colors.primaryDark,
    ...BrightTheme.shadows.md,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: BrightTheme.colors.textLight,
  },
  stepNumberSmall: {
    fontSize: 14,
  },
  stepNumberActive: {
    color: BrightTheme.colors.textOnPrimary,
  },
  stepConnector: {
    width: 40,
    height: 3,
    backgroundColor: BrightTheme.colors.border,
  },
  stepConnectorSmall: {
    width: 30,
    height: 2,
  },
  stepConnectorActive: {
    backgroundColor: BrightTheme.colors.primary,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: BrightTheme.spacing.lg,
    color: BrightTheme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  contentContainer: {
    flex: 1,
    marginBottom: BrightTheme.spacing.lg,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: BrightTheme.spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: BrightTheme.spacing.md,
    paddingHorizontal: BrightTheme.spacing.sm,
    borderRadius: BrightTheme.borderRadius.round,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: BrightTheme.colors.background,
    borderWidth: 1,
    borderColor: BrightTheme.colors.border,
  },
  nextButton: {
    backgroundColor: BrightTheme.colors.primary,
  },
  skipButton: {
    backgroundColor: BrightTheme.colors.secondary || "#FFA500",
    borderWidth: 1,
    borderColor: BrightTheme.colors.border,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
  },
  buttonTextDisabled: {
    color: BrightTheme.colors.textLight,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: BrightTheme.colors.textOnPrimary,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
  },
});
