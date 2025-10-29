import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import {
  getWorkingDayAnalysis,
  getTrainingDayAnalysis,
  WorkingDayAnalysis,
  TrainingDayAnalysis,
} from "@/storage/database";
import { createStyles } from "./LifestyleAnalysisScreen.styles";
import { useTheme } from "@/context/ThemeContext";
import { BannerAd } from "@/components/ads";
import { scaleFontSize } from "@/utils/responsive";

const POSITIVE_COLOR = "#3CB371";
const NEUTRAL_COLOR = "#A9A9A9";
const NEGATIVE_COLOR = "#CD5C5C";

const LifestyleAnalysisScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // Query for working day analysis
  const { data: workingDayData, isLoading: isLoadingWorking } = useQuery<WorkingDayAnalysis, Error>({
    queryKey: ["workingDayAnalysis"],
    queryFn: getWorkingDayAnalysis,
  });

  // Query for training day analysis
  const { data: trainingDayData, isLoading: isLoadingTraining } = useQuery<TrainingDayAnalysis, Error>({
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

  const getComparisonColor = (diff: number): string => {
    if (diff > 0) return POSITIVE_COLOR;
    if (diff < 0) return NEGATIVE_COLOR;
    return NEUTRAL_COLOR;
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
          <Text style={styles.headerEmoji}>📊</Text>
          <Text style={styles.headerTitle}>Lifestyle Factors</Text>
          <Text style={styles.headerDescription}>
            Analyze how your daily routine, work schedule, and exercise habits impact your mental well-being and productivity
          </Text>
        </View>

        <BannerAd size="small" position="top" />

        {/* Working Days vs Non-Working Days Analysis */}
        {workingDayData && workingDayData.workingDays.count > 0 ? (
          <View style={styles.chartWrapper}>
            <Text style={styles.chartSectionTitle}>
              Working Days vs Weekend
            </Text>
            <Text style={styles.sectionDescription}>
              Compare your mood and productivity on working days versus weekends
            </Text>

            <View style={styles.comparisonContainer}>
              {/* Working Days */}
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>Working Days</Text>
                <Text style={styles.comparisonCardCount}>
                  {workingDayData.workingDays.count} days
                </Text>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Mood</Text>
                  <Text
                    style={[
                      styles.comparisonMetricValue,
                      { color: getColor(workingDayData.workingDays.averageMood) },
                    ]}
                  >
                    {workingDayData.workingDays.averageMood.toFixed(2)}
                  </Text>
                  <Text style={styles.comparisonMetricCategory}>
                    {formatScoreLabel(workingDayData.workingDays.averageMood)}
                  </Text>
                </View>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Productivity</Text>
                  <Text
                    style={[
                      styles.comparisonMetricValue,
                      { color: getColor(workingDayData.workingDays.averageProductivity) },
                    ]}
                  >
                    {workingDayData.workingDays.averageProductivity.toFixed(2)}
                  </Text>
                  <Text style={styles.comparisonMetricCategory}>
                    {formatScoreLabel(workingDayData.workingDays.averageProductivity)}
                  </Text>
                </View>
              </View>

              {/* Non-Working Days */}
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>Weekend</Text>
                <Text style={styles.comparisonCardCount}>
                  {workingDayData.nonWorkingDays.count} days
                </Text>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Mood</Text>
                  <Text
                    style={[
                      styles.comparisonMetricValue,
                      { color: getColor(workingDayData.nonWorkingDays.averageMood) },
                    ]}
                  >
                    {workingDayData.nonWorkingDays.averageMood.toFixed(2)}
                  </Text>
                  <Text style={styles.comparisonMetricCategory}>
                    {formatScoreLabel(workingDayData.nonWorkingDays.averageMood)}
                  </Text>
                </View>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Productivity</Text>
                  <Text
                    style={[
                      styles.comparisonMetricValue,
                      { color: getColor(workingDayData.nonWorkingDays.averageProductivity) },
                    ]}
                  >
                    {workingDayData.nonWorkingDays.averageProductivity.toFixed(2)}
                  </Text>
                  <Text style={styles.comparisonMetricCategory}>
                    {formatScoreLabel(workingDayData.nonWorkingDays.averageProductivity)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Difference Summary */}
            <View style={styles.differenceSummary}>
              <Text style={styles.differenceSummaryTitle}>Difference:</Text>
              <Text style={styles.differenceSummaryText}>
                Mood:{" "}
                <Text
                  style={{
                    color: getComparisonColor(
                      workingDayData.workingDays.averageMood -
                        workingDayData.nonWorkingDays.averageMood
                    ),
                    fontWeight: "bold",
                  }}
                >
                  {(
                    workingDayData.workingDays.averageMood -
                    workingDayData.nonWorkingDays.averageMood
                  ).toFixed(2)}
                </Text>
              </Text>
              <Text style={styles.differenceSummaryText}>
                Productivity:{" "}
                <Text
                  style={{
                    color: getComparisonColor(
                      workingDayData.workingDays.averageProductivity -
                        workingDayData.nonWorkingDays.averageProductivity
                    ),
                    fontWeight: "bold",
                  }}
                >
                  {(
                    workingDayData.workingDays.averageProductivity -
                    workingDayData.nonWorkingDays.averageProductivity
                  ).toFixed(2)}
                </Text>
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.chartWrapper}>
            <View style={styles.centered}>
              <Text style={styles.centeredText}>
                No working day data available yet. Keep tracking to see insights!
              </Text>
            </View>
          </View>
        )}

        {/* Training Days vs Non-Training Days Analysis */}
        {trainingDayData && trainingDayData.trainingDays.count > 0 ? (
          <View style={styles.chartWrapper}>
            <Text style={styles.chartSectionTitle}>
              Training Days vs Rest Days
            </Text>
            <Text style={styles.sectionDescription}>
              See how exercise affects your mood and productivity
            </Text>

            <View style={styles.comparisonContainer}>
              {/* Training Days */}
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>Training Days</Text>
                <Text style={styles.comparisonCardCount}>
                  {trainingDayData.trainingDays.count} days
                </Text>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Mood</Text>
                  <Text
                    style={[
                      styles.comparisonMetricValue,
                      { color: getColor(trainingDayData.trainingDays.averageMood) },
                    ]}
                  >
                    {trainingDayData.trainingDays.averageMood.toFixed(2)}
                  </Text>
                  <Text style={styles.comparisonMetricCategory}>
                    {formatScoreLabel(trainingDayData.trainingDays.averageMood)}
                  </Text>
                </View>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Productivity</Text>
                  <Text
                    style={[
                      styles.comparisonMetricValue,
                      { color: getColor(trainingDayData.trainingDays.averageProductivity) },
                    ]}
                  >
                    {trainingDayData.trainingDays.averageProductivity.toFixed(2)}
                  </Text>
                  <Text style={styles.comparisonMetricCategory}>
                    {formatScoreLabel(trainingDayData.trainingDays.averageProductivity)}
                  </Text>
                </View>
              </View>

              {/* Non-Training Days */}
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>Rest Days</Text>
                <Text style={styles.comparisonCardCount}>
                  {trainingDayData.nonTrainingDays.count} days
                </Text>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Mood</Text>
                  <Text
                    style={[
                      styles.comparisonMetricValue,
                      { color: getColor(trainingDayData.nonTrainingDays.averageMood) },
                    ]}
                  >
                    {trainingDayData.nonTrainingDays.averageMood.toFixed(2)}
                  </Text>
                  <Text style={styles.comparisonMetricCategory}>
                    {formatScoreLabel(trainingDayData.nonTrainingDays.averageMood)}
                  </Text>
                </View>

                <View style={styles.comparisonMetric}>
                  <Text style={styles.comparisonMetricLabel}>Productivity</Text>
                  <Text
                    style={[
                      styles.comparisonMetricValue,
                      { color: getColor(trainingDayData.nonTrainingDays.averageProductivity) },
                    ]}
                  >
                    {trainingDayData.nonTrainingDays.averageProductivity.toFixed(2)}
                  </Text>
                  <Text style={styles.comparisonMetricCategory}>
                    {formatScoreLabel(trainingDayData.nonTrainingDays.averageProductivity)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Difference Summary */}
            <View style={styles.differenceSummary}>
              <Text style={styles.differenceSummaryTitle}>Difference:</Text>
              <Text style={styles.differenceSummaryText}>
                Mood:{" "}
                <Text
                  style={{
                    color: getComparisonColor(
                      trainingDayData.trainingDays.averageMood -
                        trainingDayData.nonTrainingDays.averageMood
                    ),
                    fontWeight: "bold",
                  }}
                >
                  {(
                    trainingDayData.trainingDays.averageMood -
                    trainingDayData.nonTrainingDays.averageMood
                  ).toFixed(2)}
                </Text>
              </Text>
              <Text style={styles.differenceSummaryText}>
                Productivity:{" "}
                <Text
                  style={{
                    color: getComparisonColor(
                      trainingDayData.trainingDays.averageProductivity -
                        trainingDayData.nonTrainingDays.averageProductivity
                    ),
                    fontWeight: "bold",
                  }}
                >
                  {(
                    trainingDayData.trainingDays.averageProductivity -
                    trainingDayData.nonTrainingDays.averageProductivity
                  ).toFixed(2)}
                </Text>
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.chartWrapper}>
            <View style={styles.centered}>
              <Text style={styles.centeredText}>
                No training day data available yet. Set your training days in settings and keep tracking!
              </Text>
            </View>
          </View>
        )}

        <BannerAd size="medium" position="bottom" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default LifestyleAnalysisScreen;
