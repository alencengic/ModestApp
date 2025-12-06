import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

export interface OfflineSyncQueue {
  id: string;
  type: 'mood' | 'food' | 'journal' | 'weather';
  data: any;
  timestamp: string;
  synced: boolean;
}

const OFFLINE_QUEUE_KEY = 'offline_sync_queue';

export const saveOfflineData = async (type: string, data: any): Promise<void> => {
  try {
    const queue = await getOfflineQueue();
    const item: OfflineSyncQueue = {
      id: `${type}_${Date.now()}`,
      type: type as any,
      data,
      timestamp: new Date().toISOString(),
      synced: false,
    };
    queue.push(item);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error saving offline data:', error);
  }
};

export const getOfflineQueue = async (): Promise<OfflineSyncQueue[]> => {
  try {
    const queue = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error('Error getting offline queue:', error);
    return [];
  }
};

export const syncOfflineData = async (): Promise<number> => {
  try {
    const queue = await getOfflineQueue();
    let syncedCount = 0;

    for (const item of queue) {
      if (item.synced) continue;

      try {
        switch (item.type) {
          case 'mood':
            await supabase.from('mood_ratings').insert([item.data]);
            break;
          case 'food':
            await supabase.from('food_intakes').insert([item.data]);
            break;
          case 'journal':
            await supabase.from('journal_entries').insert([item.data]);
            break;
        }
        item.synced = true;
        syncedCount++;
      } catch (error) {
        console.error(`Error syncing ${item.type}:`, error);
      }
    }

    // Update queue
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    
    // Clean up old synced items
    const unsyncedQueue = queue.filter(item => !item.synced);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(unsyncedQueue));

    return syncedCount;
  } catch (error) {
    console.error('Error syncing offline data:', error);
    return 0;
  }
};

export const isOnline = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.from('mood_ratings').select('count', { count: 'exact' }).limit(1);
    return !!data;
  } catch {
    return false;
  }
};

export const monitorConnection = (callback: (online: boolean) => void): (() => void) => {
  const interval = setInterval(async () => {
    const online = await isOnline();
    callback(online);
  }, 5000);

  return () => clearInterval(interval);
};
