import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { scaleFontSize } from '@/utils/responsive';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  onPress?: () => void;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
  totalEntries,
  onPress,
}) => {
  const { theme } = useTheme();

  const getStreakEmoji = (streak: number): string => {
    if (streak === 0) return '🌱';
    if (streak < 3) return '🔥';
    if (streak < 7) return '⭐';
    if (streak < 14) return '💪';
    if (streak < 30) return '🏆';
    if (streak < 60) return '👑';
    if (streak < 100) return '💯';
    return '🌟';
  };

  const getStreakMessage = (streak: number): string => {
    if (streak === 0) return 'Start your journey today!';
    if (streak === 1) return 'Great start!';
    if (streak < 3) return 'Keep it up!';
    if (streak < 7) return 'You\'re on fire!';
    if (streak < 14) return 'Amazing progress!';
    if (streak < 30) return 'Incredible dedication!';
    if (streak < 60) return 'You\'re unstoppable!';
    if (streak < 100) return 'Legendary streak!';
    return 'You\'re a champion!';
  };

  const getStreakColor = (): string => {
    if (currentStreak === 0) return theme.colors.border;
    if (currentStreak < 7) return theme.colors.warning;
    if (currentStreak < 30) return theme.colors.primary;
    if (currentStreak < 100) return theme.colors.success;
    return theme.colors.primaryDark;
  };

  const Card = onPress ? TouchableOpacity : View;
  const streakColor = getStreakColor();

  const styles = useMemo(() => StyleSheet.create({
    cardWrapper: {
      margin: 16,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      ...theme.shadows.md,
    },
    container: {
      padding: theme.spacing.lg,
    },
    mainSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    emoji: {
      fontSize: scaleFontSize(56),
      marginRight: theme.spacing.md,
    },
    streakInfo: {
      flex: 1,
    },
    streakNumber: {
      fontSize: scaleFontSize(48),
      fontWeight: '800',
      color: theme.colors.textPrimary,
      lineHeight: scaleFontSize(48),
    },
    streakLabel: {
      fontSize: scaleFontSize(16),
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    streakMessage: {
      fontSize: scaleFontSize(14),
      fontWeight: '500',
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    statsSection: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: scaleFontSize(24),
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    statLabel: {
      fontSize: scaleFontSize(12),
      fontWeight: '500',
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    divider: {
      width: 1,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.md,
    },
    ctaSection: {
      marginTop: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    ctaText: {
      fontSize: scaleFontSize(14),
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
  }), [theme, streakColor, currentStreak]);

  return (
    <Card onPress={onPress} style={styles.cardWrapper} activeOpacity={0.8}>
      <View style={styles.container}>
        <View style={styles.mainSection}>
          <Text style={styles.emoji}>{getStreakEmoji(currentStreak)}</Text>
          <View style={styles.streakInfo}>
            <Text style={styles.streakNumber}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
            <Text style={styles.streakMessage}>{getStreakMessage(currentStreak)}</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalEntries}</Text>
            <Text style={styles.statLabel}>Total Entries</Text>
          </View>
        </View>

        {currentStreak === 0 && (
          <View style={styles.ctaSection}>
            <Text style={styles.ctaText}>Make your first entry today! 🎯</Text>
          </View>
        )}
      </View>
    </Card>
  );
};
