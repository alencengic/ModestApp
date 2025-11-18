import { supabase } from '@/lib/supabase';

export interface WeatherData {
  id: number;
  user_id: string;
  date: string;
  temperature: number;
  condition: string;
  humidity: number;
  pressure: number;
  location_name?: string;
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('weather_data')
    .upsert({
      user_id: user.id,
      ...weather,
    }, {
      onConflict: 'user_id,date'
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

export const getWeatherByDate = async (
  date: string
): Promise<WeatherData | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('weather_data')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};

export const getAllWeatherData = async (): Promise<WeatherData[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('weather_data')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getWeatherMoodCorrelation = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Fetch mood ratings
  const { data: moodRatings, error: moodError } = await supabase
    .from('mood_ratings')
    .select('mood, date')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (moodError) throw moodError;

  if (!moodRatings || moodRatings.length === 0) {
    return [];
  }

  // Fetch weather data
  const { data: weatherData, error: weatherError } = await supabase
    .from('weather_data')
    .select('date, temperature, condition, humidity, pressure')
    .eq('user_id', user.id);

  if (weatherError) throw weatherError;

  if (!weatherData || weatherData.length === 0) {
    return [];
  }

  // Create a map of weather data by date for quick lookup
  const weatherByDate = new Map(
    weatherData.map(w => [w.date, w])
  );

  // Join mood ratings with weather data by date
  return moodRatings
    .map((mood) => {
      const weather = weatherByDate.get(mood.date);
      if (!weather) return null;

      return {
        mood: mood.mood,
        temperature: weather.temperature,
        condition: weather.condition,
        humidity: weather.humidity,
        pressure: weather.pressure,
        date: mood.date,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
};