import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

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
    padding: 20,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  stepIndicatorWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  stepIndicatorActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  stepIndicatorCurrent: {
    borderWidth: 3,
    borderColor: "#005BBB",
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  stepNumberActive: {
    color: "#fff",
  },
  stepConnector: {
    width: 40,
    height: 2,
    backgroundColor: "#ccc",
  },
  stepConnectorActive: {
    backgroundColor: "#007AFF",
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  contentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  nextButton: {
    backgroundColor: "#007AFF",
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  buttonTextDisabled: {
    color: "#999",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
