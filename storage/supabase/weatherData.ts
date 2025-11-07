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

  const { data, error } = await supabase
    .from('mood_ratings')
    .select(`
      mood,
      date,
      weather_data!inner(
        temperature,
        condition,
        humidity,
        pressure
      )
    `)
    .eq('user_id', user.id)
    .not('weather_data', 'is', null)
    .order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    mood: item.mood,
    temperature: item.weather_data.temperature,
    condition: item.weather_data.condition,
    humidity: item.weather_data.humidity,
    pressure: item.weather_data.pressure,
    date: item.date,
  }));
};