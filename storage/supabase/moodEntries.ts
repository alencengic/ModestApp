import { supabase } from '@/lib/supabase';

export interface MoodEntry {
  id: number;
  user_id: string;
  mood_label: string;
  emoji?: string;
  date: string;
  created_at: string;
}

export interface MoodRating {
  id: number;
  user_id: string;
  mood: string;
  date: string;
  weather_id?: number;
  created_at: string;
}

export const insertOrReplaceMoodEntry = async (moodEntry: {
  mood_label: string;
  emoji: string;
  date: string;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('mood_entries')
    .upsert({
      user_id: user.id,
      ...moodEntry,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getMoodByDate = async (date: string): Promise<MoodEntry | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};

export const insertOrUpdateMood = async (mood: string, date: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('mood_ratings')
    .upsert(
      {
        user_id: user.id,
        mood,
        date,
      },
      {
        onConflict: 'user_id,date',
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAllMoodRatings = async (): Promise<MoodRating[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('mood_ratings')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getMoodRatingsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<MoodRating[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('mood_ratings')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};