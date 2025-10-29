import React, { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import {
  getFoodMoodCorrelationData,
  getFoodProductivityCorrelationData,
  FoodMoodCorrelation,
  FoodProductivityCorrelation,
} from "@/storage/database";
import { createStyles } from "./FoodImpactAnalysisScreen.styles";
import { useTheme } from "@/context/ThemeContext";
import { scaleFontSize } from "@/utils/responsive";

type CorrelationType = "mood" | "productivity";

const FoodImpactAnalysisScreen: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const externalStyles = createStyles(theme);
  const POSITIVE_COLOR = "#3CB371";
  const NEUTRAL_COLOR = "#A9A9A9";
  const NEGATIVE_COLOR = "#CD5C5C";

  const [correlationType, setCorrelationType] = useState<CorrelationType>("mood");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [selectedFoodName, setSelectedFoodName] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"all" | "week" | "month" | "custom">("all");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const useQueryFoodCorrelation = () => {
    return {
      queryKey: ["foodCorrelation", correlationType],
      queryFn: async () => {
        return correlationType === "mood"
          ? getFoodMoodCorrelationData()
          : getFoodProductivityCorrelationData();
      },
    };
  };

  const correlationQueryOptions = useQueryFoodCorrelation();
  const {
    data: rawData = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<(FoodMoodCorrelation | FoodProductivityCorrelation)[], Error>({
    ...correlationQueryOptions,
    placeholderData: (previousData) => previousData,
  });

  const getScore = (item: FoodMoodCorrelation | FoodProductivityCorrelation) => {
    return "averageMoodScore" in item
      ? item.averageMoodScore
      : item.averageProductivityScore;
  };

  const getCategory = (score: number): string => {
    if (score > 0.2) return "Positive";
    if (score < -0.2) return "Negative";
    return "Neutral";
  };

  const getColor = (score: number): string => {
    if (score > 0.2) return POSITIVE_COLOR;
    if (score < -0.2) return NEGATIVE_COLOR;
    return NEUTRAL_COLOR;
  };

  const topPositiveFoods = useMemo(() => {
    return (rawData || [])
      .filter((item) => getScore(item) > 0.2)
      .sort((a, b) => getScore(b) - getScore(a))
      .slice(0, 6);
  }, [rawData]);

  const topNegativeFoods = useMemo(() => {
    return (rawData || [])
      .filter((item) => getScore(item) < -0.2)
      .sort((a, b) => getScore(a) - getScore(b))
      .slice(0, 6);
  }, [rawData]);

  const allFoodNamesForPicker: string[] = useMemo(() => {
    const foodNames = new Set((rawData || []).map((item) => item.foodName));
    return Array.from(foodNames).sort();
  }, [rawData]);

  // Reset selected food when correlation type changes
  useEffect(() => {
    setSelectedFoodName(null);
  }, [correlationType]);

  const selectedFoodRawDetails = useMemo(() => {
    if (!selectedFoodName) return undefined;
    return (rawData || []).find((item) => item.foodName === selectedFoodName);
  }, [rawData, selectedFoodName]);

  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return allFoodNamesForPicker;
    return allFoodNamesForPicker.filter((food) =>
      food.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allFoodNamesForPicker, searchQuery]);

  // Convert score to user-friendly description
  const getScoreDescription = (score: number): string => {
    const absScore = Math.abs(score);

    if (absScore <= 0.2) {
      return "No clear impact";
    }

    // For both mood and productivity, higher is better
    if (score > 0.6) return "Strong positive effect";
    if (score > 0.4) return "Moderate positive effect";
    if (score > 0.2) return "Slight positive effect";
    if (score < -0.6) return "Strong negative effect";
    if (score < -0.4) return "Moderate negative effect";
    return "Slight negative effect";
  };

  // Get impact level (0-5)
  const getImpactLevel = (score: number): number => {
    const absScore = Math.abs(score);
    if (absScore < 0.2) return 0;
    if (absScore < 0.3) return 1;
    if (absScore < 0.5) return 2;
    if (absScore < 0.7) return 3;
    if (absScore < 0.9) return 4;
    return 5;
  };

  // Get impact stars
  const getImpactStars = (score: number): string => {
    const level = getImpactLevel(score);
    return "●".repeat(level) + "○".repeat(5 - level);
  };

  const FoodListItemDetail: React.FC<{
    item: FoodMoodCorrelation | FoodProductivityCorrelation;
    isLastItem?: boolean;
  }> = ({ item, isLastItem = false }) => {
    const score = getScore(item);
    const color = getColor(score);
    const description = getScoreDescription(score);
    const stars = getImpactStars(score);
    const percentage = Math.abs(score / 1) * 100;

    return (
      <View
        style={[
          externalStyles.foodListItem,
          isLastItem && externalStyles.foodListItemLast,
        ]}
      >
        <Text style={externalStyles.foodListItemName}>{item.foodName}</Text>

        {/* Impact Description */}
        <View style={externalStyles.impactDescriptionContainer}>
          <Text style={[externalStyles.impactDescription, { color }]}>
            {description}
          </Text>
          <Text style={externalStyles.impactStars}>
            {stars}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={externalStyles.progressBarContainer}>
          <View style={externalStyles.progressBarTrack}>
            <View
              style={[
                externalStyles.progressBarFill,
                {
                  width: `${Math.min(percentage * 100, 100)}%`,
                  backgroundColor: color,
                },
              ]}
            />
          </View>
        </View>

        <View style={externalStyles.detailRow}>
          <Text style={externalStyles.detailLabel}>📊 Logged:</Text>
          <Text style={externalStyles.detailValue}>{item.occurrences} times</Text>
        </View>
      </View>
    );
  };

  // Only show loading screen if there's no data at all (initial load)
  if (isLoading && rawData.length === 0) {
    return (
      <SafeAreaView style={externalStyles.container}>
        <View style={externalStyles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={externalStyles.centeredText}>
            Loading food correlation data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={externalStyles.container}>
        <View style={externalStyles.centered}>
          <Text style={externalStyles.errorText}>
            Error loading data. {error?.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={externalStyles.container}>
      <ScrollView>
        <View style={externalStyles.header}>
          <TouchableOpacity onPress={() => router.push("/(tabs)/mood/analytics")} style={externalStyles.backButton}>
            <Text style={externalStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={externalStyles.headerTopRow}>
            <View style={{ width: 40 }} />
            <Text style={externalStyles.headerEmoji}>🍎</Text>
            <TouchableOpacity
              style={externalStyles.infoButton}
              onPress={() => setIsInfoModalVisible(true)}
            >
              <Text style={externalStyles.infoButtonText}>ⓘ</Text>
            </TouchableOpacity>
          </View>
          <Text style={externalStyles.headerTitle}>
            Food Impact Analysis
          </Text>
          <Text style={externalStyles.headerDescription}>
            Discover which foods positively or negatively affect your mood and productivity levels
          </Text>
        </View>

        <View style={externalStyles.chartWrapper}>
          <Text style={externalStyles.chartSectionTitle}>Time Period</Text>
          <View style={externalStyles.buttonGroup}>
            <TouchableOpacity
              style={[
                externalStyles.filterButton,
                dateRange === "all" && externalStyles.filterButtonActive,
              ]}
              onPress={() => setDateRange("all")}
            >
              <Text
                style={[
                  externalStyles.filterButtonText,
                  dateRange === "all" && externalStyles.filterButtonTextActive,
                ]}
              >
                All Time
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                externalStyles.filterButton,
                dateRange === "week" && externalStyles.filterButtonActive,
              ]}
              onPress={() => setDateRange("week")}
            >
              <Text
                style={[
                  externalStyles.filterButtonText,
                  dateRange === "week" && externalStyles.filterButtonTextActive,
                ]}
              >
                This Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                externalStyles.filterButton,
                dateRange === "month" && externalStyles.filterButtonActive,
              ]}
              onPress={() => setDateRange("month")}
            >
              <Text
                style={[
                  externalStyles.filterButtonText,
                  dateRange === "month" && externalStyles.filterButtonTextActive,
                ]}
              >
                This Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                externalStyles.filterButton,
                dateRange === "custom" && externalStyles.filterButtonActive,
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={[
                  externalStyles.filterButtonText,
                  dateRange === "custom" && externalStyles.filterButtonTextActive,
                ]}
              >
                Custom
              </Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedDate(date);
                  setDateRange("custom");
                }
              }}
            />
          )}
          {dateRange === "custom" && (
            <View style={externalStyles.selectedDateDisplay}>
              <Text style={externalStyles.selectedDateText}>
                Selected: {selectedDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          )}
        </View>

        <View style={externalStyles.chartWrapper}>
          <Text style={externalStyles.chartSectionTitle}>Correlation Type</Text>
          <View style={externalStyles.toggleContainer}>
            <TouchableOpacity
              style={[
                externalStyles.toggleButton,
                correlationType === "mood" && externalStyles.toggleButtonActive,
              ]}
              onPress={() => setCorrelationType("mood")}
            >
              <Text
                style={[
                  externalStyles.toggleButtonText,
                  correlationType === "mood" &&
                    externalStyles.toggleButtonTextActive,
                ]}
              >
                Mood
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                externalStyles.toggleButton,
                correlationType === "productivity" &&
                  externalStyles.toggleButtonActive,
              ]}
              onPress={() => setCorrelationType("productivity")}
            >
              <Text
                style={[
                  externalStyles.toggleButtonText,
                  correlationType === "productivity" &&
                    externalStyles.toggleButtonTextActive,
                ]}
              >
                Productivity
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={externalStyles.chartWrapper}>
          <Text style={externalStyles.chartSectionTitle}>
            Explore Specific Food
          </Text>
          <TouchableOpacity
            style={externalStyles.foodSelectorButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={externalStyles.foodSelectorButtonText}>
              {selectedFoodName || "Select a food..."}
            </Text>
            <Text style={externalStyles.foodSelectorButtonIcon}>▼</Text>
          </TouchableOpacity>

          {selectedFoodName && (
            <TouchableOpacity
              style={externalStyles.clearButton}
              onPress={() => setSelectedFoodName(null)}
            >
              <Text style={externalStyles.clearButtonText}>Clear Selection</Text>
            </TouchableOpacity>
          )}

          {selectedFoodRawDetails && (
            <FoodListItemDetail
              item={selectedFoodRawDetails}
              isLastItem={true}
            />
          )}
          {selectedFoodName && !selectedFoodRawDetails && (
            <Text style={{ padding: 10, color: "orange", textAlign: "center" }}>
              No detailed correlation data found for {selectedFoodName}.
            </Text>
          )}
        </View>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={externalStyles.modalOverlay}>
              <View style={externalStyles.modalContainer}>
                <View style={externalStyles.modalHeader}>
                  <Text style={externalStyles.modalTitle}>Select Food</Text>
                  <Pressable
                    style={externalStyles.modalCloseButton}
                    onPress={() => {
                      setIsModalVisible(false);
                      setSearchQuery("");
                    }}
                  >
                    <Text style={externalStyles.modalCloseButtonText}>✕</Text>
                  </Pressable>
                </View>

                <TextInput
                  style={externalStyles.searchInput}
                  placeholder="Search foods..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                  placeholderTextColor="#999"
                />

                <FlatList
                  data={filteredFoods}
                  keyExtractor={(item) => item}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        externalStyles.foodItem,
                        selectedFoodName === item &&
                          externalStyles.foodItemSelected,
                      ]}
                      onPress={() => {
                        Keyboard.dismiss();
                        setSelectedFoodName(item);
                        setIsModalVisible(false);
                        setSearchQuery("");
                      }}
                    >
                      <Text
                        style={[
                          externalStyles.foodItemText,
                          selectedFoodName === item &&
                            externalStyles.foodItemTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={externalStyles.centered}>
                      <Text style={externalStyles.centeredText}>
                        No foods found
                      </Text>
                    </View>
                  }
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <View style={externalStyles.chartWrapper}>
          <Text style={externalStyles.chartSectionTitle}>
            Top Positive Foods
          </Text>
          {topPositiveFoods.length > 0 ? (
            topPositiveFoods.map((food, index) => (
              <FoodListItemDetail
                key={food.foodName + index + "positive"}
                item={food}
                isLastItem={index === topPositiveFoods.length - 1}
              />
            ))
          ) : (
            <View style={externalStyles.centered}>
              <Text style={externalStyles.centeredText}>
                Not enough data for positive foods.
              </Text>
            </View>
          )}
        </View>

        <View style={externalStyles.chartWrapper}>
          <Text style={externalStyles.chartSectionTitle}>
            Top Negative Foods
          </Text>
          {topNegativeFoods.length > 0 ? (
            topNegativeFoods.map((food, index) => (
              <FoodListItemDetail
                key={food.foodName + index + "negative"}
                item={food}
                isLastItem={index === topNegativeFoods.length - 1}
              />
            ))
          ) : (
            <View style={externalStyles.centered}>
              <Text style={externalStyles.centeredText}>
                Not enough data for negative foods.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isInfoModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsInfoModalVisible(false)}
      >
        <View style={externalStyles.infoModalOverlay}>
          <View style={externalStyles.infoModalContainer}>
            <View style={externalStyles.modalHeader}>
              <Text style={externalStyles.modalTitle}>How Food Analysis Works</Text>
              <Pressable
                style={externalStyles.modalCloseButton}
                onPress={() => setIsInfoModalVisible(false)}
              >
                <Text style={externalStyles.modalCloseButtonText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={externalStyles.infoModalContent}>
              <Text style={externalStyles.infoText}>
                This analysis shows which foods correlate with better or worse mood and productivity based on your personal data.
              </Text>

              <View style={externalStyles.colorExplanation}>
                <View style={externalStyles.colorRow}>
                  <View
                    style={[
                      externalStyles.colorDot,
                      { backgroundColor: POSITIVE_COLOR },
                    ]}
                  />
                  <Text style={externalStyles.colorLabel}>
                    <Text style={{ fontWeight: "bold" }}>Positive ({">"} 0.2):</Text> Associated with better mood/productivity
                  </Text>
                </View>

                <View style={externalStyles.colorRow}>
                  <View
                    style={[
                      externalStyles.colorDot,
                      { backgroundColor: NEUTRAL_COLOR },
                    ]}
                  />
                  <Text style={externalStyles.colorLabel}>
                    <Text style={{ fontWeight: "bold" }}>Neutral (-0.2 to 0.2):</Text> No significant correlation
                  </Text>
                </View>

                <View style={externalStyles.colorRow}>
                  <View
                    style={[
                      externalStyles.colorDot,
                      { backgroundColor: NEGATIVE_COLOR },
                    ]}
                  />
                  <Text style={externalStyles.colorLabel}>
                    <Text style={{ fontWeight: "bold" }}>Negative ({"<"} -0.2):</Text> Associated with worse mood/productivity
                  </Text>
                </View>
              </View>

              <Text style={externalStyles.infoText}>
                <Text style={{ fontWeight: "bold" }}>How it works:{"\n"}</Text>
                The app analyzes your food entries and mood/productivity ratings to calculate average scores. Higher scores indicate a positive correlation, while lower scores suggest a negative impact.
              </Text>

              <Text style={externalStyles.infoNote}>
                Note: These correlations are based on your personal data. More entries lead to more accurate insights.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FoodImpactAnalysisScreen;
