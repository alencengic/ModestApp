import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { symptomFormStyles } from "../SymptomForm/SymptomForm.styles";

export interface MealSymptomData {
  bloating: "None" | "Mild" | "Moderate" | "Severe";
  energy: 1 | 2 | 3 | 4 | 5;
  stool: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  diarrhea: boolean;
  nausea: boolean;
  pain: boolean;
}

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
  const [bloating, setBloating] = useState<"None" | "Mild" | "Moderate" | "Severe">(
    symptomData?.bloating || "None"
  );
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(symptomData?.energy || 3);
  const [stool, setStool] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(symptomData?.stool || 4);
  const [diarrhea, setDiarrhea] = useState(symptomData?.diarrhea || false);
  const [nausea, setNausea] = useState(symptomData?.nausea || false);
  const [pain, setPain] = useState(symptomData?.pain || false);

  // Track if this is the first render to avoid calling onChange on mount
  const isFirstRender = useRef(true);

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

  return (
    <View style={symptomFormStyles.container}>
      <Text style={symptomFormStyles.sectionTitle}>
        How do you feel after {mealName.toLowerCase()}?
      </Text>

      {mealItems.length > 0 && (
        <View style={symptomFormStyles.mealSummary}>
          <Text style={symptomFormStyles.mealLabel}>{mealName}:</Text>
          <Text style={symptomFormStyles.mealItems}>{mealItems.join(", ")}</Text>
        </View>
      )}

      {/* Bloating */}
      <View style={symptomFormStyles.section}>
        <Text style={symptomFormStyles.label}>Bloating</Text>
        <View style={symptomFormStyles.buttonRow}>
          {bloatingOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                symptomFormStyles.button,
                symptomFormStyles.bloatingButton,
                bloating === option && symptomFormStyles.selectedButton,
              ]}
              onPress={() => setBloating(option)}
            >
              <Text
                style={[
                  symptomFormStyles.buttonText,
                  bloating === option && symptomFormStyles.selectedButtonText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Energy */}
      <View style={symptomFormStyles.section}>
        <Text style={symptomFormStyles.label}>Energy Level</Text>
        <View style={symptomFormStyles.buttonRow}>
          {[1, 2, 3, 4, 5].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                symptomFormStyles.button,
                energy === level && symptomFormStyles.selectedButton,
              ]}
              onPress={() => setEnergy(level as 1 | 2 | 3 | 4 | 5)}
            >
              <Text
                style={[
                  symptomFormStyles.buttonText,
                  energy === level && symptomFormStyles.selectedButtonText,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stool */}
      <View style={symptomFormStyles.section}>
        <Text style={symptomFormStyles.label}>Bristol Stool Scale</Text>
        <View style={symptomFormStyles.buttonRow}>
          {[1, 2, 3, 4, 5, 6, 7].map((scale) => (
            <TouchableOpacity
              key={scale}
              style={[
                symptomFormStyles.button,
                symptomFormStyles.buttonSmall,
                stool === scale && symptomFormStyles.selectedButton,
              ]}
              onPress={() => setStool(scale as 1 | 2 | 3 | 4 | 5 | 6 | 7)}
            >
              <Text
                style={[
                  symptomFormStyles.buttonText,
                  stool === scale && symptomFormStyles.selectedButtonText,
                ]}
              >
                {scale}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Boolean Symptoms */}
      <View style={symptomFormStyles.toggleSection}>
        <Text style={symptomFormStyles.label}>Additional Symptoms</Text>
        {[
          { label: "Diarrhea", value: diarrhea, setter: setDiarrhea },
          { label: "Nausea", value: nausea, setter: setNausea },
          { label: "Pain", value: pain, setter: setPain },
        ].map(({ label, value, setter }) => (
          <View key={label} style={symptomFormStyles.toggleRow}>
            <Text style={symptomFormStyles.toggleLabel}>{label}</Text>
            <TouchableOpacity
              style={[
                symptomFormStyles.toggleButton,
                value && symptomFormStyles.toggleButtonActive,
              ]}
              onPress={() => setter(!value)}
            >
              <Text
                style={[
                  symptomFormStyles.toggleButtonText,
                  value && symptomFormStyles.toggleButtonTextActive,
                ]}
              >
                {value ? "Yes" : "No"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};
