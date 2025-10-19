import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getDistinctMeals } from "@/storage/database";
import { foodIntakeFormStyles } from "./FoodIntakeForm.styles";
import { COMMON_FOODS } from "@/constants/FoodDatabase";

type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

const MEAL_CONFIG = {
  breakfast: { label: "Breakfast", icon: "☀️", placeholder: "e.g., Oatmeal, eggs, coffee" },
  lunch: { label: "Lunch", icon: "🌤️", placeholder: "e.g., Salad, sandwich, soup" },
  dinner: { label: "Dinner", icon: "🌙", placeholder: "e.g., Chicken, rice, vegetables" },
  snacks: { label: "Snacks", icon: "🍎", placeholder: "e.g., Fruit, nuts, yogurt" },
};

export interface MealFeeling {
  meal: string;
  feeling: "great" | "good" | "okay" | "bad" | "terrible" | null;
}

interface FoodIntakeFormProps {
  autoSave?: boolean;
  onChange?: (meals: Record<MealType, string>) => void;
  onSave?: () => Promise<void>;
  onFeelingChange?: (feelings: Record<MealType, MealFeeling["feeling"]>) => void;
}

export const FoodIntakeForm: React.FC<FoodIntakeFormProps> = ({
  autoSave = true,
  onChange,
  onSave: onSaveCallback,
  onFeelingChange,
}) => {
  const [mealItems, setMealItems] = useState<Record<MealType, string[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  const [mealFeelings, setMealFeelings] = useState<Record<MealType, MealFeeling["feeling"]>>({
    breakfast: null,
    lunch: null,
    dinner: null,
    snacks: null,
  });

  // Current text in input field
  const [currentInput, setCurrentInput] = useState<Record<MealType, string>>({
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

  const [userFoods, setUserFoods] = useState<string[]>([]);

  const allFoods = useMemo(() => {
    const combined = [...COMMON_FOODS, ...userFoods];
    return Array.from(new Set(combined)).sort();
  }, [userFoods]);

  useEffect(() => {
    const mealsAsString: Record<MealType, string> = {
      breakfast: mealItems.breakfast.join(", "),
      lunch: mealItems.lunch.join(", "),
      dinner: mealItems.dinner.join(", "),
      snacks: mealItems.snacks.join(", "),
    };
    onChange?.(mealsAsString);
  }, [mealItems, onChange]);

  useEffect(() => {
    onFeelingChange?.(mealFeelings);
  }, [mealFeelings, onFeelingChange]);

  useEffect(() => {
    const loadUserFoods = async () => {
      const data = await getDistinctMeals();
      const allUserFoods = [
        ...data.breakfast,
        ...data.lunch,
        ...data.dinner,
        ...data.snacks,
      ];
      setUserFoods(Array.from(new Set(allUserFoods)));
    };
    loadUserFoods();
  }, []);

  const handleAddItem = (type: MealType, item: string) => {
    const trimmedItem = item.trim();
    if (trimmedItem && !mealItems[type].includes(trimmedItem)) {
      setMealItems((prev) => ({
        ...prev,
        [type]: [...prev[type], trimmedItem],
      }));
      setCurrentInput((prev) => ({ ...prev, [type]: "" }));
      setMenuVisible((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleRemoveItem = (type: MealType, itemToRemove: string) => {
    setMealItems((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== itemToRemove),
    }));
  };

  const handleClearAll = (type: MealType) => {
    setMealItems((prev) => ({ ...prev, [type]: [] }));
    setCurrentInput((prev) => ({ ...prev, [type]: "" }));
    setMenuVisible((prev) => ({ ...prev, [type]: false }));
  };

  const renderMealInput = (type: MealType) => {
    const config = MEAL_CONFIG[type];
    const filteredItems = allFoods.filter((item) =>
      item.toLowerCase().includes(currentInput[type].toLowerCase())
    );
    const hasItems = mealItems[type].length > 0;
    const isFocused = focusedInput === type;
    const canAdd = currentInput[type].trim() !== "";

    return (
      <View style={foodIntakeFormStyles.mealSection}>
        <View
          style={[
            foodIntakeFormStyles.mealCard,
            hasItems && foodIntakeFormStyles.mealCardFilled,
          ]}
        >
          <View style={foodIntakeFormStyles.mealHeader}>
            <Text style={foodIntakeFormStyles.mealIcon}>{config.icon}</Text>
            <Text style={foodIntakeFormStyles.mealLabel}>{config.label}</Text>
            {hasItems && (
              <TouchableOpacity
                style={foodIntakeFormStyles.clearButton}
                onPress={() => handleClearAll(type)}
              >
                <Text style={foodIntakeFormStyles.clearButtonText}>
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Display added items as chips */}
          {hasItems && (
            <View style={foodIntakeFormStyles.chipContainer}>
              {mealItems[type].map((item) => (
                <View key={item} style={foodIntakeFormStyles.chip}>
                  <Text style={foodIntakeFormStyles.chipText}>{item}</Text>
                  <TouchableOpacity
                    style={foodIntakeFormStyles.chipRemove}
                    onPress={() => handleRemoveItem(type, item)}
                  >
                    <Text style={foodIntakeFormStyles.chipRemoveText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TextInput
            style={[
              foodIntakeFormStyles.inputField,
              isFocused && foodIntakeFormStyles.inputFieldFocused,
            ]}
            value={currentInput[type]}
            placeholder={config.placeholder}
            placeholderTextColor="#999"
            onFocus={() => {
              setFocusedInput(type);
              if (currentInput[type].trim() !== "") {
                setMenuVisible((prev) => ({ ...prev, [type]: true }));
              }
            }}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(text) => {
              setCurrentInput((prev) => ({ ...prev, [type]: text }));
              setMenuVisible((prev) => ({ ...prev, [type]: text.trim() !== "" }));
            }}
            onSubmitEditing={() => {
              if (canAdd) {
                handleAddItem(type, currentInput[type]);
              }
            }}
            returnKeyType="done"
            blurOnSubmit={false}
          />

          {/* Add button */}
          {canAdd && (
            <TouchableOpacity
              style={[
                foodIntakeFormStyles.addButton,
                !canAdd && foodIntakeFormStyles.addButtonDisabled,
              ]}
              onPress={() => handleAddItem(type, currentInput[type])}
              disabled={!canAdd}
            >
              <Text style={foodIntakeFormStyles.addButtonText}>
                + Add Item
              </Text>
            </TouchableOpacity>
          )}

          {menuVisible[type] && currentInput[type].trim() !== "" && (
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
                        handleAddItem(type, item);
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

      {Object.values(mealItems).every((items) => items.length === 0) && (
        <View style={foodIntakeFormStyles.emptyState}>
          <Text style={foodIntakeFormStyles.emptyStateText}>
            Start by adding what you ate for each meal
          </Text>
        </View>
      )}
    </View>
  );
};
