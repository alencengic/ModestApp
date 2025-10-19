import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BrightTheme } from "@/constants/Theme";

export interface StepConfig {
  title: string;
  component: React.ReactNode;
}

interface StepperProps {
  steps: StepConfig[];
  onComplete: () => void | Promise<void>;
  onStepChange?: (stepIndex: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  onComplete,
  onStepChange,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      setIsCompleting(true);
      try {
        await onComplete();
        // Reset to first step after successful save
        setCurrentStep(0);
        onStepChange?.(0);
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

  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View key={index} style={styles.stepIndicatorWrapper}>
            <View
              style={[
                styles.stepIndicator,
                index <= currentStep && styles.stepIndicatorActive,
                index === currentStep && styles.stepIndicatorCurrent,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
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
                  index < currentStep && styles.stepConnectorActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      {/* Step Title */}
      <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>

      {/* Step Content */}
      <View style={styles.contentContainer}>{steps[currentStep].component}</View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.button, styles.backButton, isFirstStep && styles.buttonDisabled]}
          onPress={handleBack}
          disabled={isFirstStep}
        >
          <Text style={[styles.buttonText, isFirstStep && styles.buttonTextDisabled]}>
            Back
          </Text>
        </TouchableOpacity>

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
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: BrightTheme.spacing.xl,
    paddingTop: BrightTheme.spacing.sm,
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
  stepNumberActive: {
    color: BrightTheme.colors.textOnPrimary,
  },
  stepConnector: {
    width: 40,
    height: 3,
    backgroundColor: BrightTheme.colors.border,
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
    gap: BrightTheme.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: BrightTheme.spacing.sm,
    paddingHorizontal: BrightTheme.spacing.md,
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
});
