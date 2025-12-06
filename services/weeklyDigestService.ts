import { supabase } from '@/lib/supabase';
import { DateTime } from 'luxon';

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
  return moodMap[mood] || 3;
};

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  averageMood: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  topFoods: string[];
  topMood: number;
  lowestMood: number;
  weatherImpact: string;
  keyInsights: string[];
  recommendations: string[];
  stats: {
    entriesLogged: number;
    mealsTracked: number;
    avgTemperature: number;
  };
}

export const generateWeeklySummary = async (): Promise<WeeklySummary> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const weekStart = DateTime.now().startOf('week').toISODate();
    const weekEnd = DateTime.now().endOf('week').toISODate();

    const [moodData, foodData, weatherData] = await Promise.all([
      supabase
        .from('mood_ratings')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekStart)
        .lte('date', weekEnd),
      supabase
        .from('food_intakes')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekStart)
        .lte('date', weekEnd),
      supabase
        .from('weather_data')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekStart)
        .lte('date', weekEnd),
    ]);

    const moods = moodData.data || [];
    const foods = foodData.data || [];
    const weather = weatherData.data || [];

    const averageMood = moods.length > 0
      ? moods.reduce((a, b) => a + moodToNumber(b.mood), 0) / moods.length
      : 3;

    const topMood = moods.length > 0 ? Math.max(...moods.map(m => moodToNumber(m.mood))) : 0;
    const lowestMood = moods.length > 0 ? Math.min(...moods.map(m => moodToNumber(m.mood))) : 0;

    // Calculate trend
    const firstHalf = moods.slice(0, Math.ceil(moods.length / 2));
    const secondHalf = moods.slice(Math.ceil(moods.length / 2));
    const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((a, b) => a + moodToNumber(b.mood), 0) / firstHalf.length : 3;
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + moodToNumber(b.mood), 0) / secondHalf.length : 3;
    const moodTrend: 'improving' | 'declining' | 'stable' = 
      secondAvg > firstAvg + 0.5 ? 'improving' : secondAvg < firstAvg - 0.5 ? 'declining' : 'stable';

    // Get top foods
    const foodMap = new Map<string, number>();
    foods.forEach(f => {
      f.foods?.forEach((food: string) => {
        foodMap.set(food, (foodMap.get(food) || 0) + 1);
      });
    });
    const topFoods = Array.from(foodMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(e => e[0]);

    const avgTemperature = weather.length > 0
      ? weather.reduce((a, b) => a + b.temperature, 0) / weather.length
      : 0;

    // Generate insights
    const keyInsights = generateInsights(averageMood, moodTrend, topFoods, weather, moods);
    const recommendations = generateRecommendations(moodTrend, topMood, lowestMood, topFoods);

    return {
      weekStart,
      weekEnd,
      averageMood: Math.round(averageMood * 100) / 100,
      moodTrend,
      topFoods,
      topMood,
      lowestMood,
      weatherImpact: analyzeWeatherImpact(weather, moods),
      keyInsights,
      recommendations,
      stats: {
        entriesLogged: moods.length,
        mealsTracked: foods.length,
        avgTemperature: Math.round(avgTemperature * 10) / 10,
      },
    };
  } catch (error) {
    console.error('Error generating weekly summary:', error);
    throw error;
  }
};

const generateInsights = (
  avgMood: number,
  trend: string,
  topFoods: string[],
  weather: any[],
  moods: any[]
): string[] => {
  const insights: string[] = [];

  if (avgMood >= 4) {
    insights.push('You\'ve had a positive week! Your mood has been predominantly good.');
  } else if (avgMood >= 3) {
    insights.push('Your mood has been stable this week.');
  } else {
    insights.push('This week has been challenging emotionally. Be kind to yourself.');
  }

  if (trend === 'improving') {
    insights.push('Your mood is trending upward - keep doing what you\'re doing!');
  } else if (trend === 'declining') {
    insights.push('Your mood has declined this week. Consider what might be contributing.');
  }

  if (topFoods.length > 0) {
    insights.push(`Your most logged meals this week: ${topFoods.join(', ')}`);
  }

  const rainyDays = weather.filter(w => w.condition?.toLowerCase().includes('rain')).length;
  if (rainyDays > 2) {
    insights.push(`${rainyDays} rainy days this week. Weather may have affected your mood.`);
  }

  return insights;
};

const generateRecommendations = (
  trend: string,
  topMood: number,
  lowestMood: number,
  topFoods: string[]
): string[] => {
  const recommendations: string[] = [];

  if (trend === 'declining') {
    recommendations.push('Consider scheduling time for activities you enjoy.');
    recommendations.push('Reach out to someone you trust for support.');
  }

  if (lowestMood <= 2) {
    recommendations.push('Focus on self-care and stress-reduction activities.');
  }

  if (topMood >= 5) {
    recommendations.push('Notice what made today great and repeat it!');
  }

  recommendations.push('Continue tracking your mood for better insights.');

  return recommendations;
};

const analyzeWeatherImpact = (weather: any[], moods: any[]): string => {
  if (weather.length === 0) return 'No weather data available';

  const conditions = new Map<string, number[]>();
  
  weather.forEach(w => {
    const mood = moods.find(m => m.date === w.date);
    if (mood) {
      const key = w.condition.toLowerCase();
      if (!conditions.has(key)) conditions.set(key, []);
      conditions.get(key)!.push(moodToNumber(mood.mood));
    }
  });

  let bestCondition = '';
  let bestAvgMood = 0;

  conditions.forEach((moodValues, condition) => {
    const avg = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
    if (avg > bestAvgMood) {
      bestAvgMood = avg;
      bestCondition = condition;
    }
  });

  return bestCondition ? `${bestCondition} days correlated with your best mood` : 'No clear weather pattern';
};
