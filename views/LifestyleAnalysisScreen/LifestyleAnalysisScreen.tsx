import React from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  getWorkingDayAnalysis,
  getTrainingDayAnalysis,
  WorkingDayAnalysis,
  TrainingDayAnalysis,
} from "@/storage/database";
import { createStyles } from "./LifestyleAnalysisScreen.styles";
import { useTheme } from "@/context/ThemeContext";
import { scaleFontSize } from "@/utils/responsive";

const POSITIVE_COLOR = "#3CB371";
const NEUTRAL_COLOR = "#A9A9A9";
const NEGATIVE_COLOR = "#CD5C5C";

const LifestyleAnalysisScreen: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  // Query for working day analysis
  const { data: workingDayData, isLoading: isLoadingWorking } = useQuery<
    WorkingDayAnalysis,
    Error
  >({
    queryKey: ["workingDayAnalysis"],
    queryFn: getWorkingDayAnalysis,
  });

  // Query for training day analysis
  const { data: trainingDayData, isLoading: isLoadingTraining } = useQuery<
    TrainingDayAnalysis,
    Error
  >({
    queryKey: ["trainingDayAnalysis"],
    queryFn: getTrainingDayAnalysis,
  });

  const getColor = (score: number): string => {
    if (score > 0.2) return POSITIVE_COLOR;
    if (score < -0.2) return NEGATIVE_COLOR;
    return NEUTRAL_COLOR;
  };

  const formatScoreLabel = (score: number): string => {
    if (score > 0.5) return "Great";
    if (score > 0) return "Good";
    if (score === 0) return "Neutral";
    if (score > -0.5) return "Fair";
    return "Poor";
  };

  const getScoreEmoji = (score: number): string => {
    if (score > 0.5) return "🌟";
    if (score > 0.2) return "😊";
    if (score > -0.2) return "😐";
    if (score > -0.5) return "😕";
    return "😞";
  };

  const getComparisonColor = (diff: number): string => {
    if (diff > 0) return POSITIVE_COLOR;
    if (diff < 0) return NEGATIVE_COLOR;
    return NEUTRAL_COLOR;
  };

  const getExerciseImpactDescription = (
    diff: number,
    metric: "mood" | "productivity",
    trainingScore: number,
    restScore: number
  ): string => {
    const absDiff = Math.abs(diff);
    const metricLabel = metric === "mood" ? "mood" : "productivity";

    const bothHigh = trainingScore > 0.5 && restScore > 0.5;

    const bothPositive = trainingScore > 0 && restScore > 0;

    if (absDiff < 0.15) {
      if (bothHigh) {
        return `✨ Your ${metricLabel} stays consistently great whether you exercise or not!`;
      } else if (bothPositive) {
        return `Your ${metricLabel} remains stable on both training and rest days`;
      }
      return `Exercise has minimal impact on your ${metricLabel}`;
    }

    if (diff > 0) {
      // Training days are better
      if (bothHigh) {
        return `💪 Your ${metricLabel} is excellent on both days, but slightly better when you exercise`;
      } else if (diff > 0.3) {
        return `💪 Exercise significantly boosts your ${metricLabel}!`;
      } else {
        return `✨ Exercise improves your ${metricLabel}`;
      }
    } else {
      // Rest days are better
      if (bothHigh) {
        return `🌟 Your ${metricLabel} is great on both days, though slightly better on rest days`;
      } else if (absDiff > 0.3) {
        return `⚠️ Your ${metricLabel} tends to be lower on training days - consider adjusting workout intensity`;
      } else {
        return `Your ${metricLabel} is slightly lower on training days`;
      }
    }
  };

  const getWorkImpactDescription = (
    diff: number,
    metric: "mood" | "productivity",
    workScore: number,
    weekendScore: number
  ): string => {
    const absDiff = Math.abs(diff);
    const metricLabel = metric === "mood" ? "mood" : "productivity";

    // If both scores are high (both > 0.5), emphasize that both are good
    const bothHigh = workScore > 0.5 && weekendScore > 0.5;
    // If both scores are positive (both > 0), emphasize that both are decent
    const bothPositive = workScore > 0 && weekendScore > 0;

    if (absDiff < 0.15) {
      if (bothHigh) {
        return `✨ Your ${metricLabel} stays consistently great throughout the week!`;
      } else if (bothPositive) {
        return `Your ${metricLabel} remains stable on both work days and weekends`;
      }
      return `Work has minimal impact on your ${metricLabel}`;
    }

    if (diff > 0) {
      // Work days are better
      if (bothHigh) {
        return `💼 Your ${metricLabel} is excellent throughout the week, but you thrive even more on work days`;
      } else if (diff > 0.3) {
        return `💼 You thrive on work days! Your ${metricLabel} is significantly higher`;
      } else {
        return `✨ Your ${metricLabel} is better on work days`;
      }
    } else {
      // Weekends are better
      if (bothHigh) {
        return `🌴 Your ${metricLabel} is great all week, though you feel slightly better on weekends`;
      } else if (absDiff > 0.3) {
        return `🌴 You recharge on weekends - your ${metricLabel} is notably better than on work days`;
      } else {
        return `Your ${metricLabel} is slightly better on weekends`;
      }
    }
  };

  const getDataReliability = (
    count1: number,
    count2: number
  ): { level: "low" | "moderate" | "good"; message: string } => {
    const minCount = Math.min(count1, count2);
    const totalCount = count1 + count2;

    if (minCount < 5) {
      return {
        level: "low",
        message:
          "⚠️ Limited data: Keep tracking for at least 5 days in each category for more reliable insights.",
      };
    } else if (minCount < 10 || totalCount < 21) {
      return {
        level: "moderate",
        message:
          "📊 Building insights: Track for 2-3 more weeks for stronger patterns and recommendations.",
      };
    } else {
      return {
        level: "good",
        message:
          "✅ Good data coverage: These insights are based on sufficient tracking data.",
      };
    }
  };

  if (isLoadingWorking && isLoadingTraining) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.centeredText}>Loading lifestyle data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/mood/analytics")}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerEmoji}>📊</Text>
          <Text style={styles.headerTitle}>Lifestyle Factors</Text>
          <Text style={styles.headerDescription}>
            Analyze how your daily routine, work schedule, and exercise habits
            impact your mental well-being and productivity
          </Text>
        </View>

        {/* Working Days vs Non-Working Days Analysis */}
        {workingDayData && workingDayData.workingDays.count > 0 ? (
          <View style={styles.chartWrapper}>
            <Text style={styles.chartSectionTitle}>💼 Work-Life Balance</Text>
            <Text style={styles.sectionDescription}>
              See how your well-being differs between work days and weekends
            </Text>

            {/* Data Reliability Warning */}
            {(() => {
              const reliability = getDataReliability(
                workingDayData.workingDays.count,
                workingDayData.nonWorkingDays.count
              );
              return (
                <View
                  style={[
                    styles.reliabilityWarning,
                    reliability.level === "low" && styles.reliabilityWarningLow,
                    reliability.level === "moderate" &&
                      styles.reliabilityWarningModerate,
                    reliability.level === "good" &&
                      styles.reliabilityWarningGood,
                  ]}
                >
                  <Text
                    style={[
                      styles.reliabilityWarningText,
                      reliability.level === "low" &&
                        styles.reliabilityWarningTextLow,
                      reliability.level === "moderate" &&
                        styles.reliabilityWarningTextModerate,
                      reliability.level === "good" &&
                        styles.reliabilityWarningTextGood,
                    ]}
                  >
                    {reliability.message}
                  </Text>
                </View>
              );
            })()}

            {/* AI Insights */}
            {workingDayData.insights && (
              <View style={styles.insightsCard}>
                <Text style={styles.insightsTitle}>💡 AI Insights</Text>
                <Text style={styles.insightsRecommendation}>
                  {workingDayData.insights.recommendation}
                </Text>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>
                    Confidence:{" "}
                    <Text style={styles.confidenceBold}>
                      {workingDayData.insights.confidenceLevel}
                    </Text>
                  </Text>
                  {workingDayData.insights.significantDifference && (
                    <View style={styles.significantBadge}>
                      <Text style={styles.significantText}>Significant</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={styles.comparisonContainer}>
              {/* Working Days */}
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>💼 Work Days</Text>
                <Text style={styles.comparisonCardCount}>
                  {workingDayData.workingDays.count} days tracked
                </Text>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Mood</Text>
                  <Text style={styles.comparisonMetricValue}>
                    {getScoreEmoji(workingDayData.workingDays.averageMood)}
                  </Text>
                  <Text
                    style={[
                      styles.comparisonMetricCategory,
                      {
                        color: getColor(workingDayData.workingDays.averageMood),
                      },
                    ]}
                  >
                    {formatScoreLabel(workingDayData.workingDays.averageMood)}
                  </Text>
                </View>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Productivity</Text>
                  <Text style={styles.comparisonMetricValue}>
                    {getScoreEmoji(
                      workingDayData.workingDays.averageProductivity
                    )}
                  </Text>
                  <Text
                    style={[
                      styles.comparisonMetricCategory,
                      {
                        color: getColor(
                          workingDayData.workingDays.averageProductivity
                        ),
                      },
                    ]}
                  >
                    {formatScoreLabel(
                      workingDayData.workingDays.averageProductivity
                    )}
                  </Text>
                </View>
              </View>

              {/* Non-Working Days */}
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>🌴 Weekend</Text>
                <Text style={styles.comparisonCardCount}>
                  {workingDayData.nonWorkingDays.count} days tracked
                </Text>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Mood</Text>
                  <Text style={styles.comparisonMetricValue}>
                    {getScoreEmoji(workingDayData.nonWorkingDays.averageMood)}
                  </Text>
                  <Text
                    style={[
                      styles.comparisonMetricCategory,
                      {
                        color: getColor(
                          workingDayData.nonWorkingDays.averageMood
                        ),
                      },
                    ]}
                  >
                    {formatScoreLabel(
                      workingDayData.nonWorkingDays.averageMood
                    )}
                  </Text>
                </View>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Productivity</Text>
                  <Text style={styles.comparisonMetricValue}>
                    {getScoreEmoji(
                      workingDayData.nonWorkingDays.averageProductivity
                    )}
                  </Text>
                  <Text
                    style={[
                      styles.comparisonMetricCategory,
                      {
                        color: getColor(
                          workingDayData.nonWorkingDays.averageProductivity
                        ),
                      },
                    ]}
                  >
                    {formatScoreLabel(
                      workingDayData.nonWorkingDays.averageProductivity
                    )}
                  </Text>
                </View>
              </View>
            </View>

            {/* Work Impact Summary */}
            <View style={styles.differenceSummary}>
              <Text style={styles.differenceSummaryTitle}>💼 Work Impact</Text>
              <View style={{ marginTop: 12, gap: 8 }}>
                <Text
                  style={[
                    styles.differenceSummaryText,
                    {
                      color: getComparisonColor(
                        workingDayData.workingDays.averageMood -
                          workingDayData.nonWorkingDays.averageMood
                      ),
                      fontWeight: "600",
                      fontSize: 15,
                    },
                  ]}
                >
                  {getWorkImpactDescription(
                    workingDayData.workingDays.averageMood -
                      workingDayData.nonWorkingDays.averageMood,
                    "mood",
                    workingDayData.workingDays.averageMood,
                    workingDayData.nonWorkingDays.averageMood
                  )}
                </Text>
                <Text
                  style={[
                    styles.differenceSummaryText,
                    {
                      color: getComparisonColor(
                        workingDayData.workingDays.averageProductivity -
                          workingDayData.nonWorkingDays.averageProductivity
                      ),
                      fontWeight: "600",
                      fontSize: 15,
                    },
                  ]}
                >
                  {getWorkImpactDescription(
                    workingDayData.workingDays.averageProductivity -
                      workingDayData.nonWorkingDays.averageProductivity,
                    "productivity",
                    workingDayData.workingDays.averageProductivity,
                    workingDayData.nonWorkingDays.averageProductivity
                  )}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.chartWrapper}>
            <View style={styles.centered}>
              <Text style={styles.centeredText}>
                No working day data available yet. Keep tracking to see
                insights!
              </Text>
            </View>
          </View>
        )}

        {/* Training Days vs Non-Training Days Analysis */}
        {trainingDayData && trainingDayData.trainingDays.count > 0 ? (
          <View style={styles.chartWrapper}>
            <Text style={styles.chartSectionTitle}>
              💪 Exercise & Training Impact
            </Text>
            <Text style={styles.sectionDescription}>
              Compare your well-being on days when you exercise versus rest days
            </Text>

            {/* Data Reliability Warning */}
            {(() => {
              const reliability = getDataReliability(
                trainingDayData.trainingDays.count,
                trainingDayData.nonTrainingDays.count
              );
              return (
                <View
                  style={[
                    styles.reliabilityWarning,
                    reliability.level === "low" && styles.reliabilityWarningLow,
                    reliability.level === "moderate" &&
                      styles.reliabilityWarningModerate,
                    reliability.level === "good" &&
                      styles.reliabilityWarningGood,
                  ]}
                >
                  <Text
                    style={[
                      styles.reliabilityWarningText,
                      reliability.level === "low" &&
                        styles.reliabilityWarningTextLow,
                      reliability.level === "moderate" &&
                        styles.reliabilityWarningTextModerate,
                      reliability.level === "good" &&
                        styles.reliabilityWarningTextGood,
                    ]}
                  >
                    {reliability.message}
                  </Text>
                </View>
              );
            })()}

            {/* AI Insights */}
            {trainingDayData.insights && (
              <View style={styles.insightsCard}>
                <Text style={styles.insightsTitle}>💡 AI Insights</Text>
                <Text style={styles.insightsRecommendation}>
                  {trainingDayData.insights.recommendation}
                </Text>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>
                    Confidence:{" "}
                    <Text style={styles.confidenceBold}>
                      {trainingDayData.insights.confidenceLevel}
                    </Text>
                  </Text>
                  {trainingDayData.insights.significantDifference && (
                    <View style={styles.significantBadge}>
                      <Text style={styles.significantText}>Significant</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={styles.comparisonContainer}>
              {/* Training Days */}
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>🏃‍♂️ Training Days</Text>
                <Text style={styles.comparisonCardCount}>
                  {trainingDayData.trainingDays.count} days tracked
                </Text>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Mood</Text>
                  <Text style={styles.comparisonMetricValue}>
                    {getScoreEmoji(trainingDayData.trainingDays.averageMood)}
                  </Text>
                  <Text
                    style={[
                      styles.comparisonMetricCategory,
                      {
                        color: getColor(
                          trainingDayData.trainingDays.averageMood
                        ),
                      },
                    ]}
                  >
                    {formatScoreLabel(trainingDayData.trainingDays.averageMood)}
                  </Text>
                </View>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Productivity</Text>
                  <Text style={styles.comparisonMetricValue}>
                    {getScoreEmoji(
                      trainingDayData.trainingDays.averageProductivity
                    )}
                  </Text>
                  <Text
                    style={[
                      styles.comparisonMetricCategory,
                      {
                        color: getColor(
                          trainingDayData.trainingDays.averageProductivity
                        ),
                      },
                    ]}
                  >
                    {formatScoreLabel(
                      trainingDayData.trainingDays.averageProductivity
                    )}
                  </Text>
                </View>
              </View>

              {/* Non-Training Days */}
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>😴 Rest Days</Text>
                <Text style={styles.comparisonCardCount}>
                  {trainingDayData.nonTrainingDays.count} days tracked
                </Text>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Mood</Text>
                  <Text style={styles.comparisonMetricValue}>
                    {getScoreEmoji(trainingDayData.nonTrainingDays.averageMood)}
                  </Text>
                  <Text
                    style={[
                      styles.comparisonMetricCategory,
                      {
                        color: getColor(
                          trainingDayData.nonTrainingDays.averageMood
                        ),
                      },
                    ]}
                  >
                    {formatScoreLabel(
                      trainingDayData.nonTrainingDays.averageMood
                    )}
                  </Text>
                </View>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Productivity</Text>
                  <Text style={styles.comparisonMetricValue}>
                    {getScoreEmoji(
                      trainingDayData.nonTrainingDays.averageProductivity
                    )}
                  </Text>
                  <Text
                    style={[
                      styles.comparisonMetricCategory,
                      {
                        color: getColor(
                          trainingDayData.nonTrainingDays.averageProductivity
                        ),
                      },
                    ]}
                  >
                    {formatScoreLabel(
                      trainingDayData.nonTrainingDays.averageProductivity
                    )}
                  </Text>
                </View>
              </View>
            </View>

            {/* Exercise Impact Summary */}
            <View style={styles.differenceSummary}>
              <Text style={styles.differenceSummaryTitle}>
                💪 Exercise Impact
              </Text>
              <View style={{ marginTop: 12, gap: 8 }}>
                <Text
                  style={[
                    styles.differenceSummaryText,
                    {
                      color: getComparisonColor(
                        trainingDayData.trainingDays.averageMood -
                          trainingDayData.nonTrainingDays.averageMood
                      ),
                      fontWeight: "600",
                      fontSize: 15,
                    },
                  ]}
                >
                  {getExerciseImpactDescription(
                    trainingDayData.trainingDays.averageMood -
                      trainingDayData.nonTrainingDays.averageMood,
                    "mood",
                    trainingDayData.trainingDays.averageMood,
                    trainingDayData.nonTrainingDays.averageMood
                  )}
                </Text>
                <Text
                  style={[
                    styles.differenceSummaryText,
                    {
                      color: getComparisonColor(
                        trainingDayData.trainingDays.averageProductivity -
                          trainingDayData.nonTrainingDays.averageProductivity
                      ),
                      fontWeight: "600",
                      fontSize: 15,
                    },
                  ]}
                >
                  {getExerciseImpactDescription(
                    trainingDayData.trainingDays.averageProductivity -
                      trainingDayData.nonTrainingDays.averageProductivity,
                    "productivity",
                    trainingDayData.trainingDays.averageProductivity,
                    trainingDayData.nonTrainingDays.averageProductivity
                  )}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.chartWrapper}>
            <View style={styles.centered}>
              <Text style={styles.centeredText}>
                No training day data available yet. Set your training days in
                settings and keep tracking!
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LifestyleAnalysisScreen;
