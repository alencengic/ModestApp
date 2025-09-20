import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productivityRatingStyles } from "./ProductivityRating.styles";

import { DateTime } from "luxon";
import {
  getAllProductivityRatings,
  insertOrUpdateProductivity,
} from "@/storage/productivity_entries";

export const ProductivityRating = () => {
  const [selectedProductivity, setSelectedProductivity] = useState<
    number | null
  >(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (rating: number) =>
      insertOrUpdateProductivity(rating, DateTime.now().toISO()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productivityEntries"] });
      Alert.alert(
        "Productivity Saved",
        "Your productivity for today has been saved."
      );
    },
    onError: (error) => {
      console.log(error);
      Alert.alert(
        "Save Failed",
        "An error occurred while saving your productivity."
      );
    },
  });

  const useQueryFoodCorrelation = () => {
    return {
      queryKey: ["productivityEntries"],
      queryFn: async () => {
        const data = getAllProductivityRatings();
        console.log(data);
        return data;
      },
    };
  };

  const handleProductivityClick = (rating: number) => {
    setSelectedProductivity(rating);
    mutation.mutate(rating);
  };

  return (
    <View style={productivityRatingStyles.productivityContainer}>
      <Text style={productivityRatingStyles.productivityTitle}>
        How productive were you today?
      </Text>
      <View style={productivityRatingStyles.productivityButtons}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            onPress={() => handleProductivityClick(rating)}
            style={[
              productivityRatingStyles.productivityButton,
              selectedProductivity === rating &&
                productivityRatingStyles.selectedProductivity,
            ]}
          >
            <Text style={productivityRatingStyles.productivityText}>
              {rating}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedProductivity && (
        <Text style={productivityRatingStyles.selectedProductivityText}>
          You selected: {selectedProductivity}
        </Text>
      )}
    </View>
  );
};
