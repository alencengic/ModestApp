import { DateTime } from "luxon";
import { openDatabase } from "./db_connection";

export type WeightUnit = "kg" | "lbs";
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface UserProfile {
  id: number;
  name: string | null;
  age: number | null;
  weight: number | null;
  weight_unit: WeightUnit;
  working_days: string; // JSON array of DayOfWeek
  sport_days: string; // JSON array of DayOfWeek
  created_at: string;
  updated_at: string;
}

export interface WeightHistoryEntry {
  id: number;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  created_at: string;
}

export interface UserProfileInput {
  name?: string | null;
  age?: number | null;
  weight?: number | null;
  weight_unit?: WeightUnit;
  working_days?: DayOfWeek[];
  sport_days?: DayOfWeek[];
}

// Helper to get current ISO timestamp
const getCurrentTimestamp = () => {
  return DateTime.now().toISO();
};

/**
 * Get user profile (singleton - only one profile exists)
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const db = await openDatabase();
  const profile = await db.getFirstAsync<UserProfile>(
    "SELECT * FROM user_profile WHERE id = 1"
  );
  return profile || null;
};

/**
 * Create or update user profile
 */
export const upsertUserProfile = async (input: UserProfileInput): Promise<UserProfile> => {
  const db = await openDatabase();
  const existing = await getUserProfile();
  const now = getCurrentTimestamp();

  const workingDays = input.working_days ? JSON.stringify(input.working_days) : "[]";
  const sportDays = input.sport_days ? JSON.stringify(input.sport_days) : "[]";

  if (existing) {
    // Update existing profile
    await db.runAsync(
      `UPDATE user_profile
       SET name = ?, age = ?, weight = ?, weight_unit = ?, working_days = ?, sport_days = ?, updated_at = ?
       WHERE id = 1`,
      [
        input.name ?? existing.name,
        input.age ?? existing.age,
        input.weight ?? existing.weight,
        input.weight_unit ?? existing.weight_unit,
        workingDays,
        sportDays,
        now
      ]
    );
  } else {
    // Create new profile
    await db.runAsync(
      `INSERT INTO user_profile (id, name, age, weight, weight_unit, working_days, sport_days, created_at, updated_at)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.name ?? null,
        input.age ?? null,
        input.weight ?? null,
        input.weight_unit ?? "kg",
        workingDays,
        sportDays,
        now,
        now
      ]
    );
  }

  const profile = await getUserProfile();
  if (!profile) throw new Error("Failed to create/update user profile");
  return profile;
};

/**
 * Update user weight
 */
export const updateUserWeight = async (weight: number, unit: WeightUnit): Promise<void> => {
  await upsertUserProfile({ weight, weight_unit: unit });
};

/**
 * Update working days
 */
export const updateWorkingDays = async (days: DayOfWeek[]): Promise<void> => {
  await upsertUserProfile({ working_days: days });
};

/**
 * Update sport/training days
 */
export const updateSportDays = async (days: DayOfWeek[]): Promise<void> => {
  await upsertUserProfile({ sport_days: days });
};

/**
 * Get working days as array
 */
export const getWorkingDays = async (): Promise<DayOfWeek[]> => {
  const profile = await getUserProfile();
  if (!profile || !profile.working_days) return [];
  try {
    return JSON.parse(profile.working_days) as DayOfWeek[];
  } catch {
    return [];
  }
};

/**
 * Get sport days as array
 */
export const getSportDays = async (): Promise<DayOfWeek[]> => {
  const profile = await getUserProfile();
  if (!profile || !profile.sport_days) return [];
  try {
    return JSON.parse(profile.sport_days) as DayOfWeek[];
  } catch {
    return [];
  }
};

/**
 * Check if a given date is a working day
 */
export const isWorkingDay = async (date: Date): Promise<boolean> => {
  const workingDays = await getWorkingDays();
  const dayName = DateTime.fromJSDate(date).toFormat("cccc").toLowerCase() as DayOfWeek;
  return workingDays.includes(dayName);
};

/**
 * Check if a given date is a weekend day
 */
export const isWeekendDay = async (date: Date): Promise<boolean> => {
  return !(await isWorkingDay(date));
};

/**
 * Check if a given date is a sport/training day
 */
export const isSportDay = async (date: Date): Promise<boolean> => {
  const sportDays = await getSportDays();
  const dayName = DateTime.fromJSDate(date).toFormat("cccc").toLowerCase() as DayOfWeek;
  return sportDays.includes(dayName);
};

/**
 * Add weight history entry
 */
export const addWeightHistoryEntry = async (
  weight: number,
  unit: WeightUnit,
  date?: Date
): Promise<void> => {
  const db = await openDatabase();
  const entryDate = date ? DateTime.fromJSDate(date).toISODate() : DateTime.now().toISODate();
  const now = getCurrentTimestamp();

  await db.runAsync(
    `INSERT INTO weight_history (weight, weight_unit, date, created_at)
     VALUES (?, ?, ?, ?)`,
    [weight, unit, entryDate, now]
  );

  // Also update current weight in profile
  await updateUserWeight(weight, unit);
};

/**
 * Get weight history
 */
export const getWeightHistory = async (limit: number = 30): Promise<WeightHistoryEntry[]> => {
  const db = await openDatabase();
  const entries = await db.getAllAsync<WeightHistoryEntry>(
    `SELECT * FROM weight_history ORDER BY date DESC LIMIT ?`,
    [limit]
  );
  return entries;
};

/**
 * Get weight history for date range
 */
export const getWeightHistoryByDateRange = async (
  startDate: string,
  endDate: string
): Promise<WeightHistoryEntry[]> => {
  const db = await openDatabase();
  const entries = await db.getAllAsync<WeightHistoryEntry>(
    `SELECT * FROM weight_history WHERE date >= ? AND date <= ? ORDER BY date DESC`,
    [startDate, endDate]
  );
  return entries;
};

/**
 * Convert weight between units
 */
export const convertWeight = (weight: number, from: WeightUnit, to: WeightUnit): number => {
  if (from === to) return weight;
  if (from === "kg" && to === "lbs") return weight * 2.20462;
  if (from === "lbs" && to === "kg") return weight / 2.20462;
  return weight;
};
