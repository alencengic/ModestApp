import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { insertFoodIntake, getDistinctMeals } from "@/storage/database";
import { foodIntakeFormStyles } from "./FoodIntakeForm.styles";
import { Menu, Provider } from "react-native-paper";

interface FoodIntakeFormProps {
  onSave: (foodIntake: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  }) => void;
}

type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export const FoodIntakeForm: React.FC<FoodIntakeFormProps> = ({ onSave }) => {
  const [meals, setMeals] = useState<Record<MealType, string>>({
    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: "",
  });

  const [menuVisible, setMenuVisible] = useState<Record<MealType, boolean>>({
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false,
  });

  const [suggestions, setSuggestions] = useState<Record<MealType, string[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  useEffect(() => {
    const refreshSuggestions = async () => {
      const data = await getDistinctMeals();
      setSuggestions(data);
    };
    refreshSuggestions();
  }, []);

  const handleChange = (type: MealType, value: string) => {
    setMeals((prev) => ({ ...prev, [type]: value }));
  };

  const handleSave = async () => {
    await insertFoodIntake(meals);
    onSave(meals);
    setMeals({ breakfast: "", lunch: "", dinner: "", snacks: "" });
  };

  const renderDropdown = (label: string, type: MealType) => (
    <View style={foodIntakeFormStyles.dropdownContainer}>
      <Text style={foodIntakeFormStyles.inputLabel}>{label}</Text>

      <TextInput
        style={foodIntakeFormStyles.inputField}
        value={meals[type]}
        placeholder={`Type or select ${label.toLowerCase()}`}
        onFocus={() => setMenuVisible((prev) => ({ ...prev, [type]: true }))}
        onChangeText={(text) => handleChange(type, text)}
      />

      {menuVisible[type] && suggestions[type].length > 0 && (
        <FlatList
          style={{
            backgroundColor: "#fff",
            borderColor: "#ccc",
            borderWidth: 1,
            maxHeight: 120,
          }}
          data={suggestions[type].filter((item) =>
            item.toLowerCase().includes(meals[type].toLowerCase())
          )}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                handleChange(type, item);
                setMenuVisible((prev) => ({ ...prev, [type]: false }));
              }}
              style={{ padding: 10 }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );

  return (
    <Provider>
      <View style={foodIntakeFormStyles.container}>
        <Text style={foodIntakeFormStyles.title}>Food Intake</Text>
        {renderDropdown("Breakfast", "breakfast")}
        {renderDropdown("Lunch", "lunch")}
        {renderDropdown("Dinner", "dinner")}
        {renderDropdown("Snacks", "snacks")}
        <Button title="Save Entry" onPress={handleSave} />
      </View>
    </Provider>
  );
};
