// components/FoodIntakeForm.tsx

import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { foodIntakeFormStyles } from "./FoodIntakeForm.styles";

interface FoodIntakeFormProps {
  onSave: (foodIntake: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  }) => void;
}

const FoodIntakeForm: React.FC<FoodIntakeFormProps> = ({ onSave }) => {
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");
  const [snacks, setSnacks] = useState("");

  const handleSave = () => {
    const foodIntake = { breakfast, lunch, dinner, snacks };
    onSave(foodIntake);
    // Reset inputs after saving
    setBreakfast("");
    setLunch("");
    setDinner("");
    setSnacks("");
  };

  return (
    <View style={foodIntakeFormStyles.container}>
      <Text style={foodIntakeFormStyles.title}>Food Intake</Text>

      {/* Breakfast Input */}
      <View style={foodIntakeFormStyles.inputContainer}>
        <Text style={foodIntakeFormStyles.inputLabel}>Breakfast:</Text>
        <TextInput
          style={foodIntakeFormStyles.inputField}
          value={breakfast}
          onChangeText={setBreakfast}
          placeholder="Enter breakfast details"
        />
      </View>

      {/* Lunch Input */}
      <View style={foodIntakeFormStyles.inputContainer}>
        <Text style={foodIntakeFormStyles.inputLabel}>Lunch:</Text>
        <TextInput
          style={foodIntakeFormStyles.inputField}
          value={lunch}
          onChangeText={setLunch}
          placeholder="Enter lunch details"
        />
      </View>

      {/* Dinner Input */}
      <View style={foodIntakeFormStyles.inputContainer}>
        <Text style={foodIntakeFormStyles.inputLabel}>Dinner:</Text>
        <TextInput
          style={foodIntakeFormStyles.inputField}
          value={dinner}
          onChangeText={setDinner}
          placeholder="Enter dinner details"
        />
      </View>

      {/* Snacks Input */}
      <View style={foodIntakeFormStyles.inputContainer}>
        <Text style={foodIntakeFormStyles.inputLabel}>Snacks:</Text>
        <TextInput
          style={foodIntakeFormStyles.inputField}
          value={snacks}
          onChangeText={setSnacks}
          placeholder="Enter snacks details"
        />
      </View>

      {/* Save Button */}
      <Button title="Save Entry" onPress={handleSave} />
    </View>
  );
};

export default FoodIntakeForm;
