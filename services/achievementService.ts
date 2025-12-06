import { supabase } from '@/lib/supabase';
import { DateTime } from 'luxon';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate?: string;
  progress: number;
  target: number;
  badge: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  lastEntryDate: string;
  milestone?: {
    reached: number;
    nextMilestone: number;
    celebration: string;
  };
}

const ACHIEVEMENTS = [
  {
    id: 'first_entry',
    name: 'First Step',
    description: 'Write your first journal entry',
    icon: '📝',
    target: 1,
    badge: 'bronze' as const,
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Journal for 7 consecutive days',
    icon: '🔥',
    target: 7,
    badge: 'silver' as const,
  },
  {
    id: 'month_master',
    name: 'Month Master',
    description: 'Journal for 30 consecutive days',
    icon: '⭐',
    target: 30,
    badge: 'gold' as const,
  },
  {
    id: 'century',
    name: 'Century Club',
    description: 'Reach a 100-day streak',
    icon: '🏆',
    target: 100,
    badge: 'platinum' as const,
  },
  {
    id: 'mood_explorer',
    name: 'Mood Explorer',
    description: 'Log moods for 10 different days',
    icon: '🎭',
    target: 10,
    badge: 'silver' as const,
  },
  {
    id: 'food_logger',
    name: 'Food Logger',
    description: 'Track your meals for 20 days',
    icon: '🍎',
    target: 20,
    badge: 'gold' as const,
  },
  {
    id: 'weather_watcher',
    name: 'Weather Watcher',
    description: 'Correlate 15 weather entries with mood',
    icon: '🌤️',
    target: 15,
    badge: 'silver' as const,
  },
  {
    id: 'insight_seeker',
    name: 'Insight Seeker',
    description: 'Discover 5 mood correlations',
    icon: '💡',
    target: 5,
    badge: 'gold' as const,
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Log entries before 9 AM for 10 days',
    icon: '🌅',
    target: 10,
    badge: 'silver' as const,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Log entries after 9 PM for 10 days',
    icon: '🌙',
    target: 10,
    badge: 'silver' as const,
  },
];

export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const [journalData, moodData, foodData, weatherData, streakData] = await Promise.all([
      supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false }),
      supabase
        .from('mood_ratings')
        .select('*')
        .eq('user_id', user.id),
      supabase
        .from('food_intakes')
        .select('*')
        .eq('user_id', user.id),
      supabase
        .from('weather_data')
        .select('*')
        .eq('user_id', user.id),
      getStreakData(),
    ]);

    const achievements: Achievement[] = ACHIEVEMENTS.map(ach => {
      let progress = 0;
      let earnedDate: string | undefined;

      switch (ach.id) {
        case 'first_entry':
          progress = journalData.data && journalData.data.length > 0 ? 1 : 0;
          earnedDate = journalData.data?.[journalData.data.length - 1]?.created_at;
          break;
        case 'week_warrior':
        case 'month_master':
        case 'century':
          progress = streakData.currentStreak;
          if (progress >= ach.target) {
            earnedDate = new Date().toISOString();
          }
          break;
        case 'mood_explorer':
          progress = moodData.data?.length || 0;
          break;
        case 'food_logger':
          progress = foodData.data?.length || 0;
          break;
        case 'weather_watcher':
          progress = weatherData.data?.length || 0;
          break;
        case 'insight_seeker':
          progress = Math.min((weatherData.data?.length || 0) / 3, ach.target);
          break;
        case 'early_bird':
          progress = (journalData.data || []).filter(j => {
            const hour = new Date(j.created_at).getHours();
            return hour < 9;
          }).length;
          break;
        case 'night_owl':
          progress = (journalData.data || []).filter(j => {
            const hour = new Date(j.created_at).getHours();
            return hour > 21;
          }).length;
          break;
      }

      return {
        ...ach,
        progress: Math.min(progress, ach.target),
        earnedDate,
      };
    });

    return achievements;
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};

export const getStreakData = async (): Promise<StreakData> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Calculate streak from all entry types (journal, mood, food)
    const [journalRes, moodRes, foodRes] = await Promise.all([
      supabase
        .from('journal_entries')
        .select('date')
        .eq('user_id', user.id),
      supabase
        .from('mood_ratings')
        .select('date')
        .eq('user_id', user.id),
      supabase
        .from('food_intakes')
        .select('date')
        .eq('user_id', user.id),
    ]);

    // Combine all dates from all sources
    const allDates: string[] = [];
    if (journalRes.data) allDates.push(...journalRes.data.map(e => e.date));
    if (moodRes.data) allDates.push(...moodRes.data.map(e => e.date));
    if (foodRes.data) allDates.push(...foodRes.data.map(e => e.date));

    if (allDates.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalEntries: 0,
        lastEntryDate: '',
      };
    }

    // Get unique dates and sort descending (most recent first)
    const uniqueDates = [...new Set(allDates)].sort().reverse();
    const totalEntries = uniqueDates.length;
    const lastEntryDate = uniqueDates[0] || '';

    // Calculate current streak
    let currentStreak = 0;
    const today = DateTime.now().toISODate();
    const yesterday = DateTime.now().minus({ days: 1 }).toISODate();
    
    // Check if there's an entry today or yesterday to start the streak
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = DateTime.fromISO(uniqueDates[i - 1]);
        const prevDate = DateTime.fromISO(uniqueDates[i]);
        const diff = currentDate.diff(prevDate, 'days').days;
        
        if (diff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = currentStreak;
    let tempStreak = 1;
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const currentDate = DateTime.fromISO(uniqueDates[i - 1]);
      const prevDate = DateTime.fromISO(uniqueDates[i]);
      const diff = currentDate.diff(prevDate, 'days').days;
      
      if (diff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    const streakData: StreakData = {
      currentStreak,
      longestStreak,
      totalEntries,
      lastEntryDate,
    };

    // Calculate milestone
    const milestones = [7, 14, 30, 60, 100, 365];
    for (const milestone of milestones) {
      if (currentStreak < milestone && currentStreak >= milestone - 1) {
        streakData.milestone = {
          reached: currentStreak,
          nextMilestone: milestone,
          celebration: getCelebrationMessage(milestone),
        };
        break;
      }
    }

    return streakData;
  } catch (error) {
    console.error('Error getting streak data:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalEntries: 0,
      lastEntryDate: '',
    };
  }
};

const getCelebrationMessage = (milestone: number): string => {
  const messages: Record<number, string> = {
    7: '🔥 One week! You\'re on fire!',
    14: '💪 Two weeks! Consistency is key!',
    30: '⭐ One month! You\'re crushing it!',
    60: '🚀 Two months! Unstoppable!',
    100: '🏆 Century! You\'re a legend!',
    365: '👑 One year! You\'ve earned your crown!',
  };
  return messages[milestone] || `🎉 ${milestone} days! Amazing!`;
};

export const checkNewAchievements = async (): Promise<Achievement[]> => {
  const achievements = await getAchievements();
  return achievements.filter(a => a.earnedDate && !isAchievementOlder(a.earnedDate));
};

const isAchievementOlder = (date: string): boolean => {
  const achievedDate = new Date(date);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return achievedDate < oneDayAgo;
};

export const celebrateAchievement = (achievement: Achievement): {
  title: string;
  message: string;
  animation: string;
} => {
  const badgeEmoji = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '👑',
  };

  return {
    title: `${badgeEmoji[achievement.badge]} ${achievement.name}!`,
    message: achievement.description,
    animation: 'confetti',
  };
};
