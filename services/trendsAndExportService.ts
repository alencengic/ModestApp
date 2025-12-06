import { supabase } from '@/lib/supabase';
import { DateTime } from 'luxon';
import { Share } from 'react-native';

export interface TrendAlert {
  type: 'mood_decrease' | 'mood_increase' | 'streak_break' | 'pattern_change';
  severity: 'low' | 'medium' | 'high';
  message: string;
  recommendation?: string;
  timestamp: string;
}

export interface ExportData {
  moods: any[];
  weather: any[];
  foods: any[];
  journal: any[];
  summary: {
    averageMood: number;
    moodTrend: number;
    totalEntries: number;
    dateRange: string;
  };
}

export const detectTrendAlerts = async (): Promise<TrendAlert[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const alerts: TrendAlert[] = [];

    // Detect mood decrease
    const moodTrend = await analyzeMoodTrend();
    if (moodTrend.weeklyChange < -0.5) {
      alerts.push({
        type: 'mood_decrease',
        severity: 'high',
        message: `Your mood has decreased ${Math.round(Math.abs(moodTrend.weeklyChange) * 100)}% this week.`,
        recommendation: 'Consider self-care activities or reaching out to someone you trust.',
        timestamp: new Date().toISOString(),
      });
    }

    // Detect positive mood trend
    if (moodTrend.weeklyChange > 0.4) {
      alerts.push({
        type: 'mood_increase',
        severity: 'low',
        message: 'Your mood is improving! Keep up what you\'re doing.',
        timestamp: new Date().toISOString(),
      });
    }

    // Check for streak interruption
    const { data: streakData } = await supabase
      .from('streak_data')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (streakData && streakData.currentStreak === 0 && streakData.totalEntries > 5) {
      alerts.push({
        type: 'streak_break',
        severity: 'medium',
        message: 'You haven\'t logged today. Your streak is at risk!',
        recommendation: 'Take a moment to reflect and log your entry.',
        timestamp: new Date().toISOString(),
      });
    }

    // Detect pattern changes
    const patternChange = await detectPatternChange();
    if (patternChange) {
      alerts.push({
        type: 'pattern_change',
        severity: 'medium',
        message: patternChange.message,
        recommendation: patternChange.recommendation,
        timestamp: new Date().toISOString(),
      });
    }

    return alerts;
  } catch (error) {
    console.error('Error detecting trend alerts:', error);
    return [];
  }
};

const analyzeMoodTrend = async (): Promise<{ weeklyChange: number }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { weeklyChange: 0 };

  const thisWeekStart = DateTime.now().minus({ days: 7 }).toISODate();
  const lastWeekStart = DateTime.now().minus({ days: 14 }).toISODate();
  const lastWeekEnd = DateTime.now().minus({ days: 7 }).toISODate();

  const [thisWeek, lastWeek] = await Promise.all([
    supabase
      .from('mood_ratings')
      .select('mood')
      .eq('user_id', user.id)
      .gte('date', thisWeekStart),
    supabase
      .from('mood_ratings')
      .select('mood')
      .eq('user_id', user.id)
      .gte('date', lastWeekStart)
      .lte('date', lastWeekEnd),
  ]);

  const thisWeekAvg = thisWeek.data
    ? thisWeek.data.reduce((a, b) => a + b.mood, 0) / thisWeek.data.length
    : 3;

  const lastWeekAvg = lastWeek.data
    ? lastWeek.data.reduce((a, b) => a + b.mood, 0) / lastWeek.data.length
    : 3;

  return {
    weeklyChange: (thisWeekAvg - lastWeekAvg) / 5,
  };
};

const detectPatternChange = async (): Promise<{ message: string; recommendation: string } | null> => {
  // Implement pattern change detection
  return null;
};

export const exportDataAsCSV = async (): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const [moodData, weatherData, foodData, journalData] = await Promise.all([
      supabase
        .from('mood_ratings')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false }),
      supabase
        .from('weather_data')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false }),
      supabase
        .from('food_intakes')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false }),
      supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false }),
    ]);

    let csv = 'Date,Mood,Temperature,Condition,Foods,Notes\n';

    // Merge all data by date
    const dateMap = new Map<string, any>();

    moodData.data?.forEach(m => {
      if (!dateMap.has(m.date)) dateMap.set(m.date, {});
      dateMap.get(m.date).mood = m.mood;
    });

    weatherData.data?.forEach(w => {
      if (!dateMap.has(w.date)) dateMap.set(w.date, {});
      Object.assign(dateMap.get(w.date), {
        temperature: w.temperature,
        condition: w.condition,
      });
    });

    foodData.data?.forEach(f => {
      if (!dateMap.has(f.date)) dateMap.set(f.date, {});
      dateMap.get(f.date).foods = f.foods?.join('; ') || '';
    });

    journalData.data?.forEach(j => {
      if (!dateMap.has(j.date)) dateMap.set(j.date, {});
      dateMap.get(j.date).notes = j.content?.substring(0, 100) || '';
    });

    // Build CSV
    dateMap.forEach((data, date) => {
      csv += `${date},${data.mood || ''},${data.temperature || ''},${data.condition || ''},"${data.foods || ''}","${data.notes || ''}" \n`;
    });

    return csv;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

export const exportDataAsPDF = async (): Promise<void> => {
  try {
    const csv = await exportDataAsCSV();
    
    await Share.share({
      message: csv,
      title: `ModestApp_Export_${DateTime.now().toFormat('yyyy-MM-dd')}`,
    });
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

export const generateExportSummary = async (): Promise<ExportData> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toISODate();

    const [moods, weather, foods, journal] = await Promise.all([
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
      supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo),
    ]);

    const moodArray = moods.data || [];
    const averageMood = moodArray.length > 0
      ? moodArray.reduce((a, b) => a + b.mood, 0) / moodArray.length
      : 0;

    return {
      moods: moodArray,
      weather: weather.data || [],
      foods: foods.data || [],
      journal: journal.data || [],
      summary: {
        averageMood: Math.round(averageMood * 100) / 100,
        moodTrend: 0, // Calculate based on trend
        totalEntries: moodArray.length,
        dateRange: `${thirtyDaysAgo} to ${DateTime.now().toISODate()}`,
      },
    };
  } catch (error) {
    console.error('Error generating export summary:', error);
    throw error;
  }
};
