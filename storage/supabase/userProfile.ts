import { supabase } from '@/lib/supabase';

export type WeightUnit = "kg" | "lbs";
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface UserProfile {
  id: string;
  name?: string;
  age?: number;
  weight?: number;
  weight_unit?: WeightUnit;
  working_days?: string; // JSON string
  sport_days?: string;   // JSON string
  created_at: string;
  updated_at: string;
}

export interface UserProfileInput {
  name?: string;
  age?: number;
  weight?: number;
  weight_unit?: WeightUnit;
  working_days?: string[];
  sport_days?: string[];
}

export interface WeightHistoryEntry {
  id: number;
  user_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  created_at: string;
}

/**
 * Get user profile for the current authenticated user
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw error;
  }

  return data;
};

/**
 * Create or update user profile
 */
export const upsertUserProfile = async (input: UserProfileInput): Promise<UserProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const profileData = {
    id: user.id,
    name: input.name,
    age: input.age,
    weight: input.weight,
    weight_unit: input.weight_unit || 'kg',
    working_days: input.working_days ? JSON.stringify(input.working_days) : null,
    sport_days: input.sport_days ? JSON.stringify(input.sport_days) : null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(profileData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update user weight
 */
export const updateUserWeight = async (weight: number, unit: 'kg' | 'lbs'): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('user_profiles')
    .update({
      weight,
      weight_unit: unit,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) throw error;
};

/**
 * Get working days
 */
export const getWorkingDays = async (): Promise<string[]> => {
  const profile = await getUserProfile();
  if (!profile || !profile.working_days) return [];
  
  try {
    return JSON.parse(profile.working_days);
  } catch {
    return [];
  }
};

/**
 * Update working days
 */
export const updateWorkingDays = async (workingDays: string[]): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('user_profiles')
    .update({
      working_days: JSON.stringify(workingDays),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) throw error;
};

/**
 * Get sport days
 */
export const getSportDays = async (): Promise<string[]> => {
  const profile = await getUserProfile();
  if (!profile || !profile.sport_days) return [];
  
  try {
    return JSON.parse(profile.sport_days);
  } catch {
    return [];
  }
};

/**
 * Update sport days
 */
export const updateSportDays = async (sportDays: string[]): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('user_profiles')
    .update({
      sport_days: JSON.stringify(sportDays),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) throw error;
};

/**
 * Add weight history entry
 */
export const addWeightHistoryEntry = async (
  weight: number,
  unit: 'kg' | 'lbs',
  date?: Date
): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const entryDate = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('weight_history')
    .insert({
      user_id: user.id,
      weight,
      weight_unit: unit,
      date: entryDate,
    });

  if (error) throw error;

  // Also update current weight in profile
  await updateUserWeight(weight, unit);
};

/**
 * Get weight history
 */
export const getWeightHistory = async (limit: number = 30): Promise<WeightHistoryEntry[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('weight_history')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

/**
 * Get weight history for date range
 */
export const getWeightHistoryByDateRange = async (
  startDate: string,
  endDate: string
): Promise<WeightHistoryEntry[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('weight_history')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Convert weight between units
 */
export const convertWeight = (weight: number, from: 'kg' | 'lbs', to: 'kg' | 'lbs'): number => {
  if (from === to) return weight;
  if (from === "kg" && to === "lbs") return weight * 2.20462;
  if (from === "lbs" && to === "kg") return weight / 2.20462;
  return weight;
};

/**
 * Check if a date is a working day
 */
export const isWorkingDay = async (date: Date): Promise<boolean> => {
  const workingDays = await getWorkingDays();
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  return workingDays.includes(dayName);
};

/**
 * Check if a date is a sport day
 */
export const isSportDay = async (date: Date): Promise<boolean> => {
  const sportDays = await getSportDays();
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  return sportDays.includes(dayName);
};