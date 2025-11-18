import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/context/ThemeContext';
import { scaleFontSize, scale } from '@/utils/responsive';
import {
  getAllAchievementsWithStatus,
  getUserStreak,
  ACHIEVEMENTS,
} from '@/storage/supabase/streaks';

export default function AchievementsScreen() {
  const { theme } = useTheme();

  const { data: achievementsWithStatus, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievementsWithStatus'],
    queryFn: getAllAchievementsWithStatus,
  });

  const { data: streak, isLoading: streakLoading } = useQuery({
    queryKey: ['userStreak'],
    queryFn: getUserStreak,
  });

  const isLoading = achievementsLoading || streakLoading;

  const getProgressForAchievement = (achievement: typeof ACHIEVEMENTS[0]) => {
    if (!streak) return 0;

    if (achievement.category === 'streak') {
      return Math.min((streak.longest_streak / achievement.requirement) * 100, 100);
    } else if (achievement.category === 'entries') {
      return Math.min((streak.total_entries / achievement.requirement) * 100, 100);
    }
    return 0;
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.sm,
    },
    headerTitle: {
      fontSize: scaleFontSize(24),
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    scrollContent: {
      padding: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: scaleFontSize(18),
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    achievementCard: {
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      ...theme.shadows.md,
    },
    lockedCard: {
      opacity: 0.6,
    },
    achievementContent: {
      flexDirection: 'row',
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    emojiContainer: {
      width: scale(60),
      height: scale(60),
      borderRadius: scale(30),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    unlockedEmoji: {
      backgroundColor: theme.colors.primary + '20',
    },
    lockedEmoji: {
      backgroundColor: theme.colors.border,
    },
    emoji: {
      fontSize: scaleFontSize(32),
    },
    achievementInfo: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: scaleFontSize(16),
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs / 2,
    },
    achievementDescription: {
      fontSize: scaleFontSize(13),
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    progressBar: {
      flex: 1,
      height: scale(6),
      backgroundColor: theme.colors.border,
      borderRadius: scale(3),
      overflow: 'hidden',
      marginRight: theme.spacing.sm,
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    progressText: {
      fontSize: scaleFontSize(11),
      fontWeight: '600',
      color: theme.colors.textSecondary,
      minWidth: scale(45),
    },
    checkIcon: {
      marginLeft: theme.spacing.sm,
    },
    unlockedDate: {
      fontSize: scaleFontSize(11),
      color: theme.colors.textSecondary,
      opacity: 0.7,
      marginTop: theme.spacing.xs / 2,
    },
    statsCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: scaleFontSize(28),
      fontWeight: '800',
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      fontSize: scaleFontSize(13),
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: scaleFontSize(16),
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Achievements</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading achievements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const unlockedAchievements = achievementsWithStatus?.filter(a => a.unlocked) || [];
  const lockedAchievements = achievementsWithStatus?.filter(a => !a.unlocked) || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{unlockedAchievements.length}</Text>
              <Text style={styles.statLabel}>Unlocked</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{ACHIEVEMENTS.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}%
              </Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>
        </View>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Unlocked</Text>
            {unlockedAchievements.map((achievement) => (
              <View key={achievement.key} style={styles.achievementCard}>
                <View style={styles.achievementContent}>
                  <View style={[styles.emojiContainer, styles.unlockedEmoji]}>
                    <Text style={styles.emoji}>{achievement.emoji}</Text>
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                    {achievement.unlockedAt && (
                      <Text style={styles.unlockedDate}>
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={28}
                    color={theme.colors.primary}
                    style={styles.checkIcon}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔒 Locked</Text>
            {lockedAchievements.map((achievement) => {
              const progress = getProgressForAchievement(achievement);
              return (
                <View key={achievement.key} style={[styles.achievementCard, styles.lockedCard]}>
                  <View style={styles.achievementContent}>
                    <View style={[styles.emojiContainer, styles.lockedEmoji]}>
                      <Text style={styles.emoji}>{achievement.emoji}</Text>
                    </View>
                    <View style={styles.achievementInfo}>
                      <Text style={styles.achievementTitle}>{achievement.title}</Text>
                      <Text style={styles.achievementDescription}>
                        {achievement.description}
                      </Text>
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View style={[styles.progressFill, { width: `${progress}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
