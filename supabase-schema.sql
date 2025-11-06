-- Supabase Database Schema for ModestApp
-- This file contains the SQL commands to set up the database schema in Supabase
-- Run these commands in your Supabase SQL editor

-- Enable Row Level Security for all tables
-- User profiles will be automatically created via trigger

-- 1. User profiles table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  age INTEGER,
  weight REAL,
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lbs')),
  working_days TEXT, -- JSON string of working days
  sport_days TEXT,   -- JSON string of sport days
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Food intakes table
CREATE TABLE public.food_intakes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  breakfast TEXT,
  lunch TEXT,
  dinner TEXT,
  snacks TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 3. Mood entries table
CREATE TABLE public.mood_entries (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood_label TEXT NOT NULL,
  emoji TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 4. Productivity ratings table
CREATE TABLE public.productivity_ratings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  productivity INTEGER NOT NULL CHECK (productivity >= 1 AND productivity <= 10),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 5. Symptom entries table
CREATE TABLE public.symptom_entries (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_id TEXT,
  meal_type_tag TEXT CHECK (meal_type_tag IN ('breakfast', 'lunch', 'dinner', 'snack')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  bloating TEXT NOT NULL CHECK (bloating IN ('None', 'Mild', 'Moderate', 'Severe')),
  energy INTEGER NOT NULL CHECK (energy >= 1 AND energy <= 10),
  stool_consistency INTEGER NOT NULL CHECK (stool_consistency >= 1 AND stool_consistency <= 7),
  diarrhea INTEGER NOT NULL CHECK (diarrhea IN (0, 1)),
  nausea INTEGER NOT NULL CHECK (nausea IN (0, 1)),
  pain INTEGER NOT NULL CHECK (pain IN (0, 1))
);

-- 6. Weather data table
CREATE TABLE public.weather_data (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  temperature REAL NOT NULL,
  condition TEXT NOT NULL,
  humidity INTEGER NOT NULL,
  pressure REAL NOT NULL,
  location_name TEXT,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 7. Mood ratings table (for historical compatibility)
CREATE TABLE public.mood_ratings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood TEXT NOT NULL,
  date DATE NOT NULL,
  weather_id INTEGER REFERENCES public.weather_data(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 8. Meals table
CREATE TABLE public.meals (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  foods TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Weight history table
CREATE TABLE public.weight_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight REAL NOT NULL,
  weight_unit TEXT NOT NULL CHECK (weight_unit IN ('kg', 'lbs')),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Journal entries table
CREATE TABLE public.journal_entries (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  note TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productivity_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Food intakes policies
CREATE POLICY "Users can view own food intakes" ON public.food_intakes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food intakes" ON public.food_intakes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food intakes" ON public.food_intakes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food intakes" ON public.food_intakes
  FOR DELETE USING (auth.uid() = user_id);

-- Mood entries policies
CREATE POLICY "Users can view own mood entries" ON public.mood_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries" ON public.mood_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries" ON public.mood_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Productivity ratings policies
CREATE POLICY "Users can view own productivity ratings" ON public.productivity_ratings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own productivity ratings" ON public.productivity_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own productivity ratings" ON public.productivity_ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Symptom entries policies
CREATE POLICY "Users can view own symptom entries" ON public.symptom_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptom entries" ON public.symptom_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptom entries" ON public.symptom_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptom entries" ON public.symptom_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Weather data policies
CREATE POLICY "Users can view own weather data" ON public.weather_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weather data" ON public.weather_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weather data" ON public.weather_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Mood ratings policies
CREATE POLICY "Users can view own mood ratings" ON public.mood_ratings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood ratings" ON public.mood_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood ratings" ON public.mood_ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Meals policies
CREATE POLICY "Users can view own meals" ON public.meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals" ON public.meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals" ON public.meals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals" ON public.meals
  FOR DELETE USING (auth.uid() = user_id);

-- Weight history policies
CREATE POLICY "Users can view own weight history" ON public.weight_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight history" ON public.weight_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Journal entries policies
CREATE POLICY "Users can view own journal entries" ON public.journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries" ON public.journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" ON public.journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" ON public.journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, created_at, updated_at)
  VALUES (new.id, NOW(), NOW());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Indexes for better performance
CREATE INDEX idx_food_intakes_user_id_date ON public.food_intakes(user_id, date);
CREATE INDEX idx_mood_entries_user_id_date ON public.mood_entries(user_id, date);
CREATE INDEX idx_productivity_ratings_user_id_date ON public.productivity_ratings(user_id, date);
CREATE INDEX idx_symptom_entries_user_id ON public.symptom_entries(user_id);
CREATE INDEX idx_weather_data_user_id_date ON public.weather_data(user_id, date);
CREATE INDEX idx_mood_ratings_user_id_date ON public.mood_ratings(user_id, date);
CREATE INDEX idx_meals_user_id ON public.meals(user_id);
CREATE INDEX idx_weight_history_user_id_date ON public.weight_history(user_id, date);
CREATE INDEX idx_journal_entries_user_id_date ON public.journal_entries(user_id, date);