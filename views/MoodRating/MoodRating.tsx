import React from "react";
import { RatingComponent, RatingOption } from "@/components/RatingComponent";
import { moodRatingStyles } from "./MoodRating.styles";
import { insertOrUpdateMood } from "@/storage/supabase/moodEntries";
import { DateTime } from "luxon";

const moodOptions: RatingOption<string>[] = [
  { value: "Sad", display: "😢", label: "Sad" },
  { value: "Neutral", display: "😔", label: "Neutral" },
  { value: "Happy", display: "🙂", label: "Happy" },
  { value: "Very Happy", display: "😄", label: "Very Happy" },
  { value: "Ecstatic", display: "😁", label: "Ecstatic" },
];

export const MoodRating = () => {
  const handleSave = async (mood: string) => {
    await insertOrUpdateMood(mood, DateTime.now().toISODate() as string);
  };

  return (
    <RatingComponent
      title="How are you feeling today?"
      options={moodOptions}
      onSave={handleSave}
      queryKeys={[["moodEntries"], ["foodMoodCorrelation"]]}
      successMessage="Your mood for today has been saved."
      errorMessage="An error occurred while saving your mood."
      containerStyle={moodRatingStyles.moodContainer}
      titleStyle={moodRatingStyles.moodTitle}
      buttonContainerStyle={moodRatingStyles.moodButtons}
      buttonStyle={moodRatingStyles.moodButton}
      selectedButtonStyle={moodRatingStyles.selectedMood}
      displayTextStyle={moodRatingStyles.emoji}
      selectedTextStyle={moodRatingStyles.selectedText}
    />
  );
};
