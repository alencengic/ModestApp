// Common types across the application

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  language: 'en' | 'hr';
  theme: 'light' | 'dark' | 'auto';
  created_at: string;
  updated_at: string;
}

export interface MoodEntry {
  id: number;
  user_id: string;
  date: string;
  mood: number;
  weather_id?: number;
  created_at: string;
}

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

export interface FoodIntake {
  id: number;
  user_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: string[];
  feeling?: string;
  created_at: string;
}

export interface JournalEntry {
  id: number;
  user_id: string;
  date: string;
  content: string;
  mood?: number;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: 'success' | 'error' | 'loading';
}
