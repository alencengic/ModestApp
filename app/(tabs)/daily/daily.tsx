import React, { useState } from "react";
import { SafeAreaView, Alert, ScrollView } from "react-native";
import { DateTime } from "luxon";

import { dailyEnterScreenStyles } from "./DailyEnterScreen.styles";
import { Stepper, StepConfig } from "@/components/ui/Stepper";
import { RatingComponent } from "@/components/RatingComponent";
import FoodIntakeForm from "@/views/FoodIntakeForm";
import SymptomForm, { SymptomFormData } from "@/views/SymptomForm/SymptomForm";
import { insertOrUpdateMood } from "@/storage/database";
import { insertOrUpdateProductivity } from "@/storage/productivity_entries";
import { useMutationInsertFoodIntake } from "@/hooks/queries/useMutationInsertFoodIntake";
import { useCreateSymptom } from "@/hooks/symptoms";

import { moodRatingStyles } from "@/views/MoodRating/MoodRating.styles";
import { productivityRatingStyles } from "@/views/ProductivityRating/ProductivityRating.styles";

const moodOptions = [
  { value: "Sad", display: "😢", label: "Sad" },
  { value: "Neutral", display: "😔", label: "Neutral" },
  { value: "Happy", display: "🙂", label: "Happy" },
  { value: "Very Happy", display: "😄", label: "Very Happy" },
  { value: "Ecstatic", display: "😁", label: "Ecstatic" },
];

const productivityOptions = [1, 2, 3, 4, 5].map((rating) => ({
  value: rating,
  display: String(rating),
  label: String(rating),
}));

type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export default function DailyEnterScreen() {
  const [moodValue, setMoodValue] = useState<string | null>(null);
  const [productivityValue, setProductivityValue] = useState<number | null>(null);
  const [foodMeals, setFoodMeals] = useState<Record<MealType, string>>({
    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: "",
  });
  const [symptomData, setSymptomData] = useState<SymptomFormData | null>(null);

  const { mutateAsync: saveFoodIntake } = useMutationInsertFoodIntake();
  const createSymptom = useCreateSymptom();

  const handleCompleteAll = async () => {
    try {
      const currentDate = DateTime.now().toISODate() as string;

      // Save mood
      if (moodValue) {
        await insertOrUpdateMood(moodValue, currentDate);
      }

      // Save productivity
      if (productivityValue) {
        await insertOrUpdateProductivity(productivityValue, DateTime.now().toISO());
      }

      // Save food intake
      if (Object.values(foodMeals).some(meal => meal.trim() !== "")) {
        const dataToSave = { ...foodMeals, date: DateTime.now().toFormat("yyyy-LL-dd") };
        await saveFoodIntake(dataToSave);
      }

      // Save symptoms
      if (symptomData) {
        await createSymptom.mutateAsync({
          meal_id: null,
          meal_type_tag: symptomData.mealTag ?? null,
          bloating: symptomData.bloating,
          energy: symptomData.energy,
          stool_consistency: symptomData.stool,
          diarrhea: symptomData.diarrhea ? 1 : 0,
          nausea: symptomData.nausea ? 1 : 0,
          pain: symptomData.pain ? 1 : 0,
        });
      }

      Alert.alert("Success", "All daily entries have been saved!");

      // Reset all forms
      setMoodValue(null);
      setProductivityValue(null);
      setFoodMeals({ breakfast: "", lunch: "", dinner: "", snacks: "" });
      setSymptomData(null);
    } catch (error) {
      console.error("Failed to save daily entries:", error);
      Alert.alert("Error", "Failed to save daily entries. Please try again.");
      throw error;
    }
  };

  const steps: StepConfig[] = [
    {
      title: "How are you feeling?",
      component: (
        <ScrollView showsVerticalScrollIndicator={false}>
          <RatingComponent
            title="How are you feeling today?"
            options={moodOptions}
            onChange={(value) => setMoodValue(value as string)}
            autoSave={false}
            defaultValue={moodValue ?? undefined}
            containerStyle={moodRatingStyles.moodContainer}
            titleStyle={moodRatingStyles.moodTitle}
            buttonContainerStyle={moodRatingStyles.moodButtons}
            buttonStyle={moodRatingStyles.moodButton}
            selectedButtonStyle={moodRatingStyles.selectedMood}
            displayTextStyle={moodRatingStyles.emoji}
            selectedTextStyle={moodRatingStyles.selectedText}
          />
        </ScrollView>
      ),
    },
    {
      title: "Productivity Level",
      component: (
        <ScrollView showsVerticalScrollIndicator={false}>
          <RatingComponent
            title="How productive were you today?"
            options={productivityOptions}
            onChange={(value) => setProductivityValue(value as number)}
            autoSave={false}
            defaultValue={productivityValue ?? undefined}
            containerStyle={productivityRatingStyles.productivityContainer}
            titleStyle={productivityRatingStyles.productivityTitle}
            buttonContainerStyle={productivityRatingStyles.productivityButtons}
            buttonStyle={productivityRatingStyles.productivityButton}
            selectedButtonStyle={productivityRatingStyles.selectedProductivity}
            displayTextStyle={productivityRatingStyles.productivityText}
            selectedTextStyle={productivityRatingStyles.selectedProductivityText}
          />
        </ScrollView>
      ),
    },
    {
      title: "Food Intake",
      component: (
        <ScrollView showsVerticalScrollIndicator={false}>
          <FoodIntakeForm
            autoSave={false}
            onChange={setFoodMeals}
          />
        </ScrollView>
      ),
    },
    {
      title: "Symptoms",
      component: (
        <ScrollView showsVerticalScrollIndicator={false}>
          <SymptomForm
            autoSave={false}
            onChange={setSymptomData}
          />
        </ScrollView>
      ),
    },
  ];

  return (
    <SafeAreaView style={dailyEnterScreenStyles.safeArea}>
      <Stepper steps={steps} onComplete={handleCompleteAll} />
    </SafeAreaView>
  );
}
