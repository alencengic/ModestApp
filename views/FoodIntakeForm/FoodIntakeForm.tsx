import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getDistinctMeals } from "@/storage/database";
import { foodIntakeFormStyles } from "./FoodIntakeForm.styles";

type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

const MEAL_CONFIG = {
  breakfast: { label: "Breakfast", icon: "☀️", placeholder: "e.g., Oatmeal, eggs, coffee" },
  lunch: { label: "Lunch", icon: "🌤️", placeholder: "e.g., Salad, sandwich, soup" },
  dinner: { label: "Dinner", icon: "🌙", placeholder: "e.g., Chicken, rice, vegetables" },
  snacks: { label: "Snacks", icon: "🍎", placeholder: "e.g., Fruit, nuts, yogurt" },
};

interface FoodIntakeFormProps {
  autoSave?: boolean;
  onChange?: (meals: Record<MealType, string>) => void;
  onSave?: () => Promise<void>;
}

export const FoodIntakeForm: React.FC<FoodIntakeFormProps> = ({
  autoSave = true,
  onChange,
  onSave: onSaveCallback,
}) => {
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

  const [focusedInput, setFocusedInput] = useState<MealType | null>(null);

  const [suggestions, setSuggestions] = useState<Record<MealType, string[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  const handleChange = (type: MealType, value: string) => {
    const newMeals = { ...meals, [type]: value };
    setMeals(newMeals);
    onChange?.(newMeals);
  };

  useEffect(() => {
    const refreshSuggestions = async () => {
      const data = await getDistinctMeals();
      setSuggestions(data);
    };
    refreshSuggestions();
  }, []);

  const handleClear = (type: MealType) => {
    handleChange(type, "");
    setMenuVisible((prev) => ({ ...prev, [type]: false }));
  };

  const renderMealInput = (type: MealType) => {
    const config = MEAL_CONFIG[type];
    const filteredItems = suggestions[type].filter((item) =>
      item.toLowerCase().includes(meals[type].toLowerCase())
    );
    const hasValue = meals[type].trim() !== "";
    const isFocused = focusedInput === type;

    return (
      <View style={foodIntakeFormStyles.mealSection}>
        <View
          style={[
            foodIntakeFormStyles.mealCard,
            hasValue && foodIntakeFormStyles.mealCardFilled,
          ]}
        >
          <View style={foodIntakeFormStyles.mealHeader}>
            <Text style={foodIntakeFormStyles.mealIcon}>{config.icon}</Text>
            <Text style={foodIntakeFormStyles.mealLabel}>{config.label}</Text>
            {hasValue && (
              <TouchableOpacity
                style={foodIntakeFormStyles.clearButton}
                onPress={() => handleClear(type)}
              >
                <Text style={foodIntakeFormStyles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={[
              foodIntakeFormStyles.inputField,
              isFocused && foodIntakeFormStyles.inputFieldFocused,
            ]}
            value={meals[type]}
            placeholder={config.placeholder}
            placeholderTextColor="#999"
            onFocus={() => {
              setFocusedInput(type);
              setMenuVisible((prev) => ({ ...prev, [type]: true }));
            }}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(text) => {
              handleChange(type, text);
              setMenuVisible((prev) => ({ ...prev, [type]: true }));
            }}
          />

          {menuVisible[type] && meals[type].trim() !== "" && (
            <View style={foodIntakeFormStyles.suggestionsContainer}>
              <ScrollView nestedScrollEnabled>
                {filteredItems.length > 0 ? (
                  filteredItems.slice(0, 5).map((item, index) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        foodIntakeFormStyles.suggestionItem,
                        index === Math.min(filteredItems.length, 5) - 1 &&
                          foodIntakeFormStyles.suggestionItemLast,
                      ]}
                      onPress={() => {
                        handleChange(type, item);
                        setMenuVisible((prev) => ({ ...prev, [type]: false }));
                      }}
                    >
                      <Text style={foodIntakeFormStyles.suggestionText}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={foodIntakeFormStyles.noSuggestions}>
                    <Text style={foodIntakeFormStyles.noSuggestionsText}>
                      No previous entries found
                    </Text>
                  </View>
                )}
              </ScrollView>
              <TouchableOpacity
                style={foodIntakeFormStyles.closeButton}
                onPress={() =>
                  setMenuVisible((prev) => ({ ...prev, [type]: false }))
                }
              >
                <Text style={foodIntakeFormStyles.closeButtonText}>
                  Close Suggestions
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={foodIntakeFormStyles.container}>
      <Text style={foodIntakeFormStyles.title}>What did you eat today?</Text>
      <Text style={foodIntakeFormStyles.subtitle}>
        Track your meals and snacks throughout the day
      </Text>

      {renderMealInput("breakfast")}
      {renderMealInput("lunch")}
      {renderMealInput("dinner")}
      {renderMealInput("snacks")}

      {Object.values(meals).every((meal) => meal.trim() === "") && (
        <View style={foodIntakeFormStyles.emptyState}>
          <Text style={foodIntakeFormStyles.emptyStateText}>
            Start by adding what you ate for each meal
          </Text>
        </View>
      )}
    </View>
  );
};
