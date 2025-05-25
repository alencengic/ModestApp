import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { moodRatingStyles } from "./MoodRating.styles";
import { useMutationSaveMoodEntry } from "../../hooks/queries/useMutationSaveMoodEntry";
import { DateTime } from "luxon";

interface Mood {
  emoji: string;
  label: string;
}

export const MoodRating = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const {
    mutate: saveMood,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutationSaveMoodEntry();

  const moods: Mood[] = [
    { emoji: "😢", label: "Sad" },
    { emoji: "😔", label: "Neutral" },
    { emoji: "🙂", label: "Happy" },
    { emoji: "😄", label: "Very Happy" },
    { emoji: "😁", label: "Ecstatic" },
  ];

  const handleMoodClick = (mood: Mood) => {
    setSelectedMood(mood);
    const today = DateTime.now().toISODate();
    if (today) {
      saveMood({
        mood_label: mood.label,
        emoji: mood.emoji,
        date: today,
      });
    } else {
      // Fallback or error handling if date is somehow null
      console.error("Failed to get current date for mood entry");
      // Optionally, use the alternative date format if luxon fails
      // const fallbackDate = new Date().toISOString().split('T')[0];
      // saveMood({
      //   mood_label: mood.label,
      //   emoji: mood.emoji,
      //   date: fallbackDate,
      // });
    }
  };

  return (
    <View style={moodRatingStyles.moodContainer}>
      <Text style={moodRatingStyles.moodTitle}>How are you feeling today?</Text>
      <View style={moodRatingStyles.moodButtons}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleMoodClick(mood)}
            style={[
              moodRatingStyles.moodButton,
              selectedMood === mood && moodRatingStyles.selectedMood,
            ]}
          >
            <Text style={moodRatingStyles.emoji}>{mood.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedMood && (
        <Text style={moodRatingStyles.selectedText}>
          You selected: {selectedMood.label}
        </Text>
      )}
      {isLoading && (
        <Text style={moodRatingStyles.selectedText}>Saving mood...</Text>
      )}
      {isSuccess && !isLoading && (
        <Text style={moodRatingStyles.selectedText}>
          Mood saved successfully!
        </Text>
      )}
      {isError && !isLoading && (
        <Text style={moodRatingStyles.selectedText}>
          Error saving mood: {error?.message}
        </Text>
      )}
    </View>
  );
};
