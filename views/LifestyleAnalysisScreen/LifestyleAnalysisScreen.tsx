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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const styles = createStyles(theme);

  const { data: workingDayData, isLoading: isLoadingWorking } = useQuery<
    WorkingDayAnalysis,
    Error
  >({
    queryKey: ["workingDayAnalysis"],
    queryFn: getWorkingDayAnalysis,
  });

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
    if (score > 0.5) return t("lifestyleAnalysis.scoreGreat");
    if (score > 0) return t("lifestyleAnalysis.scoreGood");
    if (score === 0) return t("lifestyleAnalysis.scoreNeutral");
    if (score > -0.5) return t("lifestyleAnalysis.scoreFair");
    return t("lifestyleAnalysis.scorePoor");
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
    const metricLabel = metric === "mood" ? t("lifestyleAnalysis.mood") : t("lifestyleAnalysis.productivity");

    const bothHigh = trainingScore > 0.5 && restScore > 0.5;

    const bothPositive = trainingScore > 0 && restScore > 0;

    if (absDiff < 0.15) {
      if (bothHigh) {
        return t("lifestyleAnalysis.exerciseConsistentlyGreat", { metric: metricLabel });
      } else if (bothPositive) {
        return t("lifestyleAnalysis.exerciseStable", { metric: metricLabel });
      }
      return t("lifestyleAnalysis.exerciseMinimalImpact", { metric: metricLabel });
    }

    if (diff > 0) {
      if (bothHigh) {
        return t("lifestyleAnalysis.exerciseExcellentBoth", { metric: metricLabel });
      } else if (diff > 0.3) {
        return t("lifestyleAnalysis.exerciseSignificantBoost", { metric: metricLabel });
      } else {
        return t("lifestyleAnalysis.exerciseImproves", { metric: metricLabel });
      }
    } else {
      if (bothHigh) {
        return t("lifestyleAnalysis.exerciseGreatBothRest", { metric: metricLabel });
      } else if (absDiff > 0.3) {
        return t("lifestyleAnalysis.exerciseLowerTraining", { metric: metricLabel });
      } else {
        return t("lifestyleAnalysis.exerciseSlightlyLower", { metric: metricLabel });
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
    const metricLabel = metric === "mood" ? t("lifestyleAnalysis.mood") : t("lifestyleAnalysis.productivity");

    const bothHigh = workScore > 0.5 && weekendScore > 0.5;

    const bothPositive = workScore > 0 && weekendScore > 0;

    if (absDiff < 0.15) {
      if (bothHigh) {
        return t("lifestyleAnalysis.workConsistentlyGreat", { metric: metricLabel });
      } else if (bothPositive) {
        return t("lifestyleAnalysis.workStable", { metric: metricLabel });
      }
      return t("lifestyleAnalysis.workMinimalImpact", { metric: metricLabel });
    }

    if (diff > 0) {
      if (bothHigh) {
        return t("lifestyleAnalysis.workExcellentThrive", { metric: metricLabel });
      } else if (diff > 0.3) {
        return t("lifestyleAnalysis.workThriveSignificant", { metric: metricLabel });
      } else {
        return t("lifestyleAnalysis.workBetterWorkDays", { metric: metricLabel });
      }
    } else {
      if (bothHigh) {
        return t("lifestyleAnalysis.workGreatWeekends", { metric: metricLabel });
      } else if (absDiff > 0.3) {
        return t("lifestyleAnalysis.workRechargeWeekends", { metric: metricLabel });
      } else {
        return t("lifestyleAnalysis.workSlightlyBetterWeekends", { metric: metricLabel });
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
        message: t("lifestyleAnalysis.limitedDataMessage"),
      };
    } else if (minCount < 10 || totalCount < 21) {
      return {
        level: "moderate",
        message: t("lifestyleAnalysis.buildingInsights"),
      };
    } else {
      return {
        level: "good",
        message: t("lifestyleAnalysis.goodDataCoverage"),
      };
    }
  };

  if (isLoadingWorking && isLoadingTraining) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.centeredText}>{t("lifestyleAnalysis.loadingLifestyleData")}</Text>
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
            <Text style={styles.backButtonText}>{t("lifestyleAnalysis.back")}</Text>
          </TouchableOpacity>
          <Text style={styles.headerEmoji}>📊</Text>
          <Text style={styles.headerTitle}>{t("lifestyleAnalysis.title")}</Text>
          <Text style={styles.headerDescription}>
            {t("lifestyleAnalysis.subtitle")}
          </Text>
        </View>

        {workingDayData && workingDayData.workingDays.count > 0 ? (
          <View style={styles.chartWrapper}>
            <Text style={styles.chartSectionTitle}>{t("lifestyleAnalysis.workLifeBalance")}</Text>
            <Text style={styles.sectionDescription}>
              {t("lifestyleAnalysis.workLifeBalanceDesc")}
            </Text>

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

            {workingDayData.insights && (
              <View style={styles.insightsCard}>
                <Text style={styles.insightsTitle}>{t("lifestyleAnalysis.aiInsights")}</Text>
                <Text style={styles.insightsRecommendation}>
                  {workingDayData.insights.recommendation}
                </Text>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>
                    {t("lifestyleAnalysis.confidence")}{" "}
                    <Text style={styles.confidenceBold}>
                      {workingDayData.insights.confidenceLevel}
                    </Text>
                  </Text>
                  {workingDayData.insights.significantDifference && (
                    <View style={styles.significantBadge}>
                      <Text style={styles.significantText}>{t("lifestyleAnalysis.significant")}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={styles.comparisonContainer}>
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>{t("lifestyleAnalysis.workDaysLabel")}</Text>
                <Text style={styles.comparisonCardCount}>
                  {t("lifestyleAnalysis.daysTracked", { count: workingDayData.workingDays.count })}
                </Text>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>{t("lifestyleAnalysis.mood")}</Text>
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

              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>{t("lifestyleAnalysis.weekendLabel")}</Text>
                <Text style={styles.comparisonCardCount}>
                  {t("lifestyleAnalysis.daysTracked", { count: workingDayData.nonWorkingDays.count })}
                </Text>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>{t("lifestyleAnalysis.mood")}</Text>
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
                  <Text style={styles.comparisonMetricLabel}>{t("lifestyleAnalysis.productivity")}</Text>
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

            <View style={styles.differenceSummary}>
              <Text style={styles.differenceSummaryTitle}>{t("lifestyleAnalysis.workImpact")}</Text>
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
                {t("lifestyleAnalysis.noWorkingData")}
              </Text>
            </View>
          </View>
        )}

        {trainingDayData && trainingDayData.trainingDays.count > 0 ? (
          <View style={styles.chartWrapper}>
            <Text style={styles.chartSectionTitle}>
              {t("lifestyleAnalysis.exerciseTraining")}
            </Text>
            <Text style={styles.sectionDescription}>
              {t("lifestyleAnalysis.exerciseTrainingDesc")}
            </Text>

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

            {trainingDayData.insights && (
              <View style={styles.insightsCard}>
                <Text style={styles.insightsTitle}>{t("lifestyleAnalysis.aiInsights")}</Text>
                <Text style={styles.insightsRecommendation}>
                  {trainingDayData.insights.recommendation}
                </Text>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>
                    {t("lifestyleAnalysis.confidence")}{" "}
                    <Text style={styles.confidenceBold}>
                      {trainingDayData.insights.confidenceLevel}
                    </Text>
                  </Text>
                  {trainingDayData.insights.significantDifference && (
                    <View style={styles.significantBadge}>
                      <Text style={styles.significantText}>{t("lifestyleAnalysis.significant")}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={styles.comparisonContainer}>
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>{t("lifestyleAnalysis.trainingDays")}</Text>
                <Text style={styles.comparisonCardCount}>
                  {t("lifestyleAnalysis.daysTracked", { count: trainingDayData.trainingDays.count })}
                </Text>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>{t("lifestyleAnalysis.mood")}</Text>
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
                  <Text style={styles.comparisonMetricLabel}>{t("lifestyleAnalysis.productivity")}</Text>
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

              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>{t("lifestyleAnalysis.restDays")}</Text>
                <Text style={styles.comparisonCardCount}>
                  {t("lifestyleAnalysis.daysTracked", { count: trainingDayData.nonTrainingDays.count })}
                </Text>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>{t("lifestyleAnalysis.mood")}</Text>
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
                  <Text style={styles.comparisonMetricLabel}>{t("lifestyleAnalysis.productivity")}</Text>
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

            <View style={styles.differenceSummary}>
              <Text style={styles.differenceSummaryTitle}>
                {t("lifestyleAnalysis.exerciseImpact")}
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
                {t("lifestyleAnalysis.noTrainingData")}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LifestyleAnalysisScreen;
