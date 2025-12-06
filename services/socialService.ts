import { supabase } from '@/lib/supabase';
import { Share } from 'react-native';
import { DateTime } from 'luxon';

export interface MoodInsight {
  date: string;
  moodLevel: number;
  topEmotions: string[];
  weatherCondition?: string;
  topFood?: string;
  keyFinding: string;
}

export interface AnonymousProfile {
  id: string;
  joinDate: string;
  moodAverage: number;
  journalStreak: number;
  achievements: number;
  bio?: string;
}

export interface ShareableInsight {
  title: string;
  insights: MoodInsight[];
  statistics: {
    averageMood: number;
    bestDay: string;
    worstDay: string;
    consistency: number;
  };
}

export const generateAnonymousMoodInsights = async (
  days: number = 30
): Promise<ShareableInsight | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const startDate = DateTime.now().minus({ days }).toISODate();

    // Get mood data
    const { data: moodData, error: moodError } = await supabase
      .from('mood_ratings')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .order('date', { ascending: false });

    if (moodError) throw moodError;

    // Get food data
    const { data: foodData } = await supabase
      .from('food_intakes')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate);

    // Get weather data
    const { data: weatherData } = await supabase
      .from('weather_data')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate);

    if (!moodData || moodData.length === 0) return null;

    // Generate insights
    const insights: MoodInsight[] = moodData.slice(0, 7).map((mood, idx) => {
      const foods = foodData?.filter(f => f.date === mood.date) || [];
      const weather = weatherData?.find(w => w.date === mood.date);

      return {
        date: mood.date,
        moodLevel: mood.mood_level,
        topEmotions: mood.emotions?.split(',') || [],
        weatherCondition: weather?.condition,
        topFood: foods[0]?.food_name,
        keyFinding: generateKeyFinding(mood.mood_level, foods, weather),
      };
    });

    // Calculate statistics
    const moodLevels = moodData.map(m => m.mood_level);
    const averageMood = moodLevels.reduce((a, b) => a + b, 0) / moodLevels.length;
    const bestDay = moodData.reduce((a, b) => 
      a.mood_level > b.mood_level ? a : b
    ).date;
    const worstDay = moodData.reduce((a, b) => 
      a.mood_level < b.mood_level ? a : b
    ).date;

    // Calculate consistency (how stable the mood is)
    const variance = calculateVariance(moodLevels);
    const consistency = Math.max(0, 1 - (variance / 25)); // Normalize to 0-1

    return {
      title: `My ${days}-Day Mood Journey`,
      insights,
      statistics: {
        averageMood: Math.round(averageMood * 10) / 10,
        bestDay,
        worstDay,
        consistency: Math.round(consistency * 100) / 100,
      },
    };
  } catch (error) {
    console.error('Error generating mood insights:', error);
    return null;
  }
};

const generateKeyFinding = (
  moodLevel: number,
  foods: any[],
  weather: any
): string => {
  if (moodLevel >= 8) return '🌟 Excellent day! Feeling great!';
  if (moodLevel >= 6) return '😊 Good day with positive vibes';
  if (moodLevel >= 4) return '😐 Neutral day, things are okay';
  if (moodLevel >= 2) return '😔 Challenging day, but managing';
  return '😞 Difficult day, seeking support';
};

const calculateVariance = (values: number[]): number => {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
};

export const shareInsightsAsImage = async (insight: ShareableInsight): Promise<void> => {
  try {
    const content = `
${insight.title}
${'='.repeat(40)}

STATISTICS
Average Mood: ${insight.statistics.averageMood}/10
Best Day: ${insight.statistics.bestDay}
Worst Day: ${insight.statistics.worstDay}
Mood Consistency: ${Math.round(insight.statistics.consistency * 100)}%

TOP INSIGHTS
${insight.insights.map((i, idx) => `
${idx + 1}. ${i.date}
   Mood: ${i.moodLevel}/10
   Emotions: ${i.topEmotions.join(', ')}
   ${i.topFood ? `Top Food: ${i.topFood}` : ''}
   ${i.weatherCondition ? `Weather: ${i.weatherCondition}` : ''}
   ${i.keyFinding}
`).join('\n')}

Shared anonymously from ModestApp
`;

    await Share.share({
      message: content,
      title: insight.title,
    });
  } catch (error) {
    console.error('Error sharing insights:', error);
  }
};

export const shareInsightToFriends = async (
  insight: ShareableInsight,
  friendEmails: string[]
): Promise<void> => {
  try {
    // In a real app, this would send via email or messaging
    const message = formatInsightForSharing(insight);
    console.log('Would share to:', friendEmails);
    console.log('Message:', message);
  } catch (error) {
    console.error('Error sharing insight:', error);
  }
};

const formatInsightForSharing = (insight: ShareableInsight): string => {
  return `
Check out my mood insights from ModestApp!

${insight.title}

My average mood: ${insight.statistics.averageMood}/10
Mood consistency: ${Math.round(insight.statistics.consistency * 100)}%

${insight.insights.slice(0, 3).map(i => 
  `• ${i.date}: ${i.keyFinding}`
).join('\n')}

Anonymous mood tracking on ModestApp 🌟
  `;
};

export const getCommunityAverages = async (): Promise<{
  averageMood: number;
  totalUsers: number;
  mostCommonEmotion: string;
}> => {
  try {
    // Fetch aggregated, anonymous community data
    const { data, error } = await supabase
      .from('mood_ratings')
      .select('mood_level');

    if (error) throw error;

    const moodLevels = (data || []).map((d: any) => d.mood_level);
    const averageMood = moodLevels.reduce((a, b) => a + b, 0) / moodLevels.length || 0;

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      totalUsers: data?.length || 0,
      mostCommonEmotion: 'peaceful', // This would be calculated from aggregate data
    };
  } catch (error) {
    console.error('Error getting community averages:', error);
    return {
      averageMood: 5,
      totalUsers: 0,
      mostCommonEmotion: 'neutral',
    };
  }
};

export const generatePublicMoodChallenge = async (
  challengeName: string,
  duration: number
): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    await supabase.from('mood_challenges').insert({
      user_id: user.id,
      name: challengeName,
      duration,
      created_at: new Date().toISOString(),
      is_public: true,
    });
  } catch (error) {
    console.error('Error creating mood challenge:', error);
  }
};
