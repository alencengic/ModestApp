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
  getFoodProductivityCorrelationData,
  FoodMoodCorrelation,
  FoodProductivityCorrelation,
} from "@/storage/database";
import { styles as externalStyles } from "./MoodAnalyticsScreen.styles";
import { BrightTheme } from "@/constants/Theme";
import { BannerAd, VideoAd } from "@/components/ads";

const PICKER_PLACEHOLDER_VALUE = "##PICKER_PLACEHOLDER##";

type CorrelationType = "mood" | "productivity";

const MoodAnalyticsScreen: React.FC = () => {
  const POSITIVE_COLOR = "#3CB371";
  const NEUTRAL_COLOR = "#A9A9A9";
  const NEGATIVE_COLOR = "#CD5C5C";

  const [correlationType, setCorrelationType] =
    useState<CorrelationType>("mood");

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
  } = useQuery<(FoodMoodCorrelation | FoodProductivityCorrelation)[], Error>(
    correlationQueryOptions
  );
  console.log(rawData);
  const getScore = (
    item: FoodMoodCorrelation | FoodProductivityCorrelation
  ) => {
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

  const [selectedFoodName, setSelectedFoodName] = useState<string | null>(null);

  const selectedFoodRawDetails = useMemo(() => {
    if (!selectedFoodName) return undefined;
    return (rawData || []).find((item) => item.foodName === selectedFoodName);
  }, [rawData, selectedFoodName]);

  const FoodListItemDetail: React.FC<{
    item: FoodMoodCorrelation | FoodProductivityCorrelation;
    isLastItem?: boolean;
  }> = ({ item, isLastItem = false }) => {
    const score = getScore(item);
    const color = getColor(score);
    const category = getCategory(score);
    const label =
      correlationType === "mood"
        ? "Avg. Mood Score"
        : "Avg. Productivity Score";

    return (
      <View
        style={[
          externalStyles.foodListItem,
          isLastItem && externalStyles.foodListItemLast,
        ]}
      >
        <Text style={externalStyles.foodListItemName}>{item.foodName}</Text>
        <View style={externalStyles.detailRow}>
          <Text style={externalStyles.detailLabel}>{label}:</Text>
          <Text
            style={[externalStyles.detailValue, { color, fontWeight: "bold" }]}
          >
            {score.toFixed(2)}
          </Text>
        </View>
        <View style={externalStyles.detailRow}>
          <Text style={externalStyles.detailLabel}>Category:</Text>
          <Text style={[externalStyles.detailValue, { color }]}>
            {category}
          </Text>
        </View>
        <View style={externalStyles.detailRow}>
          <Text style={externalStyles.detailLabel}>Occurrences:</Text>
          <Text style={externalStyles.detailValue}>{item.occurrences}</Text>
        </View>
        <View style={externalStyles.moodIndicatorRow}>
          <Text style={externalStyles.detailLabel}>Association:</Text>
          <View
            style={[
              externalStyles.moodIndicatorSwatch,
              { backgroundColor: color },
            ]}
          />
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={externalStyles.container}>
        <View style={externalStyles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
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
        <View
          style={{
            padding: BrightTheme.spacing.xl,
            alignItems: "center",
            backgroundColor: BrightTheme.colors.background,
          }}
        >
          <Text style={{ fontSize: 48, marginBottom: BrightTheme.spacing.sm }}>
            😊
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "600",
              color: BrightTheme.colors.textPrimary,
              marginBottom: BrightTheme.spacing.xs,
            }}
          >
            Mood Analytics
          </Text>
          <Text
            style={{ fontSize: 14, color: BrightTheme.colors.textSecondary }}
          >
            Discover food-mood patterns
          </Text>
        </View>

        <BannerAd size="small" position="top" />

        <View style={externalStyles.chartWrapper}>
          <Text style={externalStyles.chartSectionTitle}>Correlation Type</Text>
          <View style={externalStyles.pickerContainer}>
            <Picker
              selectedValue={correlationType}
              onValueChange={(value) =>
                setCorrelationType(value as CorrelationType)
              }
              style={externalStyles.picker}
              mode="dropdown"
              prompt="Select correlation type"
            >
              <Picker.Item label="Mood" value="mood" />
              <Picker.Item label="Productivity" value="productivity" />
            </Picker>
          </View>
        </View>

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

        <BannerAd size="medium" position="bottom" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodAnalyticsScreen;
