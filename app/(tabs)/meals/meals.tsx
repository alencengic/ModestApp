import React, { useState, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "./MealsScreen.styles";
import {
  useGetAllMeals,
  useInsertMeal,
  useUpdateMeal,
  useDeleteMeal,
} from "@/hooks/queries/useMeals";
import { getMealFoodsArray, type Meal, type MealType } from "@/storage/meals";
import { getCommonFoods } from "@/constants/FoodDatabase";
import { useLanguage } from "@/context/LanguageContext";

const MEAL_TYPE_OPTIONS: { value: MealType; label: string; emoji: string }[] = [
  { value: null, label: "Any", emoji: "🍽️" },
  { value: "breakfast", label: "Breakfast", emoji: "☀️" },
  { value: "lunch", label: "Lunch", emoji: "🌤️" },
  { value: "dinner", label: "Dinner", emoji: "🌙" },
  { value: "snacks", label: "Snacks", emoji: "🍎" },
];

const ITEMS_PER_PAGE = 10;

export default function MealsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { currentLanguage } = useLanguage();
  const COMMON_FOODS = getCommonFoods();

  const [filterType, setFilterType] = useState<MealType>(null);
  const [mealSearchQuery, setMealSearchQuery] = useState("");
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [showModal, setShowModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [mealName, setMealName] = useState("");
  const [selectedType, setSelectedType] = useState<MealType>(null);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [showFoodPicker, setShowFoodPicker] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const [customFoodInput, setCustomFoodInput] = useState("");

  const modalScrollViewRef = React.useRef<ScrollView>(null);
  const selectedFoodsRef = React.useRef<View>(null);
  const [selectedFoodsPosition, setSelectedFoodsPosition] = useState(0);

  const { data: meals = [], isLoading, refetch } = useGetAllMeals();
  const insertMeal = useInsertMeal();
  const updateMeal = useUpdateMeal();
  const deleteMeal = useDeleteMeal();

  // Filter and search meals
  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      // Filter by type
      if (filterType && meal.meal_type !== filterType) return false;

      // Search by meal name or foods
      if (mealSearchQuery) {
        const query = mealSearchQuery.toLowerCase();
        const nameMatch = meal.name.toLowerCase().includes(query);
        const foodsMatch = getMealFoodsArray(meal).some(food =>
          food.toLowerCase().includes(query)
        );
        return nameMatch || foodsMatch;
      }

      return true;
    });
  }, [meals, filterType, mealSearchQuery]);

  // Reset visible items when filters change
  React.useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [filterType, mealSearchQuery]);

  // Paginated meals
  const paginatedMeals = useMemo(() => {
    return filteredMeals.slice(0, visibleItems);
  }, [filteredMeals, visibleItems]);

  const hasMore = filteredMeals.length > visibleItems;

  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + ITEMS_PER_PAGE, filteredMeals.length));
  };

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
    setCustomFoodInput("");
  };

  const addCustomFood = () => {
    const trimmedFood = customFoodInput.trim();
    if (!trimmedFood) {
      Alert.alert("Error", "Please enter a food name");
      return;
    }

    if (selectedFoods.includes(trimmedFood)) {
      Alert.alert("Info", "This food is already added");
      return;
    }

    setSelectedFoods([...selectedFoods, trimmedFood]);
    setCustomFoodInput("");

    // Scroll to show the selected foods section
    setTimeout(() => {
      if (modalScrollViewRef.current && selectedFoodsPosition > 0) {
        modalScrollViewRef.current.scrollTo({
          y: Math.max(0, selectedFoodsPosition - 20),
          animated: true
        });
      }
    }, 100);
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

      // Scroll to show the selected foods section when adding
      setTimeout(() => {
        if (modalScrollViewRef.current && selectedFoodsPosition > 0) {
          modalScrollViewRef.current.scrollTo({
            y: Math.max(0, selectedFoodsPosition - 20),
            animated: true
          });
        }
      }, 100);
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

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={mealSearchQuery}
            onChangeText={setMealSearchQuery}
            placeholder="Search meals by name or food..."
            placeholderTextColor={theme.colors.textSecondary}
          />
          {mealSearchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => setMealSearchQuery("")}
            >
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
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
              {mealSearchQuery
                ? `No meals found matching "${mealSearchQuery}"`
                : "No meals created yet.\nCreate your first meal template to quickly log your food!"}
            </Text>
          </View>
        ) : (
          <View style={styles.mealsContainer}>
            {paginatedMeals.map((meal) => {
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
            {hasMore && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={loadMore}
              >
                <Text style={styles.loadMoreText}>
                  Load More ({filteredMeals.length - visibleItems} remaining)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Create/Edit Meal Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingMeal ? "Edit Meal" : "Create New Meal"}
              </Text>
              <ScrollView
                ref={modalScrollViewRef}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 20 }}
              >

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
              <View
                ref={selectedFoodsRef}
                collapsable={false}
                onLayout={(event) => {
                  const { y } = event.nativeEvent.layout;
                  setSelectedFoodsPosition(y);
                }}
              >
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
              </View>

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
                  {/* Add Custom Food */}
                  <View style={styles.customFoodContainer}>
                    <TextInput
                      style={[styles.searchInput, { flex: 1 }]}
                      value={customFoodInput}
                      onChangeText={setCustomFoodInput}
                      placeholder="Add custom food..."
                      placeholderTextColor={theme.colors.textSecondary}
                      returnKeyType="done"
                      onSubmitEditing={addCustomFood}
                    />
                    <TouchableOpacity
                      style={styles.addCustomFoodButton}
                      onPress={addCustomFood}
                    >
                      <Text style={styles.addCustomFoodText}>Add</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Search Common Foods */}
                  <TextInput
                    style={styles.searchInput}
                    value={foodSearchQuery}
                    onChangeText={setFoodSearchQuery}
                    placeholder="Search common foods..."
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                  <ScrollView style={styles.foodList} nestedScrollEnabled keyboardShouldPersistTaps="handled">
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
            </ScrollView>

              {/* Action Buttons - Fixed at bottom */}
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
            </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
