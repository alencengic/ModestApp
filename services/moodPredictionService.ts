import { supabase } from '@/lib/supabase';
import { DateTime } from 'luxon';

export interface MoodPrediction {
  predictedMood: number;
  confidence: number;
  factors: {
    weather?: string;
    recentFoods?: string[];
    dayOfWeek?: string;
    time?: string;
  };
  recommendations: string[];
}

export interface MoodCorrelation {
  factor: string;
  correlation: number; // -1 to 1
  dataPoints: number;
}

export const calculateMoodPrediction = async (): Promise<MoodPrediction | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get last 30 days of data
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toISODate();
    
    const [moodData, weatherData, foodData] = await Promise.all([
      supabase
        .from('mood_ratings')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo)
        .order('date', { ascending: false }),
      supabase
        .from('weather_data')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo),
      supabase
        .from('food_intakes')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo),
    ]);

    if (!moodData.data || moodData.data.length < 5) {
      return null; // Not enough data
    }

    // Calculate correlations
    const weatherCorrelation = calculateWeatherMoodCorrelation(moodData.data, weatherData.data || []);
    const foodCorrelation = calculateFoodMoodCorrelation(moodData.data, foodData.data || []);
    const dayOfWeekCorrelation = calculateDayOfWeekCorrelation(moodData.data);

    // Generate prediction
    const prediction = generateMoodPrediction(
      moodData.data,
      weatherCorrelation,
      foodCorrelation,
      dayOfWeekCorrelation
    );

    return prediction;
  } catch (error) {
    console.error('Error calculating mood prediction:', error);
    return null;
  }
};

// Helper to convert string mood to number
const moodToNumber = (mood: string | number): number => {
  if (typeof mood === 'number') return mood;
  const moodMap: Record<string, number> = {
    'Sad': 1,
    'Neutral': 2,
    'Happy': 3,
    'Very Happy': 4,
    'Ecstatic': 5,
  };
  return moodMap[mood] || 3; // Default to neutral
};

const calculateWeatherMoodCorrelation = (moods: any[], weather: any[]): number => {
  if (weather.length === 0) return 0;

  // Match moods to weather by date
  const correlations: number[] = [];
  
  weather.forEach(w => {
    const moodOnDate = moods.find(m => m.date === w.date);
    if (moodOnDate) {
      // Sunny weather typically correlates with better mood
      const weatherScore = w.condition.toLowerCase().includes('clear') || 
                          w.condition.toLowerCase().includes('sunny') ? 1 : -0.5;
      const moodValue = moodToNumber(moodOnDate.mood);
      correlations.push((moodValue / 5) * weatherScore);
    }
  });

  return correlations.length > 0 
    ? correlations.reduce((a, b) => a + b, 0) / correlations.length 
    : 0;
};

const calculateFoodMoodCorrelation = (moods: any[], foods: any[]): number => {
  if (!foods || foods.length === 0) return 0;

  // Track mood changes on days with specific foods
  const correlations: number[] = [];
  
  foods.forEach(f => {
    const moodOnDate = moods.find(m => m.date === f.date);
    if (moodOnDate && f.foods && Array.isArray(f.foods)) {
      // Healthy foods generally correlate with better mood
      const hasHealthyFood = f.foods.some((food: string) => 
        ['fruits', 'vegetables', 'salad', 'fish', 'nuts'].some(h => 
          food.toLowerCase().includes(h)
        )
      );
      const foodScore = hasHealthyFood ? 0.5 : -0.3;
      const moodValue = moodToNumber(moodOnDate.mood);
      correlations.push((moodValue / 5) * foodScore);
    }
  });

  return correlations.length > 0
    ? correlations.reduce((a, b) => a + b, 0) / correlations.length
    : 0;
};

const calculateDayOfWeekCorrelation = (moods: any[]): Record<string, number> => {
  const dayScores: Record<string, number[]> = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  moods.forEach(mood => {
    const dayName = DateTime.fromISO(mood.date).toFormat('cccc');
    const moodValue = moodToNumber(mood.mood);
    dayScores[dayName]?.push(moodValue);
  });

  const correlation: Record<string, number> = {};
  Object.entries(dayScores).forEach(([day, scores]) => {
    if (scores.length > 0) {
      correlation[day] = scores.reduce((a, b) => a + b, 0) / scores.length / 5;
    }
  });

  return correlation;
};

const generateMoodPrediction = (
  recentMoods: any[],
  weatherCorr: number,
  foodCorr: number,
  dayOfWeekCorr: Record<string, number>
): MoodPrediction => {
  // Convert mood labels to numeric values if needed
  const moodToNumber = (mood: any): number => {
    if (typeof mood === 'number') return mood;
    const moodMap: Record<string, number> = {
      'Sad': 1,
      'Neutral': 2,
      'Happy': 3,
      'Very Happy': 4,
      'Ecstatic': 5,
    };
    return moodMap[mood] || 3;
  };

  const numericMoods = recentMoods.map(m => moodToNumber(m.mood));
  const avgMood = numericMoods.length > 0 
    ? numericMoods.reduce((a, b) => a + b, 0) / numericMoods.length 
    : 3;
    
  const today = DateTime.now().toFormat('cccc');
  const dayCorr = dayOfWeekCorr[today] || 0;

  // Calculate predicted mood (scale 1-5, then convert to 1-10)
  const basePrediction = Math.min(5, Math.max(1, avgMood + (weatherCorr * 0.3) + (foodCorr * 0.3) + (dayCorr * 0.4)));
  const predictedMood = basePrediction * 2; // Convert 1-5 to 2-10 scale
  
  const confidence = Math.min(0.95, 0.5 + (recentMoods.length * 0.02));

  const recommendations: string[] = [];
  
  if (weatherCorr < -0.3) {
    recommendations.push('Rainy days affect your mood. Consider indoor activities you enjoy.');
  }
  if (foodCorr < -0.2) {
    recommendations.push('Certain foods may impact your mood. Try adding more fruits and vegetables.');
  }
  if (dayCorr < -0.2) {
    recommendations.push(`${today}s tend to be challenging. Plan something uplifting.`);
  }
  if (confidence > 0.7) {
    recommendations.push('Your mood patterns are becoming clear. Keep tracking!');
  }

  return {
    predictedMood: Math.round(predictedMood * 10) / 10,
    confidence: Math.round(confidence * 100) / 100,
    factors: {
      weather: weatherCorr > 0.2 ? 'Positive' : weatherCorr < -0.2 ? 'Negative' : 'Neutral',
      dayOfWeek: dayCorr > 0.2 ? 'Positive' : dayCorr < -0.2 ? 'Negative' : 'Neutral',
    },
    recommendations,
  };
};

export const getMoodCorrelations = async (): Promise<MoodCorrelation[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toISODate();

    const [moodData, weatherData, foodData] = await Promise.all([
      supabase
        .from('mood_ratings')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo),
      supabase
        .from('weather_data')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo),
      supabase
        .from('food_intakes')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo),
    ]);

    const correlations: MoodCorrelation[] = [
      {
        factor: 'Weather',
        correlation: calculateWeatherMoodCorrelation(moodData.data || [], weatherData.data || []),
        dataPoints: (weatherData.data || []).length,
      },
      {
        factor: 'Food',
        correlation: calculateFoodMoodCorrelation(moodData.data || [], foodData.data || []),
        dataPoints: (foodData.data || []).length,
      },
    ];

    return correlations;
  } catch (error) {
    console.error('Error getting mood correlations:', error);
    return [];
  }
};
