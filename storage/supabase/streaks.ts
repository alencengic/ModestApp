import { supabase } from '@/lib/supabase';
import { DateTime } from 'luxon';
import { showAchievementNotification, showMilestoneNotification } from '@/services/streakNotificationService';

export interface UserStreak {
  id: number;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_entry_date: string | null;
  total_entries: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: number;
  user_id: string;
  achievement_key: string;
  unlocked_at: string;
}

export interface AchievementDefinition {
  key: string;
  title: string;
  description: string;
  emoji: string;
  requirement: number;
  category: 'streak' | 'entries' | 'milestone';
}

// Achievement definitions
export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Streak achievements
  { key: 'streak_3', title: 'Getting Started', description: 'Log 3 days in a row', emoji: '🔥', requirement: 3, category: 'streak' },
  { key: 'streak_7', title: 'Week Warrior', description: 'Log 7 days in a row', emoji: '⭐', requirement: 7, category: 'streak' },
  { key: 'streak_14', title: 'Two Week Champion', description: 'Log 14 days in a row', emoji: '💪', requirement: 14, category: 'streak' },
  { key: 'streak_30', title: 'Monthly Master', description: 'Log 30 days in a row', emoji: '🏆', requirement: 30, category: 'streak' },
  { key: 'streak_60', title: 'Commitment King', description: 'Log 60 days in a row', emoji: '👑', requirement: 60, category: 'streak' },
  { key: 'streak_100', title: 'Century Club', description: 'Log 100 days in a row', emoji: '💯', requirement: 100, category: 'streak' },
  { key: 'streak_365', title: 'Year Legend', description: 'Log 365 days in a row', emoji: '🌟', requirement: 365, category: 'streak' },

  // Total entries achievements
  { key: 'entries_10', title: 'First Steps', description: 'Make 10 total entries', emoji: '🎯', requirement: 10, category: 'entries' },
  { key: 'entries_50', title: 'Dedicated Tracker', description: 'Make 50 total entries', emoji: '📊', requirement: 50, category: 'entries' },
  { key: 'entries_100', title: 'Data Collector', description: 'Make 100 total entries', emoji: '📈', requirement: 100, category: 'entries' },
  { key: 'entries_250', title: 'Health Enthusiast', description: 'Make 250 total entries', emoji: '🌱', requirement: 250, category: 'entries' },
  { key: 'entries_500', title: 'Wellness Pro', description: 'Make 500 total entries', emoji: '🎖️', requirement: 500, category: 'entries' },
  { key: 'entries_1000', title: 'Master Tracker', description: 'Make 1000 total entries', emoji: '💎', requirement: 1000, category: 'entries' },
];

/**
 * Get or create user streak record
 */
export const getUserStreak = async (): Promise<UserStreak | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code === 'PGRST116') {
    // No streak record exists, create one
    return await initializeUserStreak();
  }

  if (error) throw error;
  return data;
};

/**
 * Initialize a new user streak record
 */
const initializeUserStreak = async (): Promise<UserStreak> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_streaks')
    .insert({
      user_id: user.id,
      current_streak: 0,
      longest_streak: 0,
      last_entry_date: null,
      total_entries: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Calculate the user's current streak based on actual entry data
 */
export const calculateStreak = async (): Promise<{
  currentStreak: number;
  lastEntryDate: string | null;
  totalEntries: number;
}> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Fetch all dates where user has made an entry (mood, food, or productivity)
  const [moodData, foodData, prodData] = await Promise.all([
    supabase
      .from('mood_ratings')
      .select('date')
      .eq('user_id', user.id)
      .order('date', { ascending: false }),
    supabase
      .from('food_intakes')
      .select('date')
      .eq('user_id', user.id)
      .order('date', { ascending: false }),
    supabase
      .from('productivity_ratings')
      .select('date')
      .eq('user_id', user.id)
      .order('date', { ascending: false }),
  ]);

  // Combine all dates and get unique dates
  const allDates = new Set<string>();

  if (moodData.data) moodData.data.forEach((item: any) => allDates.add(item.date));
  if (foodData.data) foodData.data.forEach((item: any) => allDates.add(item.date));
  if (prodData.data) prodData.data.forEach((item: any) => allDates.add(item.date));

  const uniqueDates = Array.from(allDates).sort((a, b) => b.localeCompare(a));

  if (uniqueDates.length === 0) {
    return {
      currentStreak: 0,
      lastEntryDate: null,
      totalEntries: 0,
    };
  }

  // Calculate current streak
  const today = DateTime.now().toISODate() as string;
  const yesterday = DateTime.now().minus({ days: 1 }).toISODate() as string;

  let currentStreak = 0;
  const lastEntryDate = uniqueDates[0];

  // Only count streak if last entry was today or yesterday
  if (lastEntryDate === today || lastEntryDate === yesterday) {
    let checkDate = lastEntryDate === today ? today : yesterday;

    for (const date of uniqueDates) {
      if (date === checkDate) {
        currentStreak++;
        checkDate = DateTime.fromISO(checkDate).minus({ days: 1 }).toISODate() as string;
      } else if (date < checkDate) {
        // Gap in streak
        break;
      }
    }
  }

  return {
    currentStreak,
    lastEntryDate,
    totalEntries: uniqueDates.length,
  };
};

/**
 * Update user streak after making an entry
 */
export const updateStreak = async (): Promise<UserStreak> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Calculate current streak
  const { currentStreak, lastEntryDate, totalEntries } = await calculateStreak();

  // Get existing streak record
  let existingStreak = await getUserStreak();
  if (!existingStreak) {
    existingStreak = await initializeUserStreak();
  }

  // Update longest streak if current is higher
  const longestStreak = Math.max(currentStreak, existingStreak.longest_streak);

  // Update streak record
  const { data, error } = await supabase
    .from('user_streaks')
    .update({
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_entry_date: lastEntryDate,
      total_entries: totalEntries,
      updated_at: DateTime.now().toISO(),
    })
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;

  // Check for new achievements
  const newAchievements = await checkAndUnlockAchievements(currentStreak, longestStreak, totalEntries);

  // Show notification for milestone achievements
  if (currentStreak > (existingStreak.current_streak || 0)) {
    // Streak increased, check for milestone
    await showMilestoneNotification(currentStreak);
  }

  return data;
};

/**
 * Check and unlock achievements based on current stats
 */
const checkAndUnlockAchievements = async (
  currentStreak: number,
  longestStreak: number,
  totalEntries: number
): Promise<Achievement[]> => {
  const newAchievements: Achievement[] = [];

  // Get existing achievements
  const existingAchievements = await getUserAchievements();
  const unlockedKeys = new Set(existingAchievements.map(a => a.achievement_key));

  // Check each achievement
  for (const achievement of ACHIEVEMENTS) {
    if (unlockedKeys.has(achievement.key)) continue;

    let shouldUnlock = false;

    if (achievement.category === 'streak') {
      shouldUnlock = longestStreak >= achievement.requirement;
    } else if (achievement.category === 'entries') {
      shouldUnlock = totalEntries >= achievement.requirement;
    }

    if (shouldUnlock) {
      const unlocked = await unlockAchievement(achievement.key);
      if (unlocked) {
        newAchievements.push(unlocked);
        // Show notification for the achievement
        await showAchievementNotification(
          achievement.title,
          achievement.emoji,
          achievement.description
        );
      }
    }
  }

  return newAchievements;
};

/**
 * Unlock a specific achievement
 */
const unlockAchievement = async (achievementKey: string): Promise<Achievement | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: user.id,
        achievement_key: achievementKey,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    // Achievement might already exist
    console.log('Achievement already unlocked:', achievementKey);
    return null;
  }
};

/**
 * Get all user achievements
 */
export const getUserAchievements = async (): Promise<Achievement[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Get achievement definition by key
 */
export const getAchievementDefinition = (key: string): AchievementDefinition | undefined => {
  return ACHIEVEMENTS.find(a => a.key === key);
};

/**
 * Get all achievements with unlock status
 */
export const getAllAchievementsWithStatus = async (): Promise<Array<AchievementDefinition & { unlocked: boolean; unlockedAt?: string }>> => {
  const userAchievements = await getUserAchievements();
  const unlockedMap = new Map(userAchievements.map(a => [a.achievement_key, a.unlocked_at]));

  return ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    unlocked: unlockedMap.has(achievement.key),
    unlockedAt: unlockedMap.get(achievement.key),
  }));
};
