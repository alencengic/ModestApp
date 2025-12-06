import { supabase } from "@/lib/supabase";
import { isWorkingDay, isSportDay } from "./userProfile";
import { DateTime } from "luxon";

export interface FoodMoodCorrelation {
  foodName: string;
  averageMoodScore: number;
  occurrences: number;
}

interface FoodIntake {
  id: number;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string;
  date: string;
}

// Normalized mood scale: Happy=0 (neutral baseline), 
// positive for better-than-happy, negative for worse-than-happy
const MOOD_SCORE_MAP: Record<string, number> = {
  "sad": -1,
  "neutral": -0.5,
  "happy": 0,
  "very happy": 0.5,
  "ecstatic": 1,
};

// Helper to get mood score with case-insensitive matching
const getMoodScore = (mood: string | number): number | undefined => {
  if (typeof mood === 'number') {
    // If mood is already a number (1-5 scale), normalize to our scale
    // 1=Sad, 2=Neutral, 3=Happy, 4=Very Happy, 5=Ecstatic
    const numericMap: Record<number, number> = { 1: -1, 2: -0.5, 3: 0, 4: 0.5, 5: 1 };
    return numericMap[mood];
  }
  const normalizedMood = mood.toLowerCase().trim();
  return MOOD_SCORE_MAP[normalizedMood];
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Fetch food intakes from Supabase
  const { data: foodIntakes, error: foodError } = await supabase
    .from('food_intakes')
    .select('*')
    .eq('user_id', user.id);

  if (foodError) throw foodError;

  // Fetch mood ratings from Supabase
  const { data: moodRatings, error: moodError } = await supabase
    .from('mood_ratings')
    .select('*')
    .eq('user_id', user.id);

  if (moodError) throw moodError;

  if (!foodIntakes?.length || !moodRatings?.length) {
    return [];
  }

  const moodByDate: Record<string, number> = {};
  moodRatings.forEach((rating: any) => {
    const moodScore = getMoodScore(rating.mood);
    if (moodScore !== undefined) {
      moodByDate[rating.date] = moodScore;
    }
  });

  const foodStats: Record<
    string,
    { sumMoodScore: number; occurrences: number }
  > = {};

  foodIntakes.forEach((intake: FoodIntake) => {
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

type BloatingLevel = "None" | "Mild" | "Moderate" | "Severe";

interface SymptomRow {
  id: string;
  meal_id?: string;
  meal_type_tag?: string;
  created_at: string;
  bloating: BloatingLevel;
  energy: number;
  stool_consistency: number;
  diarrhea: number;
  nausea: number;
  pain: number;
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Fetch food intakes from Supabase
  const { data: foodIntakes, error: foodError } = await supabase
    .from('food_intakes')
    .select('*')
    .eq('user_id', user.id);

  if (foodError) throw foodError;

  // Fetch symptom entries from Supabase
  const { data: symptoms, error: symptomsError } = await supabase
    .from('symptom_entries')
    .select('*')
    .eq('user_id', user.id);

  if (symptomsError) throw symptomsError;

  if (!foodIntakes?.length || !symptoms?.length) {
    return [];
  }

  const symptomsByDate: Record<string, { totalScore: number; count: number }> =
    {};
  symptoms.forEach((symptom: SymptomRow) => {
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

  foodIntakes.forEach((intake: FoodIntake) => {
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
  productivity: number;
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Fetch food intakes from Supabase
  const { data: foodIntakes, error: foodError } = await supabase
    .from('food_intakes')
    .select('*')
    .eq('user_id', user.id);

  if (foodError) throw foodError;

  // Fetch productivity ratings from Supabase
  const { data: productivityRatings, error: prodError } = await supabase
    .from('productivity_ratings')
    .select('*')
    .eq('user_id', user.id);

  if (prodError) throw prodError;

  if (!foodIntakes?.length || !productivityRatings?.length) return [];

  const prodByDate: Record<string, number> = {};
  productivityRatings.forEach((rating: ProductivityRating) => {
    if (typeof rating.productivity === "number") {
      // Extract just the date part from the ISO timestamp
      const dateOnly = rating.date.split("T")[0];
      // Normalize productivity from 1-5 scale to -2 to +2 scale (centered at 3)
      // 1 -> -2, 2 -> -1, 3 -> 0, 4 -> 1, 5 -> 2
      const normalizedScore = rating.productivity - 3;
      prodByDate[dateOnly] = normalizedScore;
    }
  });

  const foodStats: Record<
    string,
    { sumProductivity: number; occurrences: number }
  > = {};

  foodIntakes.forEach((intake: FoodIntake) => {
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

// Working Days vs Non-Working Days Analysis
export interface WorkingDayAnalysis {
  workingDays: {
    averageMood: number;
    averageProductivity: number;
    count: number;
    moodStdDev?: number;
    productivityStdDev?: number;
  };
  nonWorkingDays: {
    averageMood: number;
    averageProductivity: number;
    count: number;
    moodStdDev?: number;
    productivityStdDev?: number;
  };
  insights: {
    moodDifference: number;
    moodDifferencePercentage: number;
    productivityDifference: number;
    productivityDifferencePercentage: number;
    confidenceLevel: "low" | "medium" | "high";
    significantDifference: boolean;
    recommendation: string;
  };
}

export const getWorkingDayAnalysis = async (): Promise<WorkingDayAnalysis> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Fetch mood ratings from Supabase
  const { data: moodRatings, error: moodError } = await supabase
    .from('mood_ratings')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true });

  if (moodError) throw moodError;

  // Fetch productivity ratings from Supabase
  const { data: productivityRatings, error: prodError } = await supabase
    .from('productivity_ratings')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true });

  if (prodError) throw prodError;

  let workingDayMoodSum = 0;
  let workingDayMoodCount = 0;
  let nonWorkingDayMoodSum = 0;
  let nonWorkingDayMoodCount = 0;
  const workingDayMoodScores: number[] = [];
  const nonWorkingDayMoodScores: number[] = [];

  // Process mood ratings
  if (moodRatings) {
    for (const rating of moodRatings) {
      const moodScore = MOOD_SCORE_MAP[rating.mood];
      if (moodScore === undefined) continue;

      const date = DateTime.fromISO(rating.date).toJSDate();
      const isWorking = await isWorkingDay(date);

      if (isWorking) {
        workingDayMoodSum += moodScore;
        workingDayMoodCount++;
        workingDayMoodScores.push(moodScore);
      } else {
        nonWorkingDayMoodSum += moodScore;
        nonWorkingDayMoodCount++;
        nonWorkingDayMoodScores.push(moodScore);
      }
    }
  }

  let workingDayProdSum = 0;
  let workingDayProdCount = 0;
  let nonWorkingDayProdSum = 0;
  let nonWorkingDayProdCount = 0;
  const workingDayProdScores: number[] = [];
  const nonWorkingDayProdScores: number[] = [];

  // Process productivity ratings
  if (productivityRatings) {
    for (const rating of productivityRatings) {
      if (typeof rating.productivity !== "number") continue;

      const date = DateTime.fromISO(rating.date).toJSDate();
      const isWorking = await isWorkingDay(date);
      const normalizedScore = rating.productivity - 3; // Normalize to -2 to +2

      if (isWorking) {
        workingDayProdSum += normalizedScore;
        workingDayProdCount++;
        workingDayProdScores.push(normalizedScore);
      } else {
        nonWorkingDayProdSum += normalizedScore;
        nonWorkingDayProdCount++;
        nonWorkingDayProdScores.push(normalizedScore);
      }
    }
  }

  // Calculate averages
  const workingAvgMood = workingDayMoodCount > 0 ? workingDayMoodSum / workingDayMoodCount : 0;
  const nonWorkingAvgMood = nonWorkingDayMoodCount > 0 ? nonWorkingDayMoodSum / nonWorkingDayMoodCount : 0;
  const workingAvgProd = workingDayProdCount > 0 ? workingDayProdSum / workingDayProdCount : 0;
  const nonWorkingAvgProd = nonWorkingDayProdCount > 0 ? nonWorkingDayProdSum / nonWorkingDayProdCount : 0;

  // Calculate standard deviations
  const calcStdDev = (scores: number[], avg: number): number => {
    if (scores.length < 2) return 0;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
    return Math.sqrt(variance);
  };

  const workingMoodStdDev = calcStdDev(workingDayMoodScores, workingAvgMood);
  const nonWorkingMoodStdDev = calcStdDev(nonWorkingDayMoodScores, nonWorkingAvgMood);
  const workingProdStdDev = calcStdDev(workingDayProdScores, workingAvgProd);
  const nonWorkingProdStdDev = calcStdDev(nonWorkingDayProdScores, nonWorkingAvgProd);

  // Calculate insights
  const moodDiff = workingAvgMood - nonWorkingAvgMood;
  const prodDiff = workingAvgProd - nonWorkingAvgProd;

  // Calculate percentage differences (avoid division by zero)
  const moodDiffPct = nonWorkingAvgMood !== 0 ? (moodDiff / Math.abs(nonWorkingAvgMood)) * 100 : 0;
  const prodDiffPct = nonWorkingAvgProd !== 0 ? (prodDiff / Math.abs(nonWorkingAvgProd)) * 100 : 0;

  // Determine confidence level based on sample size
  const minCount = Math.min(workingDayMoodCount, nonWorkingDayMoodCount, workingDayProdCount, nonWorkingDayProdCount);
  let confidenceLevel: "low" | "medium" | "high";
  if (minCount >= 20) confidenceLevel = "high";
  else if (minCount >= 10) confidenceLevel = "medium";
  else confidenceLevel = "low";

  // Determine if difference is significant (at least 0.3 difference or 15% change)
  const significantDifference = Math.abs(moodDiff) > 0.3 || Math.abs(prodDiff) > 0.3 ||
                                Math.abs(moodDiffPct) > 15 || Math.abs(prodDiffPct) > 15;

  // Generate recommendation
  let recommendation = "";
  if (significantDifference) {
    if (moodDiff > 0 && prodDiff > 0) {
      recommendation = "Working days appear beneficial for both mood and productivity. Consider maintaining or optimizing your work schedule.";
    } else if (moodDiff < 0 && prodDiff < 0) {
      recommendation = "Weekends show better mood and productivity. Consider adding more rest days or reducing work stress.";
    } else if (moodDiff < 0 && prodDiff > 0) {
      recommendation = "While productivity is higher on work days, your mood suffers. Consider work-life balance improvements.";
    } else {
      recommendation = "Your mood is better on work days but productivity drops on weekends. Finding the right balance could help.";
    }
  } else {
    recommendation = "No significant difference detected between working days and weekends. Your routine appears balanced.";
  }

  return {
    workingDays: {
      averageMood: workingAvgMood,
      averageProductivity: workingAvgProd,
      count: Math.max(workingDayMoodCount, workingDayProdCount),
      moodStdDev: workingMoodStdDev,
      productivityStdDev: workingProdStdDev,
    },
    nonWorkingDays: {
      averageMood: nonWorkingAvgMood,
      averageProductivity: nonWorkingAvgProd,
      count: Math.max(nonWorkingDayMoodCount, nonWorkingDayProdCount),
      moodStdDev: nonWorkingMoodStdDev,
      productivityStdDev: nonWorkingProdStdDev,
    },
    insights: {
      moodDifference: moodDiff,
      moodDifferencePercentage: moodDiffPct,
      productivityDifference: prodDiff,
      productivityDifferencePercentage: prodDiffPct,
      confidenceLevel,
      significantDifference,
      recommendation,
    },
  };
};

// Training Days vs Non-Training Days Analysis
export interface TrainingDayAnalysis {
  trainingDays: {
    averageMood: number;
    averageProductivity: number;
    count: number;
    moodStdDev?: number;
    productivityStdDev?: number;
  };
  nonTrainingDays: {
    averageMood: number;
    averageProductivity: number;
    count: number;
    moodStdDev?: number;
    productivityStdDev?: number;
  };
  insights: {
    moodDifference: number;
    moodDifferencePercentage: number;
    productivityDifference: number;
    productivityDifferencePercentage: number;
    confidenceLevel: "low" | "medium" | "high";
    significantDifference: boolean;
    recommendation: string;
  };
}

export const getTrainingDayAnalysis = async (): Promise<TrainingDayAnalysis> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Fetch mood ratings from Supabase
  const { data: moodRatings, error: moodError } = await supabase
    .from('mood_ratings')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true });

  if (moodError) throw moodError;

  // Fetch productivity ratings from Supabase
  const { data: productivityRatings, error: prodError } = await supabase
    .from('productivity_ratings')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true });

  if (prodError) throw prodError;

  let trainingDayMoodSum = 0;
  let trainingDayMoodCount = 0;
  let nonTrainingDayMoodSum = 0;
  let nonTrainingDayMoodCount = 0;
  const trainingDayMoodScores: number[] = [];
  const nonTrainingDayMoodScores: number[] = [];

  // Process mood ratings
  if (moodRatings) {
    for (const rating of moodRatings) {
      const moodScore = MOOD_SCORE_MAP[rating.mood];
      if (moodScore === undefined) continue;

      const date = DateTime.fromISO(rating.date).toJSDate();
      const isTraining = await isSportDay(date);

      if (isTraining) {
        trainingDayMoodSum += moodScore;
        trainingDayMoodCount++;
        trainingDayMoodScores.push(moodScore);
      } else {
        nonTrainingDayMoodSum += moodScore;
        nonTrainingDayMoodCount++;
        nonTrainingDayMoodScores.push(moodScore);
      }
    }
  }

  let trainingDayProdSum = 0;
  let trainingDayProdCount = 0;
  let nonTrainingDayProdSum = 0;
  let nonTrainingDayProdCount = 0;
  const trainingDayProdScores: number[] = [];
  const nonTrainingDayProdScores: number[] = [];

  // Process productivity ratings
  if (productivityRatings) {
    for (const rating of productivityRatings) {
      if (typeof rating.productivity !== "number") continue;

      const date = DateTime.fromISO(rating.date).toJSDate();
      const isTraining = await isSportDay(date);
      const normalizedScore = rating.productivity - 3; // Normalize to -2 to +2

      if (isTraining) {
        trainingDayProdSum += normalizedScore;
        trainingDayProdCount++;
        trainingDayProdScores.push(normalizedScore);
      } else {
        nonTrainingDayProdSum += normalizedScore;
        nonTrainingDayProdCount++;
        nonTrainingDayProdScores.push(normalizedScore);
      }
    }
  }

  // Calculate averages
  const trainingAvgMood = trainingDayMoodCount > 0 ? trainingDayMoodSum / trainingDayMoodCount : 0;
  const nonTrainingAvgMood = nonTrainingDayMoodCount > 0 ? nonTrainingDayMoodSum / nonTrainingDayMoodCount : 0;
  const trainingAvgProd = trainingDayProdCount > 0 ? trainingDayProdSum / trainingDayProdCount : 0;
  const nonTrainingAvgProd = nonTrainingDayProdCount > 0 ? nonTrainingDayProdSum / nonTrainingDayProdCount : 0;

  // Calculate standard deviations
  const calcStdDev = (scores: number[], avg: number): number => {
    if (scores.length < 2) return 0;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
    return Math.sqrt(variance);
  };

  const trainingMoodStdDev = calcStdDev(trainingDayMoodScores, trainingAvgMood);
  const nonTrainingMoodStdDev = calcStdDev(nonTrainingDayMoodScores, nonTrainingAvgMood);
  const trainingProdStdDev = calcStdDev(trainingDayProdScores, trainingAvgProd);
  const nonTrainingProdStdDev = calcStdDev(nonTrainingDayProdScores, nonTrainingAvgProd);

  // Calculate insights
  const moodDiff = trainingAvgMood - nonTrainingAvgMood;
  const prodDiff = trainingAvgProd - nonTrainingAvgProd;

  // Calculate percentage differences (avoid division by zero)
  const moodDiffPct = nonTrainingAvgMood !== 0 ? (moodDiff / Math.abs(nonTrainingAvgMood)) * 100 : 0;
  const prodDiffPct = nonTrainingAvgProd !== 0 ? (prodDiff / Math.abs(nonTrainingAvgProd)) * 100 : 0;

  // Determine confidence level based on sample size
  const minCount = Math.min(trainingDayMoodCount, nonTrainingDayMoodCount, trainingDayProdCount, nonTrainingDayProdCount);
  let confidenceLevel: "low" | "medium" | "high";
  if (minCount >= 20) confidenceLevel = "high";
  else if (minCount >= 10) confidenceLevel = "medium";
  else confidenceLevel = "low";

  // Determine if difference is significant (at least 0.3 difference or 15% change)
  const significantDifference = Math.abs(moodDiff) > 0.3 || Math.abs(prodDiff) > 0.3 ||
                                Math.abs(moodDiffPct) > 15 || Math.abs(prodDiffPct) > 15;

  // Generate recommendation
  let recommendation = "";
  if (significantDifference) {
    if (moodDiff > 0 && prodDiff > 0) {
      recommendation = "Training days boost both mood and productivity. Keep up your exercise routine for optimal well-being!";
    } else if (moodDiff < 0 && prodDiff < 0) {
      recommendation = "Rest days show better mood and productivity. You might be overtraining. Consider adding more recovery time.";
    } else if (moodDiff > 0 && prodDiff < 0) {
      recommendation = "Training improves your mood but reduces productivity. Consider lighter workouts or scheduling them strategically.";
    } else {
      recommendation = "Productivity is higher on training days but mood suffers. Check if your training intensity is appropriate.";
    }
  } else {
    recommendation = "Training doesn't show significant impact on your metrics yet. Keep tracking for more insights over time.";
  }

  return {
    trainingDays: {
      averageMood: trainingAvgMood,
      averageProductivity: trainingAvgProd,
      count: Math.max(trainingDayMoodCount, trainingDayProdCount),
      moodStdDev: trainingMoodStdDev,
      productivityStdDev: trainingProdStdDev,
    },
    nonTrainingDays: {
      averageMood: nonTrainingAvgMood,
      averageProductivity: nonTrainingAvgProd,
      count: Math.max(nonTrainingDayMoodCount, nonTrainingDayProdCount),
      moodStdDev: nonTrainingMoodStdDev,
      productivityStdDev: nonTrainingProdStdDev,
    },
    insights: {
      moodDifference: moodDiff,
      moodDifferencePercentage: moodDiffPct,
      productivityDifference: prodDiff,
      productivityDifferencePercentage: prodDiffPct,
      confidenceLevel,
      significantDifference,
      recommendation,
    },
  };
};
