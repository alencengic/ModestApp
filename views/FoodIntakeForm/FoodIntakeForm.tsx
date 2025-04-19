import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getDistinctMeals, dropFoodIntakeTable } from "@/storage/database";
import { foodIntakeFormStyles } from "./FoodIntakeForm.styles";
import { Provider } from "react-native-paper";
import { DateTime } from "luxon";

import { useMutationInsertFoodIntake } from "@/hooks/queries/useMutationInsertFoodIntake";

type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export const FoodIntakeForm: React.FC = () => {
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

  const { mutateAsync: saveFoodIntake } = useMutationInsertFoodIntake();

  const handleChange = (type: MealType, value: string) => {
    setMeals((prev) => ({ ...prev, [type]: value }));
  };

  const handleSave = async () => {
    const currentDate = DateTime.now().toFormat("yyyy-LL-dd");
    const dataToSave = { ...meals, date: currentDate };

    try {
      await saveFoodIntake(dataToSave);
      setMeals({ breakfast: "", lunch: "", dinner: "", snacks: "" });
      setMenuVisible({
        breakfast: false,
        lunch: false,
        dinner: false,
        snacks: false,
      });
    } catch (error) {
      console.error("Failed to save food intake:", error);
      Alert.alert("Error", "Failed to save food entry. Please try again.");
    }
  };

  const handleDropTable = async () => {
    try {
      await dropFoodIntakeTable();
      Alert.alert("Success", "Food intake table dropped successfully.");
    } catch (error) {
      console.error("Failed to drop table:", error);
      Alert.alert("Error", "Failed to drop table.");
    }
  };

  useEffect(() => {
    const refreshSuggestions = async () => {
      const data = await getDistinctMeals();
      setSuggestions(data);
    };
    refreshSuggestions();
  }, []);

  const renderDropdown = (label: string, type: MealType) => {
    const filteredItems = suggestions[type].filter((item) =>
      item.toLowerCase().includes(meals[type].toLowerCase())
    );

    return (
      <View style={foodIntakeFormStyles.dropdownContainer}>
        <Text style={foodIntakeFormStyles.inputLabel}>{label}</Text>

        <TextInput
          style={foodIntakeFormStyles.inputField}
          value={meals[type]}
          placeholder={`Type or select ${label.toLowerCase()}`}
          onFocus={() => setMenuVisible((prev) => ({ ...prev, [type]: true }))}
          onChangeText={(text) => handleChange(type, text)}
        />

        {menuVisible[type] && (
          <>
            <View
              style={{
                backgroundColor: "#fff",
                borderColor: "#ccc",
                borderWidth: 1,
                maxHeight: 120,
              }}
            >
              {filteredItems.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    handleChange(type, item);
                    setMenuVisible((prev) => ({ ...prev, [type]: false }));
                  }}
                  style={{ padding: 10 }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={() =>
                setMenuVisible((prev) => ({ ...prev, [type]: false }))
              }
              style={{ padding: 8, alignItems: "flex-end" }}
            >
              <Text style={{ color: "#007bff" }}>Close</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  return (
    <Provider>
      <View style={foodIntakeFormStyles.container}>
        <Text style={foodIntakeFormStyles.title}>Food Intake</Text>
        {renderDropdown("Breakfast", "breakfast")}
        {renderDropdown("Lunch", "lunch")}
        {renderDropdown("Dinner", "dinner")}
        {renderDropdown("Snacks", "snacks")}
        <Button title="Save Entry" onPress={handleSave} />
        <View style={{ marginTop: 10 }}>
          <Button
            title="Drop Table (DEV)"
            onPress={handleDropTable}
            color="red"
          />
        </View>
      </View>
    </Provider>
  );
};
