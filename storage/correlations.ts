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
