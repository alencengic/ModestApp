import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moodRatingStyles } from "./MoodRating.styles";
import { insertOrUpdateMood } from "@/storage/database";
import { DateTime } from "luxon";

interface Mood {
  emoji: string;
  label: string;
}

export const MoodRating = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (mood: string) =>
      insertOrUpdateMood(mood, DateTime.now().toISODate() as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moodEntries"] });
      queryClient.invalidateQueries({ queryKey: ["foodMoodCorrelation"] });
      Alert.alert("Mood Saved", "Your mood for today has been saved.");
    },
    onError: (error) => {
      console.error("Mood save failed:", error);
      Alert.alert("Save Failed", "An error occurred while saving your mood.");
    },
  });

  const moods: Mood[] = [
    { emoji: "😢", label: "Sad" },
    { emoji: "😔", label: "Neutral" },
    { emoji: "🙂", label: "Happy" },
    { emoji: "😄", label: "Very Happy" },
    { emoji: "😁", label: "Ecstatic" },
  ];

  const handleMoodClick = (mood: Mood) => {
    setSelectedMood(mood);
    mutation.mutate(mood.label);
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
              selectedMood?.label === mood.label &&
                moodRatingStyles.selectedMood,
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
    </View>
  );
};
