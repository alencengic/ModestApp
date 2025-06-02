import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Picker } from "@react-native-picker/picker";
import {
  getFoodMoodCorrelationData,
  FoodMoodCorrelation,
} from "@/storage/database";
import { styles as externalStyles } from "./MoodAnalyticsScreen.styles";

export interface MoodDataItem {
  date: string;
  mood: string;
  color: string;
  value: number;
}

const PICKER_PLACEHOLDER_VALUE = "##PICKER_PLACEHOLDER##";

const MoodAnalyticsScreen: React.FC = () => {
  const POSITIVE_MOOD_COLOR = "#3CB371";
  const NEUTRAL_MOOD_COLOR = "#A9A9A9";
  const NEGATIVE_MOOD_COLOR = "#CD5C5C";

  const useQueryFoodMoodCorrelation = (minOccurrences: number = 3) => {
    return {
      queryKey: ["foodMoodCorrelation"],
      queryFn: async () => getFoodMoodCorrelationData(minOccurrences),
    };
  };

  const foodMoodQueryOptions = useQueryFoodMoodCorrelation(3);
  const {
    data: rawFoodMoodData = [],
    isLoading: isLoadingFoodMood,
    isError: isErrorFoodMood,
    error: foodMoodQueryError,
  } = useQuery<FoodMoodCorrelation[], Error>(foodMoodQueryOptions);

  const getMoodCategory = (score: number): string => {
    if (score > 0.2) return "Positive";
    if (score < -0.2) return "Negative";
    return "Neutral";
  };

  const getMoodColor = (score: number): string => {
    if (score > 0.2) return POSITIVE_MOOD_COLOR;
    if (score < -0.2) return NEGATIVE_MOOD_COLOR;
    return NEUTRAL_MOOD_COLOR;
  };

  const topPositiveFoods: FoodMoodCorrelation[] = useMemo(() => {
    return (rawFoodMoodData || [])
      .filter((item) => item.averageMoodScore > 0.2)
      .sort((a, b) => b.averageMoodScore - a.averageMoodScore)
      .slice(0, 6);
  }, [rawFoodMoodData]);

  const topNegativeFoods: FoodMoodCorrelation[] = useMemo(() => {
    return (rawFoodMoodData || [])
      .filter((item) => item.averageMoodScore < -0.2)
      .sort((a, b) => a.averageMoodScore - b.averageMoodScore)
      .slice(0, 6);
  }, [rawFoodMoodData]);

  const allFoodNamesForPicker: string[] = useMemo(() => {
    const foodNames = new Set(
      (rawFoodMoodData || []).map((item) => item.foodName)
    );
    return Array.from(foodNames).sort();
  }, [rawFoodMoodData]);

  const [selectedFoodName, setSelectedFoodName] = useState<string | null>(null);

  const selectedFoodRawDetails: FoodMoodCorrelation | undefined =
    useMemo(() => {
      if (!selectedFoodName) return undefined;
      return (rawFoodMoodData || []).find(
        (item) => item.foodName === selectedFoodName
      );
    }, [rawFoodMoodData, selectedFoodName]);

  const FoodListItemDetail: React.FC<{
    item: FoodMoodCorrelation;
    isLastItem?: boolean;
  }> = ({ item, isLastItem = false }) => {
    const moodScore = item.averageMoodScore;
    const moodColor = getMoodColor(moodScore);
    const moodCategory = getMoodCategory(moodScore);

    return (
      <View
        style={[
          externalStyles.foodListItem,
          isLastItem && externalStyles.foodListItemLast,
        ]}
      >
        <Text style={externalStyles.foodListItemName}>{item.foodName}</Text>
        <View style={externalStyles.detailRow}>
          <Text style={externalStyles.detailLabel}>Avg. Mood Score:</Text>
          <Text
            style={[
              externalStyles.detailValue,
              { color: moodColor, fontWeight: "bold" },
            ]}
          >
            {moodScore.toFixed(2)}
          </Text>
        </View>
        <View style={externalStyles.detailRow}>
          <Text style={externalStyles.detailLabel}>Mood Category:</Text>
          <Text style={[externalStyles.detailValue, { color: moodColor }]}>
            {moodCategory}
          </Text>
        </View>
        <View style={externalStyles.detailRow}>
          <Text style={externalStyles.detailLabel}>Occurrences:</Text>
          <Text style={externalStyles.detailValue}>{item.occurrences}</Text>
        </View>
        <View style={externalStyles.moodIndicatorRow}>
          <Text style={externalStyles.detailLabel}>Mood Association:</Text>
          <View
            style={[
              externalStyles.moodIndicatorSwatch,
              { backgroundColor: moodColor },
            ]}
          />
        </View>
      </View>
    );
  };

  if (isLoadingFoodMood) {
    return (
      <SafeAreaView style={externalStyles.container}>
        <View style={externalStyles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={externalStyles.centeredText}>
            Loading food & mood insights...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isErrorFoodMood) {
    return (
      <SafeAreaView style={externalStyles.container}>
        <View style={externalStyles.centered}>
          <Text style={externalStyles.errorText}>
            Error loading food-mood data. {foodMoodQueryError?.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={externalStyles.container}>
      <ScrollView>
        <View style={externalStyles.chartWrapper}>
          <Text style={externalStyles.chartSectionTitle}>
            Explore Specific Food
          </Text>
          <View style={externalStyles.pickerContainer}>
            <Picker
              selectedValue={
                selectedFoodName === null
                  ? PICKER_PLACEHOLDER_VALUE
                  : selectedFoodName
              }
              onValueChange={(itemValue) => {
                if (itemValue === PICKER_PLACEHOLDER_VALUE) {
                  setSelectedFoodName(null);
                } else {
                  setSelectedFoodName(itemValue as string);
                }
              }}
              style={externalStyles.picker}
              mode="dropdown"
              prompt="Select a food"
            >
              <Picker.Item
                label="-- All Foods --"
                value={PICKER_PLACEHOLDER_VALUE}
              />
              {allFoodNamesForPicker.map((name) => (
                <Picker.Item key={name} label={name} value={name} />
              ))}
            </Picker>
          </View>

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

        <View style={externalStyles.chartWrapper}>
          <Text style={externalStyles.chartSectionTitle}>
            Top Positive Mood Foods
          </Text>
          {topPositiveFoods.length > 0 ? (
            topPositiveFoods.map((food, index) => (
              <FoodListItemDetail
                key={food.foodName + food.averageMoodScore + "positive"}
                item={food}
                isLastItem={index === topPositiveFoods.length - 1}
              />
            ))
          ) : (
            <View style={externalStyles.centered}>
              <Text style={externalStyles.centeredText}>
                Not enough data for positive mood foods.
              </Text>
            </View>
          )}
        </View>

        <View style={externalStyles.chartWrapper}>
          <Text style={externalStyles.chartSectionTitle}>
            Top Negative Mood Foods
          </Text>
          {topNegativeFoods.length > 0 ? (
            topNegativeFoods.map((food, index) => (
              <FoodListItemDetail
                key={food.foodName + food.averageMoodScore + "negative"}
                item={food}
                isLastItem={index === topNegativeFoods.length - 1}
              />
            ))
          ) : (
            <View style={externalStyles.centered}>
              <Text style={externalStyles.centeredText}>
                Not enough data for negative mood foods.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodAnalyticsScreen;
