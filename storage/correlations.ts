import { openDatabase } from "./db_connection";
import { FoodIntake } from "./food_intakes";

export interface FoodMoodCorrelation {
  foodName: string;
  averageMoodScore: number;
  occurrences: number;
}

export interface MoodRating {
  id: number;
  mood: string;
  date: string;
}

const MOOD_SCORE_MAP: Record<string, number> = {
  Sad: -2,
  Neutral: 0,
  Happy: 1,
  "Very Happy": 2,
  Ecstatic: 3,
};

const splitMealItems = (mealString: string | null | undefined): string[] => {
  if (!mealString) {
    return [];
  }
  return mealString
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

export const getFoodMoodCorrelationData = async (): Promise<
  FoodMoodCorrelation[]
> => {
  const db = await openDatabase();

  const foodIntakes: FoodIntake[] = await db.getAllAsync(
    "SELECT * FROM food_intakes"
  );
  const moodRatings: MoodRating[] = await db.getAllAsync(
    "SELECT * FROM mood_ratings"
  );

  if (!foodIntakes.length || !moodRatings.length) {
    return [];
  }

  const moodByDate: Record<string, number> = {};
  moodRatings.forEach((rating) => {
    if (MOOD_SCORE_MAP[rating.mood] !== undefined) {
      moodByDate[rating.date] = MOOD_SCORE_MAP[rating.mood];
    }
  });

  const foodStats: Record<
    string,
    { sumMoodScore: number; occurrences: number }
  > = {};

  foodIntakes.forEach((intake) => {
    const moodScore = moodByDate[intake.date];
    if (moodScore === undefined) {
      return;
    }

    const meals = [
      intake.breakfast,
      intake.lunch,
      intake.dinner,
      intake.snacks,
    ];

    meals.forEach((mealString) => {
      const items = splitMealItems(mealString);
      items.forEach((item) => {
        if (!foodStats[item]) {
          foodStats[item] = { sumMoodScore: 0, occurrences: 0 };
        }
        foodStats[item].sumMoodScore += moodScore;
        foodStats[item].occurrences += 1;
      });
    });
  });

  return Object.entries(foodStats).map(([foodName, stats]) => ({
    foodName,
    averageMoodScore: stats.sumMoodScore / stats.occurrences,
    occurrences: stats.occurrences,
  }));
};

import { SymptomRow, BloatingLevel } from "./symptom_entries";

export type SymptomType =
  | "bloating"
  | "energy"
  | "stool_consistency"
  | "diarrhea"
  | "nausea"
  | "pain";

export interface FoodSymptomCorrelation {
  foodName: string;
  averageSymptomScore: number;
  occurrences: number;
}

const BLOATING_TO_NUM: Record<BloatingLevel, 0 | 1 | 2 | 3> = {
  None: 0,
  Mild: 1,
  Moderate: 2,
  Severe: 3,
};

const calculateSymptomScore = (
  symptom: SymptomRow,
  symptomType: SymptomType
): number => {
  switch (symptomType) {
    case "bloating":
      return BLOATING_TO_NUM[symptom.bloating] || 0;
    case "energy":
      return symptom.energy;
    case "stool_consistency":
      return symptom.stool_consistency;
    case "diarrhea":
      return symptom.diarrhea;
    case "nausea":
      return symptom.nausea;
    case "pain":
      return symptom.pain;
    default:
      return 0;
  }
};

export const getFoodSymptomCorrelationData = async (
  symptomType: SymptomType
): Promise<FoodSymptomCorrelation[]> => {
  const db = await openDatabase();

  const foodIntakes: FoodIntake[] = await db.getAllAsync(
    "SELECT * FROM food_intakes"
  );
  const symptoms: SymptomRow[] = await db.getAllAsync(
    "SELECT * FROM symptom_entries"
  );

  if (!foodIntakes.length || !symptoms.length) {
    return [];
  }

  const symptomsByDate: Record<string, { totalScore: number; count: number }> =
    {};
  symptoms.forEach((symptom) => {
    const date = symptom.created_at.split("T")[0];
    if (!symptomsByDate[date]) {
      symptomsByDate[date] = { totalScore: 0, count: 0 };
    }
    symptomsByDate[date].totalScore += calculateSymptomScore(
      symptom,
      symptomType
    );
    symptomsByDate[date].count += 1;
  });

  const averageSymptomScoreByDate: Record<string, number> = {};
  for (const date in symptomsByDate) {
    averageSymptomScoreByDate[date] =
      symptomsByDate[date].totalScore / symptomsByDate[date].count;
  }

  const foodStats: Record<
    string,
    { sumSymptomScore: number; occurrences: number }
  > = {};

  foodIntakes.forEach((intake) => {
    const symptomScore = averageSymptomScoreByDate[intake.date];
    if (symptomScore === undefined) {
      return;
    }

    const meals = [
      intake.breakfast,
      intake.lunch,
      intake.dinner,
      intake.snacks,
    ];

    meals.forEach((mealString) => {
      const items = splitMealItems(mealString);
      items.forEach((item) => {
        if (!foodStats[item]) {
          foodStats[item] = { sumSymptomScore: 0, occurrences: 0 };
        }
        foodStats[item].sumSymptomScore += symptomScore;
        foodStats[item].occurrences += 1;
      });
    });
  });

  return Object.entries(foodStats).map(([foodName, stats]) => ({
    foodName,
    averageSymptomScore: stats.sumSymptomScore / stats.occurrences,
    occurrences: stats.occurrences,
  }));
};

export interface ProductivityRating {
  id: number;
  rating: number;
  date: string;
}

export interface FoodProductivityCorrelation {
  foodName: string;
  averageProductivityScore: number;
  occurrences: number;
}

export const getFoodProductivityCorrelationData = async (): Promise<
  FoodProductivityCorrelation[]
> => {
  const db = await openDatabase();

  const foodIntakes: FoodIntake[] = await db.getAllAsync(
    "SELECT * FROM food_intakes"
  );
  const productivityRatings: ProductivityRating[] = await db.getAllAsync(
    "SELECT * FROM productivity_ratings"
  );

  if (!foodIntakes.length || !productivityRatings.length) return [];

  const prodByDate: Record<string, number> = {};
  productivityRatings.forEach((rating) => {
    if (typeof rating.rating === "number") {
      prodByDate[rating.date] = rating.rating;
    }
  });

  const foodStats: Record<
    string,
    { sumProductivity: number; occurrences: number }
  > = {};

  foodIntakes.forEach((intake) => {
    const productivityScore = prodByDate[intake.date];
    if (productivityScore === undefined) return;

    [intake.breakfast, intake.lunch, intake.dinner, intake.snacks].forEach(
      (mealString) => {
        const items = splitMealItems(mealString);
        items.forEach((item) => {
          if (!foodStats[item]) {
            foodStats[item] = { sumProductivity: 0, occurrences: 0 };
          }
          foodStats[item].sumProductivity += productivityScore;
          foodStats[item].occurrences += 1;
        });
      }
    );
  });

  return Object.entries(foodStats).map(([foodName, stats]) => ({
    foodName,
    averageProductivityScore: stats.sumProductivity / stats.occurrences,
    occurrences: stats.occurrences,
  }));
};
