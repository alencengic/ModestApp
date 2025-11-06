import { supabase } from '@/lib/supabase';

export interface JournalEntry {
  id: number;
  user_id: string;
  note?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export const insertJournalEntry = async (note: string, date: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: user.id,
      note,
      date,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getJournalEntriesByRange = async (
  fromDate: Date,
  toDate: Date
): Promise<{ id: number; content: string; date: string }[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const fromISO = fromDate.toISOString().split('T')[0];
  const toISO = toDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('journal_entries')
    .select('id, note, date')
    .eq('user_id', user.id)
    .gte('date', fromISO)
    .lte('date', toISO)
    .order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    content: row.note || '',
    date: row.date,
  }));
};

export const getJournalEntryById = async (
  id: number
): Promise<{ id: number; content: string; date: string } | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('journal_entries')
    .select('id, note, date')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    content: data.note || '',
    date: data.date,
  };
};

export const updateJournalEntry = async (
  id: number,
  content: string
): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('journal_entries')
    .update({
      note: content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const deleteJournalEntry = async (id: number): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
};