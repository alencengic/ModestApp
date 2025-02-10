import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { productivityRatingStyles } from "./ProductivityRating.styles";

export const ProductivityRating = () => {
  const [selectedProductivity, setSelectedProductivity] = useState<
    number | null
  >(null);

  const handleProductivityClick = (rating: number) => {
    setSelectedProductivity(rating);
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
