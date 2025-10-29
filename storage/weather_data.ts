import { openDatabase } from "./db_connection";

export interface WeatherData {
  id: number;
  date: string;
  temperature: number;
  condition: string;
  humidity: number;
  pressure: number;
  location_name: string | null;
  fetched_at: string;
}

export const insertWeatherData = async (weather: {
  date: string;
  temperature: number;
  condition: string;
  humidity: number;
  pressure: number;
  location_name: string | null;
  fetched_at: string;
}): Promise<number> => {
  const db = await openDatabase();
  const result = await db.runAsync(
    `INSERT OR REPLACE INTO weather_data
     (date, temperature, condition, humidity, pressure, location_name, fetched_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    weather.date,
    weather.temperature,
    weather.condition,
    weather.humidity,
    weather.pressure,
    weather.location_name,
    weather.fetched_at
  );
  return result.lastInsertRowId;
};

export const getWeatherByDate = async (
  date: string
): Promise<WeatherData | null> => {
  const db = await openDatabase();
  const weather = await db.getFirstAsync<WeatherData>(
    "SELECT * FROM weather_data WHERE date = ?",
    date
  );
  return weather || null;
};

export const getAllWeatherData = async (): Promise<WeatherData[]> => {
  const db = await openDatabase();
  const weatherData = await db.getAllAsync<WeatherData>(
    "SELECT * FROM weather_data ORDER BY date DESC"
  );
  return weatherData;
};

export const getWeatherMoodCorrelation = async () => {
  const db = await openDatabase();
  const correlation = await db.getAllAsync<{
    mood: string;
    temperature: number;
    condition: string;
    humidity: number;
    pressure: number;
    date: string;
  }>(
    `SELECT
      mr.mood,
      wd.temperature,
      wd.condition,
      wd.humidity,
      wd.pressure,
      mr.date
     FROM mood_ratings mr
     LEFT JOIN weather_data wd ON mr.date = wd.date
     WHERE wd.id IS NOT NULL
     ORDER BY mr.date DESC`
  );
  return correlation;
};
