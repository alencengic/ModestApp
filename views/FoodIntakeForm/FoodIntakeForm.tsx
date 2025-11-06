import React, { useEffect, useState, useMemo, useRef, useImperativeHandle, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getDistinctMeals } from "@/storage/supabase/foodIntakes";
import { foodIntakeFormStyles } from "./FoodIntakeForm.styles";
import { COMMON_FOODS } from "@/constants/FoodDatabase";
import { useGetAllMeals } from "@/hooks/queries/useMeals";
import { getMealFoodsArray, type Meal, type MealType as StorageMealType } from "@/storage/database";

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
  autoFocus?: boolean;
  scrollViewRef?: React.RefObject<ScrollView>;
}

export interface FoodIntakeFormRef {
  focusFirstInput: () => void;
}

const FoodIntakeFormComponent = forwardRef<FoodIntakeFormRef, FoodIntakeFormProps>(({
  autoSave = true,
  onChange,
  onSave: onSaveCallback,
  onFeelingChange,
  autoFocus = false,
  scrollViewRef,
}, ref) => {
  const breakfastInputRef = useRef<TextInput>(null);
  const lunchInputRef = useRef<TextInput>(null);
  const dinnerInputRef = useRef<TextInput>(null);
  const snacksInputRef = useRef<TextInput>(null);

  const breakfastViewRef = useRef<View>(null);
  const lunchViewRef = useRef<View>(null);
  const dinnerViewRef = useRef<View>(null);
  const snacksViewRef = useRef<View>(null);
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
  const [modalVisible, setModalVisible] = useState(false);
  const [activeModalMeal, setActiveModalMeal] = useState<MealType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [mealSelectorVisible, setMealSelectorVisible] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType | null>(null);

  const [userFoods, setUserFoods] = useState<string[]>([]);

  const [viewPositions, setViewPositions] = useState<Record<MealType, number>>({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
  });

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

  // Auto-focus breakfast input when autoFocus is true
  useEffect(() => {
    if (autoFocus && breakfastInputRef.current) {
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        breakfastInputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  // Expose focus method to parent components
  useImperativeHandle(ref, () => ({
    focusFirstInput: () => {
      breakfastInputRef.current?.focus();
    },
  }));

  const openModalPicker = (type: MealType) => {
    Keyboard.dismiss();
    setActiveModalMeal(type);
    setModalVisible(true);
    setSearchQuery("");
  };

  const closeModalPicker = () => {
    setModalVisible(false);
    setActiveModalMeal(null);
    setSearchQuery("");
  };

  const openMealSelector = (type: MealType) => {
    setActiveMealType(type);
    setMealSelectorVisible(true);
  };

  const closeMealSelector = () => {
    setMealSelectorVisible(false);
    setActiveMealType(null);
  };

  const handleLoadMeal = (meal: Meal) => {
    if (!activeMealType) return;

    const foods = getMealFoodsArray(meal);
    setMealItems((prev) => ({
      ...prev,
      [activeMealType]: [...prev[activeMealType], ...foods.filter(food => !prev[activeMealType].includes(food))],
    }));

    closeMealSelector();
  };

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

  const scrollToInput = (type: MealType) => {
    if (scrollViewRef?.current) {
      const yPosition = viewPositions[type];

      // Use a small timeout to ensure keyboard is opening
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: Math.max(0, yPosition - 100), // Offset to show some space above, min 0
          animated: true,
        });
      }, 100);
    }
  };

  const handleLayout = (type: MealType, event: any) => {
    const { y } = event.nativeEvent.layout;
    setViewPositions(prev => ({
      ...prev,
      [type]: y,
    }));
  };

  const renderMealInput = (type: MealType) => {
    const config = MEAL_CONFIG[type];
    const filteredItems = allFoods.filter((item) =>
      item.toLowerCase().includes(currentInput[type].toLowerCase())
    );
    const hasItems = mealItems[type].length > 0;
    const isFocused = focusedInput === type;
    const canAdd = currentInput[type].trim() !== "";

    const inputRefs = {
      breakfast: breakfastInputRef,
      lunch: lunchInputRef,
      dinner: dinnerInputRef,
      snacks: snacksInputRef,
    };

    const viewRefs = {
      breakfast: breakfastViewRef,
      lunch: lunchViewRef,
      dinner: dinnerViewRef,
      snacks: snacksViewRef,
    };

    return (
      <View
        ref={viewRefs[type]}
        style={foodIntakeFormStyles.mealSection}
        onLayout={(event) => handleLayout(type, event)}
      >
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

          {/* Action buttons */}
          <View style={foodIntakeFormStyles.actionButtonsContainer}>
            <TouchableOpacity
              style={[foodIntakeFormStyles.addButton, { flex: 1 }]}
              onPress={() => openModalPicker(type)}
            >
              <Text style={foodIntakeFormStyles.addButtonText}>
                + Add Items
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[foodIntakeFormStyles.loadMealButton, { flex: 1 }]}
              onPress={() => openMealSelector(type)}
            >
              <Text style={foodIntakeFormStyles.loadMealButtonText}>
                Load Meal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const modalFilteredItems = activeModalMeal
    ? allFoods.filter((item) => {
        const matchesSearch = item.toLowerCase().includes(searchQuery.toLowerCase());
        const notAlreadyAdded = !mealItems[activeModalMeal].includes(item);
        return matchesSearch && notAlreadyAdded;
      })
    : [];

  const hasExactMatch = modalFilteredItems.some(
    (item) => item.toLowerCase() === searchQuery.toLowerCase()
  );
  const canAddAsNew = searchQuery.trim() && !hasExactMatch;

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

      {/* Food Picker Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModalPicker}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Pressable
            style={foodIntakeFormStyles.modalOverlay}
            onPress={closeModalPicker}
          >
            <Pressable
              style={foodIntakeFormStyles.modalContainer}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={foodIntakeFormStyles.modalHeader}>
                <Text style={foodIntakeFormStyles.modalTitle}>
                  Select {activeModalMeal && MEAL_CONFIG[activeModalMeal].label}
                </Text>
                <TouchableOpacity
                  style={foodIntakeFormStyles.modalCloseButton}
                  onPress={closeModalPicker}
                >
                  <Text style={foodIntakeFormStyles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              <View style={foodIntakeFormStyles.searchContainer}>
                <TextInput
                  style={foodIntakeFormStyles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search or add new item..."
                  placeholderTextColor="#999"
                  autoFocus
                />
              </View>

              <ScrollView
                style={foodIntakeFormStyles.modalScrollView}
                keyboardShouldPersistTaps="handled"
              >
                {/* Add as new item button */}
                {canAddAsNew && (
                  <TouchableOpacity
                    style={foodIntakeFormStyles.addNewItemButton}
                    onPress={() => {
                      Keyboard.dismiss();
                      if (activeModalMeal) {
                        handleAddItem(activeModalMeal, searchQuery.trim());
                      }
                      closeModalPicker();
                    }}
                  >
                    <Text style={foodIntakeFormStyles.addNewItemIcon}>➕</Text>
                    <Text style={foodIntakeFormStyles.addNewItemText}>
                      Add "{searchQuery.trim()}" as new item
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Filtered existing items */}
                {modalFilteredItems.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={foodIntakeFormStyles.modalItem}
                    onPress={() => {
                      Keyboard.dismiss();
                      if (activeModalMeal) {
                        handleAddItem(activeModalMeal, item);
                      }
                      closeModalPicker();
                    }}
                  >
                    <Text style={foodIntakeFormStyles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}

                {/* No results message */}
                {!canAddAsNew && modalFilteredItems.length === 0 && searchQuery.trim() && (
                  <View style={foodIntakeFormStyles.noResults}>
                    <Text style={foodIntakeFormStyles.noResultsText}>
                      No items found
                    </Text>
                  </View>
                )}
              </ScrollView>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* Meal Selector Modal */}
      <MealSelectorModal
        visible={mealSelectorVisible}
        mealType={activeMealType as StorageMealType}
        onClose={closeMealSelector}
        onSelectMeal={handleLoadMeal}
      />
    </View>
  );
});

// Meal Selector Modal Component
interface MealSelectorModalProps {
  visible: boolean;
  mealType: StorageMealType;
  onClose: () => void;
  onSelectMeal: (meal: Meal) => void;
}

const MealSelectorModal: React.FC<MealSelectorModalProps> = ({
  visible,
  mealType,
  onClose,
  onSelectMeal,
}) => {
  const { data: allMeals = [], isLoading } = useGetAllMeals();

  // Filter meals: show meals of the specific type OR meals with no type (Any)
  const filteredMeals = allMeals.filter(
    (meal) => meal.meal_type === mealType || meal.meal_type === null
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={foodIntakeFormStyles.modalOverlay} onPress={onClose}>
        <Pressable
          style={foodIntakeFormStyles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={foodIntakeFormStyles.modalHeader}>
            <Text style={foodIntakeFormStyles.modalTitle}>Load Saved Meal</Text>
            <TouchableOpacity
              style={foodIntakeFormStyles.modalCloseButton}
              onPress={onClose}
            >
              <Text style={foodIntakeFormStyles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={foodIntakeFormStyles.loadingContainer}>
              <Text style={foodIntakeFormStyles.loadingText}>Loading meals...</Text>
            </View>
          ) : filteredMeals.length === 0 ? (
            <View style={foodIntakeFormStyles.emptyMealsContainer}>
              <Text style={foodIntakeFormStyles.emptyMealsIcon}>🍽️</Text>
              <Text style={foodIntakeFormStyles.emptyMealsText}>
                No saved meals yet.{"\n\n"}
                Create reusable meal templates in the "My Meals" screen from the menu to quickly log your favorite meals!
              </Text>
            </View>
          ) : (
            <ScrollView
              style={foodIntakeFormStyles.modalScrollView}
              keyboardShouldPersistTaps="handled"
            >
              {filteredMeals.map((meal) => {
                const foods = getMealFoodsArray(meal);
                return (
                  <TouchableOpacity
                    key={meal.id}
                    style={foodIntakeFormStyles.mealItem}
                    onPress={() => onSelectMeal(meal)}
                  >
                    <View style={foodIntakeFormStyles.mealItemHeader}>
                      <Text style={foodIntakeFormStyles.mealItemName}>{meal.name}</Text>
                      {meal.meal_type && (
                        <View style={foodIntakeFormStyles.mealItemBadge}>
                          <Text style={foodIntakeFormStyles.mealItemBadgeText}>
                            {meal.meal_type}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={foodIntakeFormStyles.mealItemFoods}>
                      {foods.join(", ")}
                    </Text>
                    <Text style={foodIntakeFormStyles.mealItemCount}>
                      {foods.length} item{foods.length !== 1 ? "s" : ""}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

FoodIntakeFormComponent.displayName = 'FoodIntakeForm';

export const FoodIntakeForm = FoodIntakeFormComponent as typeof FoodIntakeFormComponent;
