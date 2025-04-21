import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { moodRatingStyles } from "./MoodRating.styles";

interface Mood {
  emoji: string;
  label: string;
}

export const MoodRating = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const moods: Mood[] = [
    { emoji: "😢", label: "Sad" },
    { emoji: "😔", label: "Neutral" },
    { emoji: "🙂", label: "Happy" },
    { emoji: "😄", label: "Very Happy" },
    { emoji: "😁", label: "Ecstatic" },
  ];

  const handleMoodClick = (mood: Mood) => {
    setSelectedMood(mood);
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
    </View>
  );
};
