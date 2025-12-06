import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getLatestWeeklyInsights,
  generateWeeklyInsights,
  type WeeklyInsight,
  type WeeklySummary
} from '@/services/weeklyInsightsService';
import { DateTime } from 'luxon';
import { exportDataAsCSV, generateExportSummary } from '@/services/trendsAndExportService';
import { generateAnonymousMoodInsights, shareInsightsAsImage } from '@/services/socialService';

export default function InsightsScreen() {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const { data: weeklyData, isLoading, refetch } = useQuery({
    queryKey: ['weeklyInsights'],
    queryFn: getLatestWeeklyInsights,
  });

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    try {
      await generateWeeklyInsights();
      queryClient.invalidateQueries({ queryKey: ['weeklyInsights'] });
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await exportDataAsCSV();
      Alert.alert('Success', 'Your data has been exported successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareInsights = async () => {
    setIsSharing(true);
    try {
      const insights = await generateAnonymousMoodInsights(30);
      if (insights) {
        await shareInsightsAsImage(insights);
      } else {
        Alert.alert('No Data', 'Not enough data to generate insights yet.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share insights. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const getInsightColor = (type: WeeklyInsight['type']) => {
    switch (type) {
      case 'positive':
        return theme.colors.success;
      case 'negative':
        return theme.colors.error;
      case 'suggestion':
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    title: {
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    weekRange: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    generateButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      alignItems: 'center',
      alignSelf: 'flex-start',
    },
    generateButtonText: {
      color: theme.colors.textOnPrimary,
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    content: {
      padding: theme.spacing.lg,
    },
    summarySection: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    summaryCards: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      ...theme.shadows.sm,
    },
    summaryLabel: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    summaryValue: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    summaryTrend: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: '600',
      marginTop: theme.spacing.xs,
    },
    insightsSection: {
      marginBottom: theme.spacing.lg,
    },
    insightCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderLeftWidth: 4,
      ...theme.shadows.sm,
    },
    insightHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    insightEmoji: {
      fontSize: 24,
      marginRight: theme.spacing.sm,
    },
    insightTitle: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      flex: 1,
    },
    insightDescription: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!weeklyData || weeklyData.insights.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Weekly Insights</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No insights available yet. Start logging your mood, productivity, and meals to see personalized insights!
          </Text>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateInsights}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color={theme.colors.textOnPrimary} />
            ) : (
              <Text style={styles.generateButtonText}>Generate Insights</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { moodSummary, productivitySummary, foodSummary, insights, weekStartDate, weekEndDate } = weeklyData;

  const formatWeekRange = () => {
    const start = DateTime.fromISO(weekStartDate).toFormat('MMM d');
    const end = DateTime.fromISO(weekEndDate).toFormat('MMM d, yyyy');
    return `${start} - ${end}`;
  };

  const getTrendEmoji = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return theme.colors.success;
      case 'declining':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Insights</Text>
        <Text style={styles.weekRange}>{formatWeekRange()}</Text>
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateInsights}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color={theme.colors.textOnPrimary} />
            ) : (
              <Text style={styles.generateButtonText}>🔄 Refresh</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.generateButton, { backgroundColor: theme.colors.success }]}
            onPress={handleExportData}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color={theme.colors.textOnPrimary} />
            ) : (
              <Text style={styles.generateButtonText}>📥 Export</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.generateButton, { backgroundColor: theme.colors.info }]}
            onPress={handleShareInsights}
            disabled={isSharing}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={theme.colors.textOnPrimary} />
            ) : (
              <Text style={styles.generateButtonText}>📤 Share</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => refetch()}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>This Week's Summary</Text>

          <View style={styles.summaryCards}>
            {/* Mood Card */}
            {moodSummary.entriesCount > 0 && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Avg Mood</Text>
                <Text style={styles.summaryValue}>{moodSummary.averageMood}/5</Text>
                <Text style={[styles.summaryTrend, { color: getTrendColor(moodSummary.moodTrend) }]}>
                  {getTrendEmoji(moodSummary.moodTrend)} {moodSummary.moodTrend}
                </Text>
              </View>
            )}

            {/* Productivity Card */}
            {productivitySummary.entriesCount > 0 && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Avg Productivity</Text>
                <Text style={styles.summaryValue}>{productivitySummary.averageProductivity}/10</Text>
                <Text style={[styles.summaryTrend, { color: getTrendColor(productivitySummary.productivityTrend) }]}>
                  {getTrendEmoji(productivitySummary.productivityTrend)} {productivitySummary.productivityTrend}
                </Text>
              </View>
            )}
          </View>

          {/* Food Diversity */}
          {foodSummary.totalMealsLogged > 0 && (
            <View style={[styles.summaryCard, { marginTop: theme.spacing.md }]}>
              <Text style={styles.summaryLabel}>Food Diversity</Text>
              <Text style={styles.summaryValue}>{foodSummary.diversityScore}%</Text>
              <Text style={styles.summaryLabel}>{foodSummary.totalMealsLogged} meals logged</Text>
            </View>
          )}
        </View>

        {/* Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          {insights.map((insight) => (
            <View
              key={insight.id}
              style={[
                styles.insightCard,
                { borderLeftColor: getInsightColor(insight.type) },
              ]}
            >
              <View style={styles.insightHeader}>
                <Text style={styles.insightEmoji}>{insight.emoji}</Text>
                <Text style={styles.insightTitle}>{insight.title}</Text>
              </View>
              <Text style={styles.insightDescription}>{insight.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
