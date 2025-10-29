import React, { useState, useMemo } from "react";
import { SafeAreaView, Alert, ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import { DateTime } from "luxon";

import { createDailyEnterScreenStyles } from "./DailyEnterScreen.styles";
import { useTheme } from "@/context/ThemeContext";
import { Stepper, StepConfig } from "@/components/ui/Stepper";
import { RatingComponent } from "@/components/RatingComponent";
import FoodIntakeForm, { MealFeeling } from "@/views/FoodIntakeForm";
import { MealFeelingForm } from "@/views/MealFeelingForm";
import { MealSymptomForm, MealSymptomData } from "@/views/MealSymptomForm";
import { insertOrUpdateMood } from "@/storage/database";
import { insertOrUpdateProductivity } from "@/storage/productivity_entries";
import { useMutationInsertFoodIntake } from "@/hooks/queries/useMutationInsertFoodIntake";
import { useCreateSymptom } from "@/hooks/symptoms";
import { BannerAd } from "@/components/ads";

import { moodRatingStyles } from "@/views/MoodRating/MoodRating.styles";
import { productivityRatingStyles } from "@/views/ProductivityRating/ProductivityRating.styles";

const moodOptions = [
  { value: "Sad", display: "😞", label: "Sad" },
  { value: "Neutral", display: "😐", label: "Neutral" },
  { value: "Happy", display: "😊", label: "Happy" },
  { value: "Very Happy", display: "😄", label: "Very Happy" },
  { value: "Ecstatic", display: "🤩", label: "Ecstatic" },
];

const productivityOptions = [1, 2, 3, 4, 5].map((rating) => ({
  value: rating,
  display: String(rating),
  label: String(rating),
}));

type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

const MEAL_CONFIG = {
  breakfast: { label: "Breakfast", icon: "☀️" },
  lunch: { label: "Lunch", icon: "🌤️" },
  dinner: { label: "Dinner", icon: "🌙" },
  snacks: { label: "Snacks", icon: "🍎" },
};

export default function DailyEnterScreen() {
  const { theme } = useTheme();
  const styles = createDailyEnterScreenStyles(theme);
  const foodScrollViewRef = React.useRef<ScrollView>(null);
  const [moodValue, setMoodValue] = useState<string | null>(null);
  const [productivityValue, setProductivityValue] = useState<number | null>(
    null
  );
  const [foodMeals, setFoodMeals] = useState<Record<MealType, string>>({
    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: "",
  });
  const [mealFeelings, setMealFeelings] = useState<
    Record<MealType, MealFeeling["feeling"]>
  >({
    breakfast: null,
    lunch: null,
    dinner: null,
    snacks: null,
  });
  const [mealSymptoms, setMealSymptoms] = useState<
    Record<MealType, MealSymptomData | null>
  >({
    breakfast: null,
    lunch: null,
    dinner: null,
    snacks: null,
  });
  const [resetKey, setResetKey] = useState(0);

  const { mutateAsync: saveFoodIntake } = useMutationInsertFoodIntake();
  const createSymptom = useCreateSymptom();

  const handleCompleteAll = async () => {
    try {
      const currentDate = DateTime.now().toISODate() as string;

      if (moodValue) {
        await insertOrUpdateMood(moodValue, currentDate);
      }

      if (productivityValue) {
        await insertOrUpdateProductivity(
          productivityValue,
          DateTime.now().toISO()
        );
      }

      if (Object.values(foodMeals).some((meal) => meal.trim() !== "")) {
        const dataToSave = {
          ...foodMeals,
          date: DateTime.now().toFormat("yyyy-LL-dd"),
        };
        await saveFoodIntake(dataToSave);
      }

      const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snacks"];
      for (const mealType of mealTypes) {
        if (mealSymptoms[mealType]) {
          const symptom = mealSymptoms[mealType]!;
          await createSymptom.mutateAsync({
            meal_id: null,
            meal_type_tag: mealType === "snacks" ? "snack" : mealType,
            bloating: symptom.bloating,
            energy: symptom.energy,
            stool_consistency: symptom.stool,
            diarrhea: symptom.diarrhea ? 1 : 0,
            nausea: symptom.nausea ? 1 : 0,
            pain: symptom.pain ? 1 : 0,
          });
        }
      }

      Alert.alert("Success", "All daily entries have been saved!");

      setMoodValue(null);
      setProductivityValue(null);
      setFoodMeals({ breakfast: "", lunch: "", dinner: "", snacks: "" });
      setMealFeelings({
        breakfast: null,
        lunch: null,
        dinner: null,
        snacks: null,
      });
      setMealSymptoms({
        breakfast: null,
        lunch: null,
        dinner: null,
        snacks: null,
      });

      setResetKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to save daily entries:", error);
      Alert.alert("Error", "Failed to save daily entries. Please try again.");
      throw error;
    }
  };

  const mealSpecificSteps = useMemo(() => {
    const steps: StepConfig[] = [];
    const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snacks"];

    for (const mealType of mealTypes) {
      const mealItems = foodMeals[mealType]
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      if (mealItems.length > 0) {
        const config = MEAL_CONFIG[mealType];

        steps.push({
          title: `${config.icon} ${config.label} Feeling`,
          component: (
            <ScrollView
              key={`feeling-${mealType}-${resetKey}`}
              showsVerticalScrollIndicator={false}
            >
              <MealFeelingForm
                mealName={config.label}
                mealItems={mealItems}
                feeling={mealFeelings[mealType]}
                onChange={(feeling) =>
                  setMealFeelings((prev) => ({ ...prev, [mealType]: feeling }))
                }
              />
            </ScrollView>
          ),
        });

        steps.push({
          title: `${config.icon} ${config.label} Symptoms`,
          component: (
            <ScrollView
              key={`symptom-${mealType}-${resetKey}`}
              showsVerticalScrollIndicator={false}
            >
              <MealSymptomForm
                mealName={config.label}
                mealItems={mealItems}
                symptomData={mealSymptoms[mealType]}
                onChange={(data) =>
                  setMealSymptoms((prev) => ({ ...prev, [mealType]: data }))
                }
              />
            </ScrollView>
          ),
        });
      }
    }

    return steps;
  }, [foodMeals, mealFeelings, mealSymptoms, resetKey]);

  const steps: StepConfig[] = [
    {
      title: "How are you feeling?",
      component: (
        <ScrollView
          key={`mood-${resetKey}`}
          showsVerticalScrollIndicator={false}
        >
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
        <ScrollView
          key={`productivity-${resetKey}`}
          showsVerticalScrollIndicator={false}
        >
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
            selectedTextStyle={
              productivityRatingStyles.selectedProductivityText
            }
          />
        </ScrollView>
      ),
    },
    {
      title: "Food Intake",
      component: (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <ScrollView
            ref={foodScrollViewRef}
            key={`food-${resetKey}`}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <FoodIntakeForm
              key={`food-form-${resetKey}`}
              autoSave={false}
              onChange={setFoodMeals}
              onFeelingChange={setMealFeelings}
              autoFocus={true}
              scrollViewRef={foodScrollViewRef}
            />
            <BannerAd size="small" position="inline" />
          </ScrollView>
        </KeyboardAvoidingView>
      ),
    },
    ...mealSpecificSteps,
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stepper
        steps={steps}
        onComplete={handleCompleteAll}
        allowSkipAfterStep={2} // Allow skipping after step 3 (index 2)
      />
    </SafeAreaView>
  );
}
