import { supabase } from '@/lib/supabase';

export interface ProductivityEntry {
  id: number;
  user_id: string;
  productivity: number;
  date: string;
  created_at: string;
}

export const insertOrUpdateProductivity = async (
  productivity: number,
  date: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('productivity_ratings')
    .upsert(
      {
        user_id: user.id,
        productivity,
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

export const getProductivityByDate = async (
  date: string
): Promise<ProductivityEntry | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('productivity_ratings')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};

export const getAllProductivityRatings = async (): Promise<ProductivityEntry[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('productivity_ratings')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getProductivityRatingsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<ProductivityEntry[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('productivity_ratings')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};