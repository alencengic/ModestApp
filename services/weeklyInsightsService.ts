import { DateTime } from 'luxon';
import { supabase } from '@/lib/supabase';

export interface WeeklyInsight {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'suggestion';
  category: 'mood' | 'productivity' | 'food' | 'streak' | 'general';
  title: string;
  description: string;
  emoji: string;
  priority: number; // Higher = more important
}

export interface WeeklySummary {
  weekStartDate: string;
  weekEndDate: string;
  insights: WeeklyInsight[];
  moodSummary: {
    averageMood: number; // 1-5 scale
    mostCommonMood: string;
    moodTrend: 'improving' | 'declining' | 'stable';
    entriesCount: number;
  };
  productivitySummary: {
    averageProductivity: number; // 1-10 scale
    productivityTrend: 'improving' | 'declining' | 'stable';
    entriesCount: number;
  };
  foodSummary: {
    diversityScore: number; // 0-100
    totalMealsLogged: number;
    topFoods: string[];
  };
  streakDays: number;
}

/**
 * Get the start and end dates for a given week
 */
export const getWeekDates = (date: Date = new Date()): { start: Date; end: Date } => {
  const dt = DateTime.fromJSDate(date);
  const startOfWeek = dt.startOf('week');
  const endOfWeek = dt.endOf('week');

  return {
    start: startOfWeek.toJSDate(),
    end: endOfWeek.toJSDate(),
  };
};

/**
 * Calculate mood score from mood label
 */
const getMoodScore = (mood: string): number => {
  const moodMap: { [key: string]: number } = {
    'sad': 1,
    'neutral': 3,
    'happy': 4,
    'very happy': 5,
    'ecstatic': 5,
  };
  return moodMap[mood.toLowerCase()] || 3;
};

/**
 * Generate insights for the current week
 */
export const generateWeeklyInsights = async (): Promise<WeeklySummary | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { start, end } = getWeekDates();
    const weekStartDate = DateTime.fromJSDate(start).toISODate();
    const weekEndDate = DateTime.fromJSDate(end).toISODate();

    // Fetch all data for the week
    const [moodData, productivityData, foodData, previousWeekMood, previousWeekProductivity] = await Promise.all([
      fetchMoodData(user.id, weekStartDate!, weekEndDate!),
      fetchProductivityData(user.id, weekStartDate!, weekEndDate!),
      fetchFoodData(user.id, weekStartDate!, weekEndDate!),
      fetchPreviousWeekMood(user.id, weekStartDate!),
      fetchPreviousWeekProductivity(user.id, weekStartDate!),
    ]);

    // Calculate summaries
    const moodSummary = calculateMoodSummary(moodData, previousWeekMood);
    const productivitySummary = calculateProductivitySummary(productivityData, previousWeekProductivity);
    const foodSummary = calculateFoodSummary(foodData);

    // Generate insights
    const insights = generateInsights(moodSummary, productivitySummary, foodSummary, moodData.length);

    const summary: WeeklySummary = {
      weekStartDate: weekStartDate!,
      weekEndDate: weekEndDate!,
      insights,
      moodSummary,
      productivitySummary,
      foodSummary,
      streakDays: moodData.length, // Days with entries this week
    };

    // Save to database
    await saveWeeklySummary(user.id, summary);

    return summary;
  } catch (error) {
    console.error('Error generating weekly insights:', error);
    return null;
  }
};

/**
 * Fetch mood data for date range
 */
const fetchMoodData = async (userId: string, startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('mood_ratings')
    .select('mood, date')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Fetch productivity data for date range
 */
const fetchProductivityData = async (userId: string, startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('productivity_ratings')
    .select('productivity, date')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Fetch food data for date range
 */
const fetchFoodData = async (userId: string, startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('food_intakes')
    .select('breakfast, lunch, dinner, snacks, date')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw error;
  return data || [];
};

/**
 * Fetch previous week's mood data for comparison
 */
const fetchPreviousWeekMood = async (userId: string, currentWeekStart: string) => {
  const previousWeekEnd = DateTime.fromISO(currentWeekStart).minus({ days: 1 }).toISODate();
  const previousWeekStart = DateTime.fromISO(currentWeekStart).minus({ days: 7 }).toISODate();

  const { data, error } = await supabase
    .from('mood_ratings')
    .select('mood')
    .eq('user_id', userId)
    .gte('date', previousWeekStart)
    .lte('date', previousWeekEnd);

  if (error) throw error;
  return data || [];
};

/**
 * Fetch previous week's productivity data for comparison
 */
const fetchPreviousWeekProductivity = async (userId: string, currentWeekStart: string) => {
  const previousWeekEnd = DateTime.fromISO(currentWeekStart).minus({ days: 1 }).toISODate();
  const previousWeekStart = DateTime.fromISO(currentWeekStart).minus({ days: 7 }).toISODate();

  const { data, error } = await supabase
    .from('productivity_ratings')
    .select('productivity')
    .eq('user_id', userId)
    .gte('date', previousWeekStart)
    .lte('date', previousWeekEnd);

  if (error) throw error;
  return data || [];
};

/**
 * Calculate mood summary with trend analysis
 */
const calculateMoodSummary = (moodData: any[], previousWeekData: any[]) => {
  if (moodData.length === 0) {
    return {
      averageMood: 0,
      mostCommonMood: 'No data',
      moodTrend: 'stable' as const,
      entriesCount: 0,
    };
  }

  const moodScores = moodData.map(m => getMoodScore(m.mood));
  const averageMood = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;

  // Find most common mood
  const moodCounts: { [key: string]: number } = {};
  moodData.forEach(m => {
    const mood = m.mood.toLowerCase();
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });
  const mostCommonMood = Object.keys(moodCounts).reduce((a, b) =>
    moodCounts[a] > moodCounts[b] ? a : b
  );

  // Calculate trend
  let moodTrend: 'improving' | 'declining' | 'stable' = 'stable';
  if (previousWeekData.length > 0) {
    const previousAverage = previousWeekData
      .map(m => getMoodScore(m.mood))
      .reduce((a, b) => a + b, 0) / previousWeekData.length;

    const difference = averageMood - previousAverage;
    if (difference > 0.3) moodTrend = 'improving';
    else if (difference < -0.3) moodTrend = 'declining';
  }

  return {
    averageMood: Math.round(averageMood * 10) / 10,
    mostCommonMood,
    moodTrend,
    entriesCount: moodData.length,
  };
};

/**
 * Calculate productivity summary with trend analysis
 */
const calculateProductivitySummary = (productivityData: any[], previousWeekData: any[]) => {
  if (productivityData.length === 0) {
    return {
      averageProductivity: 0,
      productivityTrend: 'stable' as const,
      entriesCount: 0,
    };
  }

  const averageProductivity = productivityData
    .reduce((sum, p) => sum + p.productivity, 0) / productivityData.length;

  // Calculate trend
  let productivityTrend: 'improving' | 'declining' | 'stable' = 'stable';
  if (previousWeekData.length > 0) {
    const previousAverage = previousWeekData
      .reduce((sum, p) => sum + p.productivity, 0) / previousWeekData.length;

    const difference = averageProductivity - previousAverage;
    if (difference > 0.5) productivityTrend = 'improving';
    else if (difference < -0.5) productivityTrend = 'declining';
  }

  return {
    averageProductivity: Math.round(averageProductivity * 10) / 10,
    productivityTrend,
    entriesCount: productivityData.length,
  };
};

/**
 * Calculate food diversity and patterns
 */
const calculateFoodSummary = (foodData: any[]) => {
  if (foodData.length === 0) {
    return {
      diversityScore: 0,
      totalMealsLogged: 0,
      topFoods: [],
    };
  }

  const allFoods: string[] = [];
  let totalMeals = 0;

  foodData.forEach(entry => {
    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
      const foods = entry[mealType];
      if (foods && foods.trim()) {
        totalMeals++;
        const foodList = foods.split(',').map((f: string) => f.trim().toLowerCase());
        allFoods.push(...foodList);
      }
    });
  });

  // Count food frequencies
  const foodCounts: { [key: string]: number } = {};
  allFoods.forEach(food => {
    if (food) foodCounts[food] = (foodCounts[food] || 0) + 1;
  });

  // Get top 3 foods
  const topFoods = Object.entries(foodCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([food]) => food);

  // Calculate diversity score (unique foods / total foods * 100)
  const uniqueFoods = Object.keys(foodCounts).length;
  const diversityScore = Math.min(100, Math.round((uniqueFoods / allFoods.length) * 100));

  return {
    diversityScore,
    totalMealsLogged: totalMeals,
    topFoods,
  };
};

/**
 * Generate insights based on summaries
 */
const generateInsights = (
  moodSummary: any,
  productivitySummary: any,
  foodSummary: any,
  daysLogged: number
): WeeklyInsight[] => {
  const insights: WeeklyInsight[] = [];
  let insightId = 1;

  // Mood insights
  if (moodSummary.entriesCount > 0) {
    if (moodSummary.moodTrend === 'improving') {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'positive',
        category: 'mood',
        title: 'Mood Improving',
        description: `Your mood is trending upward this week! Average mood: ${moodSummary.averageMood}/5`,
        emoji: '📈',
        priority: 10,
      });
    } else if (moodSummary.moodTrend === 'declining') {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'negative',
        category: 'mood',
        title: 'Mood Declining',
        description: `Your mood has been lower this week. Consider what might be affecting you.`,
        emoji: '📉',
        priority: 9,
      });
    }

    if (moodSummary.averageMood >= 4) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'positive',
        category: 'mood',
        title: 'Great Week',
        description: `You had a wonderful week with an average mood of ${moodSummary.averageMood}/5!`,
        emoji: '🌟',
        priority: 8,
      });
    }
  }

  // Productivity insights
  if (productivitySummary.entriesCount > 0) {
    if (productivitySummary.productivityTrend === 'improving') {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'positive',
        category: 'productivity',
        title: 'Productivity Boost',
        description: `Your productivity is up! Average: ${productivitySummary.averageProductivity}/10`,
        emoji: '🚀',
        priority: 9,
      });
    } else if (productivitySummary.productivityTrend === 'declining') {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'suggestion',
        category: 'productivity',
        title: 'Productivity Dip',
        description: `Productivity has decreased. Try reviewing your sleep and stress levels.`,
        emoji: '💡',
        priority: 7,
      });
    }
  }

  // Food insights
  if (foodSummary.totalMealsLogged > 0) {
    if (foodSummary.diversityScore >= 70) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'positive',
        category: 'food',
        title: 'Great Food Variety',
        description: `Excellent food diversity this week (${foodSummary.diversityScore}%)!`,
        emoji: '🥗',
        priority: 6,
      });
    } else if (foodSummary.diversityScore < 40) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'suggestion',
        category: 'food',
        title: 'Try More Variety',
        description: `Your diet diversity is ${foodSummary.diversityScore}%. Try adding new foods!`,
        emoji: '🍽️',
        priority: 5,
      });
    }

    if (foodSummary.topFoods.length > 0) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'neutral',
        category: 'food',
        title: 'Top Foods This Week',
        description: `Most eaten: ${foodSummary.topFoods.join(', ')}`,
        emoji: '🏆',
        priority: 4,
      });
    }
  }

  // Streak insights
  if (daysLogged >= 5) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'positive',
      category: 'streak',
      title: 'Consistency Champion',
      description: `You logged ${daysLogged} days this week! Keep it up!`,
      emoji: '🔥',
      priority: 8,
    });
  } else if (daysLogged < 3 && daysLogged > 0) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'suggestion',
      category: 'streak',
      title: 'Log More Often',
      description: `You logged ${daysLogged} days this week. Try for at least 5 days!`,
      emoji: '📝',
      priority: 6,
    });
  }

  // General suggestions
  if (moodSummary.entriesCount === 0 && productivitySummary.entriesCount === 0) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'suggestion',
      category: 'general',
      title: 'Start Tracking',
      description: `Begin logging your mood and productivity to see insights!`,
      emoji: '🎯',
      priority: 10,
    });
  }

  // Sort by priority (highest first)
  return insights.sort((a, b) => b.priority - a.priority);
};

/**
 * Save weekly summary to database
 */
const saveWeeklySummary = async (userId: string, summary: WeeklySummary) => {
  const { error } = await supabase
    .from('weekly_insights')
    .upsert({
      user_id: userId,
      week_start_date: summary.weekStartDate,
      week_end_date: summary.weekEndDate,
      insights: summary.insights,
      mood_summary: summary.moodSummary,
      productivity_summary: summary.productivitySummary,
      food_summary: summary.foodSummary,
      generated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,week_start_date'
    });

  if (error) {
    console.error('Error saving weekly summary:', error);
    throw error;
  }
};

/**
 * Get the most recent weekly insights
 */
export const getLatestWeeklyInsights = async (): Promise<WeeklySummary | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('weekly_insights')
      .select('*')
      .eq('user_id', user.id)
      .order('week_start_date', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      // Generate new insights if none exist
      return await generateWeeklyInsights();
    }

    return {
      weekStartDate: data.week_start_date,
      weekEndDate: data.week_end_date,
      insights: data.insights as WeeklyInsight[],
      moodSummary: data.mood_summary as any,
      productivitySummary: data.productivity_summary as any,
      foodSummary: data.food_summary as any,
      streakDays: data.mood_summary?.entriesCount || 0,
    };
  } catch (error) {
    console.error('Error fetching latest insights:', error);
    return null;
  }
};

/**
 * Get all weekly insights for a user
 */
export const getAllWeeklyInsights = async (): Promise<WeeklySummary[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('weekly_insights')
      .select('*')
      .eq('user_id', user.id)
      .order('week_start_date', { ascending: false });

    if (error || !data) return [];

    return data.map(d => ({
      weekStartDate: d.week_start_date,
      weekEndDate: d.week_end_date,
      insights: d.insights as WeeklyInsight[],
      moodSummary: d.mood_summary as any,
      productivitySummary: d.productivity_summary as any,
      foodSummary: d.food_summary as any,
      streakDays: d.mood_summary?.entriesCount || 0,
    }));
  } catch (error) {
    console.error('Error fetching all insights:', error);
    return [];
  }
};
