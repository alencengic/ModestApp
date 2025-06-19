import { openDatabase } from "./db_connection";

export interface MoodEntry {
  id: number;
  mood_label: string;
  emoji: string;
  date: string;
}

export const insertOrReplaceMoodEntry = async (moodEntry: {
  mood_label: string;
  emoji: string;
  date: string;
}) => {
  const db = await openDatabase();
  return await db.runAsync(
    "INSERT OR REPLACE INTO mood_entries (mood_label, emoji, date) VALUES (?, ?, ?)",
    moodEntry.mood_label,
    moodEntry.emoji,
    moodEntry.date
  );
};

export const getMoodByDate = async (
  date: string
): Promise<MoodEntry | null> => {
  const db = await openDatabase();
  const moodEntry = await db.getFirstAsync<MoodEntry>(
    "SELECT * FROM mood_entries WHERE date = ?",
    date
  );
  return moodEntry;
};

export const insertOrUpdateMood = async (mood: string, date: string) => {
  const db = await openDatabase();

  return await db.runAsync(
    `INSERT INTO mood_ratings (mood, date) VALUES (?, ?)
     ON CONFLICT(date) DO UPDATE SET mood = excluded.mood`,
    mood,
    date
  );
};
