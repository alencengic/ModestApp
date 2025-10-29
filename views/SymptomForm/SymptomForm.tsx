import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useCreateSymptom } from "../../hooks/symptoms";
import { symptomFormStyles } from "./SymptomForm.styles";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface SymptomFormData {
  bloating: "None" | "Mild" | "Moderate" | "Severe";
  energy: 1 | 2 | 3 | 4 | 5;
  stool: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  diarrhea: boolean;
  nausea: boolean;
  pain: boolean;
  mealTag?: MealType;
}

export default function SymptomForm({
  mealId,
  defaultMealType,
  onSaved,
  autoSave = true,
  onChange,
}: {
  mealId?: string;
  defaultMealType?: MealType;
  onSaved?: () => void;
  autoSave?: boolean;
  onChange?: (data: SymptomFormData) => void;
}) {
  const create = useCreateSymptom();
  const [bloating, setBloating] = useState<
    "None" | "Mild" | "Moderate" | "Severe"
  >("None");
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [stool, setStool] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(4);
  const [diarrhea, setDiarrhea] = useState(false);
  const [nausea, setNausea] = useState(false);
  const [pain, setPain] = useState(false);
  const [mealTag, setMealTag] = useState<MealType | undefined>(defaultMealType);

  React.useEffect(() => {
    if (onChange) {
      onChange({
        bloating,
        energy,
        stool,
        diarrhea,
        nausea,
        pain,
        mealTag,
      });
    }
  }, [bloating, energy, stool, diarrhea, nausea, pain, mealTag, onChange]);

  const bloatingOptions: Array<"None" | "Mild" | "Moderate" | "Severe"> = [
    "None",
    "Mild",
    "Moderate",
    "Severe",
  ];

  const mealTagOptions: Array<{ value: MealType; label: string }> = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snack", label: "Snack" },
  ];

  return (
    <View style={symptomFormStyles.container}>
      <Text style={symptomFormStyles.sectionTitle}>
        How do you feel after your meal?
      </Text>

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

      <View style={symptomFormStyles.section}>
        <Text style={symptomFormStyles.label}>Energy Level (1-5)</Text>
        <View style={symptomFormStyles.buttonRow}>
          {[1, 2, 3, 4, 5].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                symptomFormStyles.button,
                energy === level && symptomFormStyles.selectedButton,
              ]}
              onPress={() => setEnergy(level as any)}
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

      <View style={symptomFormStyles.section}>
        <Text style={symptomFormStyles.label}>Bristol Stool Scale (1-7)</Text>
        <View style={symptomFormStyles.buttonRow}>
          {[1, 2, 3, 4, 5, 6, 7].map((scale) => (
            <TouchableOpacity
              key={scale}
              style={[
                symptomFormStyles.button,
                symptomFormStyles.buttonSmall,
                stool === scale && symptomFormStyles.selectedButton,
              ]}
              onPress={() => setStool(scale as any)}
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

      {/* Meal Tag */}
      <View style={symptomFormStyles.section}>
        <Text style={symptomFormStyles.label}>Meal Type (Optional)</Text>
        <View style={symptomFormStyles.buttonRow}>
          {mealTagOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                symptomFormStyles.button,
                symptomFormStyles.mealTagButton,
                mealTag === option.value && symptomFormStyles.selectedButton,
              ]}
              onPress={() => setMealTag(option.value)}
            >
              <Text
                style={[
                  symptomFormStyles.buttonText,
                  mealTag === option.value &&
                    symptomFormStyles.selectedButtonText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
