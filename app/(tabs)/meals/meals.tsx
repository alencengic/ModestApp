import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "./MealsScreen.styles";
import {
  useGetAllMeals,
  useInsertMeal,
  useUpdateMeal,
  useDeleteMeal,
} from "@/hooks/queries/useMeals";
import { getMealFoodsArray, type Meal, type MealType } from "@/storage/meals";
import { COMMON_FOODS } from "@/constants/FoodDatabase";

const MEAL_TYPE_OPTIONS: { value: MealType; label: string; emoji: string }[] = [
  { value: null, label: "Any", emoji: "🍽️" },
  { value: "breakfast", label: "Breakfast", emoji: "☀️" },
  { value: "lunch", label: "Lunch", emoji: "🌤️" },
  { value: "dinner", label: "Dinner", emoji: "🌙" },
  { value: "snacks", label: "Snacks", emoji: "🍎" },
];

export default function MealsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [filterType, setFilterType] = useState<MealType>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [mealName, setMealName] = useState("");
  const [selectedType, setSelectedType] = useState<MealType>(null);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [showFoodPicker, setShowFoodPicker] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState("");

  const { data: meals = [], isLoading, refetch } = useGetAllMeals();
  const insertMeal = useInsertMeal();
  const updateMeal = useUpdateMeal();
  const deleteMeal = useDeleteMeal();

  const filteredMeals = meals.filter((meal) => {
    if (!filterType) return true;
    return meal.meal_type === filterType;
  });

  const filteredFoods = COMMON_FOODS.filter((food) =>
    food.toLowerCase().includes(foodSearchQuery.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingMeal(null);
    setMealName("");
    setSelectedType(null);
    setSelectedFoods([]);
    setShowModal(true);
  };

  const openEditModal = (meal: Meal) => {
    setEditingMeal(meal);
    setMealName(meal.name);
    setSelectedType(meal.meal_type);
    setSelectedFoods(getMealFoodsArray(meal));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMeal(null);
    setMealName("");
    setSelectedType(null);
    setSelectedFoods([]);
    setShowFoodPicker(false);
    setFoodSearchQuery("");
  };

  const handleSaveMeal = async () => {
    if (!mealName.trim()) {
      Alert.alert("Error", "Please enter a meal name");
      return;
    }

    if (selectedFoods.length === 0) {
      Alert.alert("Error", "Please add at least one food item");
      return;
    }

    try {
      if (editingMeal) {
        await updateMeal.mutateAsync({
          id: editingMeal.id,
          data: {
            name: mealName.trim(),
            meal_type: selectedType,
            foods: selectedFoods,
          },
        });
      } else {
        await insertMeal.mutateAsync({
          name: mealName.trim(),
          meal_type: selectedType,
          foods: selectedFoods,
        });
      }
      closeModal();
    } catch (error) {
      Alert.alert("Error", "Failed to save meal");
    }
  };

  const handleDeleteMeal = (meal: Meal) => {
    Alert.alert("Delete Meal", `Are you sure you want to delete "${meal.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMeal.mutateAsync(meal.id);
          } catch (error) {
            Alert.alert("Error", "Failed to delete meal");
          }
        },
      },
    ]);
  };

  const toggleFoodSelection = (food: string) => {
    if (selectedFoods.includes(food)) {
      setSelectedFoods(selectedFoods.filter((f) => f !== food));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  const removeFoodFromSelected = (food: string) => {
    setSelectedFoods(selectedFoods.filter((f) => f !== food));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading meals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Meals</Text>
            <Text style={styles.headerSubtitle}>
              Create reusable meals to quickly log your food intake
            </Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterCard}>
          <Text style={styles.filterTitle}>Filter by Type</Text>
          <View style={styles.filterButtons}>
            {MEAL_TYPE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.filterButton,
                  filterType === option.value && styles.filterButtonActive,
                ]}
                onPress={() => setFilterType(option.value)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterType === option.value && styles.filterButtonTextActive,
                  ]}
                >
                  {option.emoji} {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Create New Meal Button */}
        <View style={styles.createButtonContainer}>
          <TouchableOpacity style={styles.createButton} onPress={openCreateModal}>
            <Text style={styles.createButtonText}>+ Create New Meal</Text>
          </TouchableOpacity>
        </View>

        {/* Meals List */}
        {filteredMeals.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>🍽️</Text>
            <Text style={styles.emptyStateText}>
              No meals created yet.{"\n"}
              Create your first meal template to quickly log your food!
            </Text>
          </View>
        ) : (
          <View style={styles.mealsContainer}>
            {filteredMeals.map((meal) => {
              const foods = getMealFoodsArray(meal);
              const mealTypeInfo = MEAL_TYPE_OPTIONS.find(
                (opt) => opt.value === meal.meal_type
              );

              return (
                <View key={meal.id} style={styles.mealCard}>
                  <View style={styles.mealCardHeader}>
                    <View style={styles.mealTitleRow}>
                      {mealTypeInfo && (
                        <Text style={styles.mealEmoji}>{mealTypeInfo.emoji}</Text>
                      )}
                      <Text style={styles.mealName}>{meal.name}</Text>
                    </View>
                    {mealTypeInfo && mealTypeInfo.value && (
                      <View style={styles.mealTypeBadge}>
                        <Text style={styles.mealTypeBadgeText}>
                          {mealTypeInfo.label}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.foodItemsContainer}>
                    {foods.map((food, index) => (
                      <View key={index} style={styles.foodChip}>
                        <Text style={styles.foodChipText}>{food}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.mealCardActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => openEditModal(meal)}
                    >
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonDanger]}
                      onPress={() => handleDeleteMeal(meal)}
                    >
                      <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Create/Edit Meal Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {editingMeal ? "Edit Meal" : "Create New Meal"}
              </Text>

              {/* Meal Name */}
              <Text style={styles.inputLabel}>Meal Name</Text>
              <TextInput
                style={styles.textInput}
                value={mealName}
                onChangeText={setMealName}
                placeholder="e.g., My Favorite Breakfast"
                placeholderTextColor={theme.colors.textSecondary}
              />

              {/* Meal Type */}
              <Text style={styles.inputLabel}>Meal Type (Optional)</Text>
              <View style={styles.typeSelector}>
                {MEAL_TYPE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    style={[
                      styles.typeButton,
                      selectedType === option.value && styles.typeButtonActive,
                    ]}
                    onPress={() => setSelectedType(option.value)}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        selectedType === option.value && styles.typeButtonTextActive,
                      ]}
                    >
                      {option.emoji} {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Selected Foods */}
              <Text style={styles.inputLabel}>Foods ({selectedFoods.length})</Text>
              {selectedFoods.length > 0 && (
                <View style={styles.selectedFoodsContainer}>
                  {selectedFoods.map((food, index) => (
                    <View key={index} style={styles.selectedFoodChip}>
                      <Text style={styles.selectedFoodText}>{food}</Text>
                      <TouchableOpacity onPress={() => removeFoodFromSelected(food)}>
                        <Text style={styles.removeFoodButton}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Add Food Button */}
              <TouchableOpacity
                style={styles.addFoodButton}
                onPress={() => setShowFoodPicker(!showFoodPicker)}
              >
                <Text style={styles.addFoodButtonText}>
                  {showFoodPicker ? "- Hide Food List" : "+ Add Foods"}
                </Text>
              </TouchableOpacity>

              {/* Food Picker */}
              {showFoodPicker && (
                <View style={styles.foodPickerContainer}>
                  <TextInput
                    style={styles.searchInput}
                    value={foodSearchQuery}
                    onChangeText={setFoodSearchQuery}
                    placeholder="Search foods..."
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                  <ScrollView style={styles.foodList} nestedScrollEnabled>
                    {filteredFoods.map((food) => {
                      const isSelected = selectedFoods.includes(food);
                      return (
                        <TouchableOpacity
                          key={food}
                          style={[
                            styles.foodOption,
                            isSelected && styles.foodOptionSelected,
                          ]}
                          onPress={() => toggleFoodSelection(food)}
                        >
                          <Text
                            style={[
                              styles.foodOptionText,
                              isSelected && styles.foodOptionTextSelected,
                            ]}
                          >
                            {food}
                          </Text>
                          {isSelected && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={closeModal}
                >
                  <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleSaveMeal}
                >
                  <Text style={styles.modalButtonTextPrimary}>
                    {editingMeal ? "Update" : "Create"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
