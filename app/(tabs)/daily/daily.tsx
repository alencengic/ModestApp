import React, { useState, useMemo } from "react";
import { Alert, ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateTime } from "luxon";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { createDailyEnterScreenStyles } from "./_DailyEnterScreen.styles";
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

import { moodRatingStyles } from "@/views/MoodRating/MoodRating.styles";
import { productivityRatingStyles } from "@/views/ProductivityRating/ProductivityRating.styles";
import { useTranslation } from "react-i18next";

const getMoodOptions = (t: any, primaryColor: string) => [
  { value: "Sad", display: <MaterialCommunityIcons name="emoticon-sad-outline" size={24} color={primaryColor} />, label: t('daily.poor') },
  { value: "Neutral", display: <MaterialCommunityIcons name="emoticon-neutral-outline" size={24} color={primaryColor} />, label: t('daily.notGreat') },
  { value: "Happy", display: <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color={primaryColor} />, label: t('daily.okay') },
  { value: "Very Happy", display: <MaterialCommunityIcons name="emoticon-excited-outline" size={24} color={primaryColor} />, label: t('daily.good') },
  { value: "Ecstatic", display: <MaterialCommunityIcons name="emoticon-cool-outline" size={24} color={primaryColor} />, label: t('daily.excellent') },
];

const getProductivityOptions = (t: any, primaryColor: string) => [
  { value: 1, display: <MaterialCommunityIcons name="sleep" size={24} color={primaryColor} />, label: t('daily.veryLow') },
  { value: 2, display: <MaterialCommunityIcons name="walk" size={24} color={primaryColor} />, label: t('daily.low') },
  { value: 3, display: <MaterialCommunityIcons name="run" size={24} color={primaryColor} />, label: t('daily.moderate') },
  { value: 4, display: <MaterialCommunityIcons name="run-fast" size={24} color={primaryColor} />, label: t('daily.high') },
  { value: 5, display: <MaterialCommunityIcons name="rocket-launch-outline" size={24} color={primaryColor} />, label: t('daily.veryHigh') },
];

type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

const getMealConfig = (t: any) => ({
  breakfast: { label: t('meals.breakfast'), icon: "☀️" },
  lunch: { label: t('meals.lunch'), icon: "🌤️" },
  dinner: { label: t('meals.dinner'), icon: "🌙" },
  snacks: { label: t('meals.snacks'), icon: "🍎" },
});

export default function DailyEnterScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createDailyEnterScreenStyles(theme);
  const foodScrollViewRef = React.useRef<ScrollView>(null);
  const moodOptions = getMoodOptions(t, theme.colors.primary);
  const productivityOptions = getProductivityOptions(t, theme.colors.primary);
  const MEAL_CONFIG = getMealConfig(t);
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

      Alert.alert(t('daily.entrySaved'), t('daily.entrySavedMessage'));

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
      Alert.alert(t('common.error'), t('daily.savingEntry'));
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
          title: `${config.icon} ${config.label} ${t('daily.feeling')}`,
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
          title: `${config.icon} ${config.label} ${t('daily.symptoms')}`,
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
      title: t('daily.selectMood'),
      component: (
        <ScrollView
          key={`mood-${resetKey}`}
          showsVerticalScrollIndicator={false}
        >
          <RatingComponent
            title={t('daily.selectMood')}
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
      title: t('daily.selectProductivity'),
      component: (
        <ScrollView
          key={`productivity-${resetKey}`}
          showsVerticalScrollIndicator={false}
        >
          <RatingComponent
            title={t('daily.selectProductivity')}
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
      title: t('daily.foodIntake'),
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
