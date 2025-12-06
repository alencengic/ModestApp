import { supabase } from '@/lib/supabase';
import { DateTime } from 'luxon';

export interface JournalSearchResult {
  id: number;
  date: string;
  content: string;
  mood?: number;
  relevance: number; // 0-1
}

export const searchJournalEntries = async (
  query: string,
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    moodMin?: number;
    moodMax?: number;
    tags?: string[];
  }
): Promise<JournalSearchResult[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let q = supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id);

    if (filters?.dateFrom) {
      q = q.gte('date', filters.dateFrom);
    }
    if (filters?.dateTo) {
      q = q.lte('date', filters.dateTo);
    }

    const { data, error } = await q.order('date', { ascending: false });

    if (error) throw error;

    // Filter by mood
    let results = data || [];
    if (filters?.moodMin !== undefined || filters?.moodMax !== undefined) {
      results = results.filter(entry => {
        if (entry.mood === undefined) return true;
        if (filters.moodMin !== undefined && entry.mood < filters.moodMin) return false;
        if (filters.moodMax !== undefined && entry.mood > filters.moodMax) return false;
        return true;
      });
    }

    // Search by text
    if (query) {
      results = results.map(entry => ({
        ...entry,
        relevance: calculateRelevance(entry.content, query),
      }));
      
      results = results
        .filter(r => r.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance);
    }

    return results;
  } catch (error) {
    console.error('Error searching journal entries:', error);
    return [];
  }
};

const calculateRelevance = (content: string, query: string): number => {
  const text = content.toLowerCase();
  const q = query.toLowerCase();

  if (text === q) return 1;
  if (text.includes(q)) return 0.8;
  
  const words = q.split(' ');
  const matchedWords = words.filter(w => text.includes(w)).length;
  
  return matchedWords > 0 ? matchedWords / words.length * 0.6 : 0;
};

export const getRecentSearches = async (): Promise<string[]> => {
  try {
    const searches = await AsyncStorage.getItem('recent_searches');
    return searches ? JSON.parse(searches) : [];
  } catch {
    return [];
  }
};

export const saveSearch = async (query: string): Promise<void> => {
  try {
    const searches = await getRecentSearches();
    const updated = [query, ...searches.filter(s => s !== query)].slice(0, 10);
    await AsyncStorage.setItem('recent_searches', JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving search:', error);
  }
};

import AsyncStorage from '@react-native-async-storage/async-storage';

export const filterByMoodLevel = async (moodLevel: number): Promise<JournalSearchResult[]> => {
  return searchJournalEntries('', { moodMin: moodLevel, moodMax: moodLevel });
};

export const filterByDateRange = async (days: number): Promise<JournalSearchResult[]> => {
  const dateFrom = DateTime.now().minus({ days }).toISODate();
  return searchJournalEntries('', { dateFrom });
};

export const filterByTag = async (tag: string): Promise<JournalSearchResult[]> => {
  return searchJournalEntries(tag);
};
