import React from "react";
import { RatingComponent, RatingOption } from "@/components/RatingComponent";
import { productivityRatingStyles } from "./ProductivityRating.styles";
import { DateTime } from "luxon";
import { insertOrUpdateProductivity } from "@/storage/productivity_entries";

const productivityOptions: RatingOption<number>[] = [1, 2, 3, 4, 5].map(
  (rating) => ({
    value: rating,
    display: String(rating),
    label: String(rating),
  })
);

export const ProductivityRating = () => {
  const handleSave = async (rating: number) => {
    await insertOrUpdateProductivity(rating, DateTime.now().toISO());
  };

  return (
    <RatingComponent
      title="How productive were you today?"
      options={productivityOptions}
      onSave={handleSave}
      queryKeys={[["productivityEntries"]]}
      successMessage="Your productivity for today has been saved."
      errorMessage="An error occurred while saving your productivity."
      containerStyle={productivityRatingStyles.productivityContainer}
      titleStyle={productivityRatingStyles.productivityTitle}
      buttonContainerStyle={productivityRatingStyles.productivityButtons}
      buttonStyle={productivityRatingStyles.productivityButton}
      selectedButtonStyle={productivityRatingStyles.selectedProductivity}
      displayTextStyle={productivityRatingStyles.productivityText}
      selectedTextStyle={productivityRatingStyles.selectedProductivityText}
    />
  );
};
