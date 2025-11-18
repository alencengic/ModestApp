import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getUserStreak } from '@/storage/supabase/streaks';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('streak-reminders', {
      name: 'Streak Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
};

/**
 * Schedule daily reminder notification
 */
export const scheduleDailyStreakReminder = async (hour: number = 20, minute: number = 0) => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Cannot schedule notification: permission denied');
      return null;
    }

    // Cancel existing streak reminders
    await cancelStreakReminders();

    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't break your streak! 🔥",
        body: "Make your daily entry to keep your streak alive!",
        data: { type: 'streak-reminder' },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    console.log('Scheduled daily streak reminder:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling streak reminder:', error);
    return null;
  }
};

/**
 * Cancel all streak reminder notifications
 */
export const cancelStreakReminders = async () => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduledNotifications) {
      if (notification.content.data?.type === 'streak-reminder') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    console.log('Cancelled all streak reminders');
  } catch (error) {
    console.error('Error cancelling streak reminders:', error);
  }
};

/**
 * Show immediate achievement notification
 */
export const showAchievementNotification = async (
  achievementTitle: string,
  achievementEmoji: string,
  achievementDescription: string
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${achievementEmoji} Achievement Unlocked!`,
        body: `${achievementTitle}: ${achievementDescription}`,
        data: { type: 'achievement' },
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.error('Error showing achievement notification:', error);
  }
};

/**
 * Show milestone notification
 */
export const showMilestoneNotification = async (streak: number) => {
  try {
    let title = '';
    let body = '';
    let emoji = '🎉';

    if (streak === 1) {
      emoji = '🌱';
      title = 'Great Start!';
      body = 'You\'ve started your journey. Keep it up!';
    } else if (streak === 3) {
      emoji = '🔥';
      title = '3 Day Streak!';
      body = 'You\'re on fire! Keep the momentum going!';
    } else if (streak === 7) {
      emoji = '⭐';
      title = 'One Week Streak!';
      body = 'Amazing! You\'ve logged 7 days in a row!';
    } else if (streak === 14) {
      emoji = '💪';
      title = 'Two Week Champion!';
      body = 'Incredible dedication! 14 days strong!';
    } else if (streak === 30) {
      emoji = '🏆';
      title = 'Monthly Master!';
      body = 'Outstanding! You\'ve completed a full month!';
    } else if (streak === 60) {
      emoji = '👑';
      title = 'Commitment King!';
      body = 'You\'re unstoppable! 60 days of dedication!';
    } else if (streak === 100) {
      emoji = '💯';
      title = 'Century Club!';
      body = 'Legendary achievement! 100 days in a row!';
    } else if (streak === 365) {
      emoji = '🌟';
      title = 'Year Legend!';
      body = 'You\'re a champion! A full year of consistency!';
    } else {
      // Don't send notification for other milestones
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${emoji} ${title}`,
        body,
        data: { type: 'milestone', streak },
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.error('Error showing milestone notification:', error);
  }
};

/**
 * Show streak at risk notification (if user hasn't made entry today)
 */
export const showStreakAtRiskNotification = async (currentStreak: number) => {
  try {
    if (currentStreak === 0) return; // No streak to lose

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Your Streak is at Risk!',
        body: `Don't lose your ${currentStreak} day streak! Make an entry today.`,
        data: { type: 'streak-at-risk' },
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.error('Error showing streak at risk notification:', error);
  }
};

/**
 * Check if notification permissions are granted
 */
export const hasNotificationPermissions = async (): Promise<boolean> => {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
};

/**
 * Get scheduled streak reminders
 */
export const getScheduledStreakReminders = async () => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    return scheduledNotifications.filter(
      notification => notification.content.data?.type === 'streak-reminder'
    );
  } catch (error) {
    console.error('Error getting scheduled streak reminders:', error);
    return [];
  }
};
