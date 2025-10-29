import React, { useState, useMemo } from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { List, Card, ActivityIndicator, Icon } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import {
  getFoodSymptomCorrelationData,
  SymptomType,
  FoodSymptomCorrelation,
} from "../../storage/correlations";
import { useTheme } from "@/context/ThemeContext";
import { BannerAd } from "@/components/ads";

const symptomTypes: SymptomType[] = [
  "bloating",
  "energy",
  "stool_consistency",
  "diarrhea",
  "nausea",
  "pain",
];

const symptomLabels: Record<SymptomType, string> = {
  bloating: "Bloating",
  energy: "Energy",
  stool_consistency: "Stool",
  diarrhea: "Diarrhea",
  nausea: "Nausea",
  pain: "Pain",
};

export default function FoodAnalyticsScreen() {
  const { theme } = useTheme();
  const POSITIVE_COLOR = "#3CB371";
  const NEUTRAL_COLOR = "#A9A9A9";
  const NEGATIVE_COLOR = "#CD5C5C";

  const [selectedSymptom, setSelectedSymptom] =
    useState<SymptomType>("bloating");
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "positive" | "negative" | "neutral">("all");

  const {
    data: correlationData = [],
    isLoading,
    isError,
    error,
  } = useQuery<FoodSymptomCorrelation[], Error>({
    queryKey: ["foodSymptomCorrelation", selectedSymptom],
    queryFn: () => getFoodSymptomCorrelationData(selectedSymptom),
  });

  const sortedData = useMemo(
    () =>
      [...correlationData].sort(
        (a, b) => b.averageSymptomScore - a.averageSymptomScore
      ),
    [correlationData]
  );

  // Filter data by score type
  const filteredData = useMemo(() => {
    if (filterType === "all") return sortedData;
    return sortedData.filter(item => {
      const score = item.averageSymptomScore;
      if (filterType === "positive") return score > 0.2;
      if (filterType === "negative") return score < -0.2;
      return score >= -0.2 && score <= 0.2;
    });
  }, [sortedData, filterType]);

  // Calculate insights
  const insights = useMemo(() => {
    if (!correlationData || correlationData.length === 0) return null;

    const positiveFoods = correlationData.filter(d => d.averageSymptomScore > 0.2);
    const negativeFoods = correlationData.filter(d => d.averageSymptomScore < -0.2);
    const neutralFoods = correlationData.filter(d =>
      d.averageSymptomScore >= -0.2 && d.averageSymptomScore <= 0.2
    );

    const bestFood = positiveFoods.length > 0
      ? positiveFoods.reduce((prev, current) =>
          current.averageSymptomScore > prev.averageSymptomScore ? current : prev
        )
      : null;

    const worstFood = negativeFoods.length > 0
      ? negativeFoods.reduce((prev, current) =>
          current.averageSymptomScore < prev.averageSymptomScore ? current : prev
        )
      : null;

    return {
      total: correlationData.length,
      positive: positiveFoods.length,
      negative: negativeFoods.length,
      neutral: neutralFoods.length,
      bestFood,
      worstFood,
      positivePercentage: ((positiveFoods.length / correlationData.length) * 100).toFixed(0),
      negativePercentage: ((negativeFoods.length / correlationData.length) * 100).toFixed(0),
    };
  }, [correlationData]);

  const getScoreColor = (score: number): string => {
    if (score > 0.2) return POSITIVE_COLOR;
    if (score < -0.2) return NEGATIVE_COLOR;
    return NEUTRAL_COLOR;
  };

  const styles = StyleSheet.create({
    container: {
      paddingBottom: theme.spacing.xl,
      backgroundColor: theme.colors.background,
      flexGrow: 1,
    },
    header: {
      padding: theme.spacing.xl,
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    headerEmoji: {
      fontSize: 48,
      marginBottom: theme.spacing.sm,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    title: {
      textAlign: "center",
      marginBottom: 10,
    },
    card: {
      margin: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.md,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: 16,
    },
    symptomGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    symptomButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: "#f8f9fa",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#e0e0e0",
      minWidth: "30%",
      alignItems: "center",
    },
    symptomButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    symptomButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#666",
    },
    symptomButtonTextActive: {
      color: "#fff",
    },
    foodItem: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    foodItemLast: {
      borderBottomWidth: 0,
    },
    foodItemHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      gap: 8,
    },
    foodItemTitle: {
      fontSize: 17,
      fontWeight: "600",
      color: "#2c3e50",
    },
    foodItemDetails: {
      paddingLeft: 28,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
      paddingVertical: 2,
    },
    detailLabel: {
      fontSize: 14,
      color: "#7f8c8d",
    },
    detailValue: {
      fontSize: 14,
      color: "#34495e",
      fontWeight: "500",
    },
    colorIndicatorRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    colorIndicatorSwatch: {
      width: 18,
      height: 18,
      marginLeft: 10,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: "#e0e0e0",
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: 32,
      paddingHorizontal: 16,
    },
    emptyText: {
      marginTop: 16,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      color: "#555",
    },
    emptySubText: {
      marginTop: 8,
      fontSize: 14,
      textAlign: "center",
      color: "#888",
    },
    errorText: {
      textAlign: "center",
      color: "red",
      marginVertical: 20,
    },
    headerTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: theme.spacing.sm,
    },
    infoButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      alignItems: "center",
      justifyContent: "center",
    },
    infoButtonText: {
      fontSize: 24,
      color: theme.colors.primary,
    },
    infoModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    infoModalContainer: {
      backgroundColor: "#fff",
      borderRadius: 16,
      width: "100%",
      maxHeight: "80%",
      maxWidth: 500,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#2c3e50",
    },
    modalCloseButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#f0f0f0",
      alignItems: "center",
      justifyContent: "center",
    },
    modalCloseButtonText: {
      fontSize: 20,
      color: "#666",
    },
    infoModalContent: {
      padding: 20,
      maxHeight: 400,
    },
    infoText: {
      fontSize: 15,
      color: "#34495e",
      lineHeight: 22,
      marginBottom: 16,
    },
    colorExplanation: {
      marginVertical: 16,
      padding: 16,
      backgroundColor: "#f8f9fa",
      borderRadius: 12,
    },
    colorRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    colorDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 12,
      borderWidth: 1,
      borderColor: "#e0e0e0",
    },
    colorLabel: {
      fontSize: 14,
      color: "#34495e",
      flex: 1,
      lineHeight: 20,
    },
    infoNote: {
      fontSize: 13,
      color: "#7f8c8d",
      fontStyle: "italic",
      marginTop: 8,
      padding: 12,
      backgroundColor: "#e3f2fd",
      borderRadius: 8,
      lineHeight: 20,
    },

    // Summary card styles
    summaryCard: {
      margin: theme.spacing.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
    },
    cardSectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    statsGrid: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    statBox: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      alignItems: "center",
    },
    statValue: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },

    // Recommendations card styles
    recommendationsCard: {
      margin: theme.spacing.md,
      marginTop: 0,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
    },
    recommendationItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginTop: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
    },
    recommendationIcon: {
      fontSize: 24,
      marginRight: theme.spacing.md,
    },
    recommendationText: {
      flex: 1,
    },
    recommendationTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: 4,
    },
    recommendationDesc: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      lineHeight: 18,
    },

    // Filter card styles
    filterCard: {
      margin: theme.spacing.md,
      marginTop: 0,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
    },
    filterButtons: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    filterButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.round,
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterButtonText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },
    filterButtonTextActive: {
      color: theme.colors.textOnPrimary,
    },

    // Updated food item styles
    foodItemTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
    },
    scoreChip: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: theme.borderRadius.round,
      fontSize: 13,
      fontWeight: "700",
    },

    // Progress bar styles
    progressBarContainer: {
      marginVertical: theme.spacing.sm,
    },
    progressBarTrack: {
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      overflow: "hidden",
      marginBottom: 6,
    },
    progressBarFill: {
      height: 6,
      borderRadius: 3,
    },
    progressBarLabel: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
  });

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon source="file-find-outline" size={48} color="#aaa" />
      <Text style={styles.emptyText}>
        No correlation data found for this symptom yet.
      </Text>
      <Text style={styles.emptySubText}>
        Keep logging your meals and symptoms to see insights here.
      </Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={{ width: 40 }} />
          <Text style={styles.headerEmoji}>🍎</Text>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setIsInfoModalVisible(true)}
          >
            <Text style={styles.infoButtonText}>ⓘ</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Food Analytics</Text>
        <Text style={styles.headerSubtitle}>Track symptom correlations</Text>
      </View>

      <BannerAd size="small" position="top" />

      {/* Summary Stats */}
      {insights && (
        <View style={styles.summaryCard}>
          <Text style={styles.cardSectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{insights.total}</Text>
              <Text style={styles.statLabel}>Total Foods</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: `${POSITIVE_COLOR}20` }]}>
              <Text style={[styles.statValue, { color: POSITIVE_COLOR }]}>
                {insights.positive}
              </Text>
              <Text style={styles.statLabel}>Helpful</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: `${NEGATIVE_COLOR}20` }]}>
              <Text style={[styles.statValue, { color: NEGATIVE_COLOR }]}>
                {insights.negative}
              </Text>
              <Text style={styles.statLabel}>Trigger</Text>
            </View>
          </View>
        </View>
      )}

      {/* Recommendations */}
      {insights && (insights.bestFood || insights.worstFood) && (
        <View style={styles.recommendationsCard}>
          <Text style={styles.cardSectionTitle}>💡 Recommendations for {symptomLabels[selectedSymptom]}</Text>
          {insights.bestFood && (
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationIcon}>✅</Text>
              <View style={styles.recommendationText}>
                <Text style={styles.recommendationTitle}>
                  Try more {insights.bestFood.foodName}
                </Text>
                <Text style={styles.recommendationDesc}>
                  Best for reducing {selectedSymptom} (Score: {insights.bestFood.averageSymptomScore.toFixed(2)})
                </Text>
              </View>
            </View>
          )}
          {insights.worstFood && (
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationIcon}>⚠️</Text>
              <View style={styles.recommendationText}>
                <Text style={styles.recommendationTitle}>
                  Limit {insights.worstFood.foodName}
                </Text>
                <Text style={styles.recommendationDesc}>
                  May trigger {selectedSymptom} (Score: {insights.worstFood.averageSymptomScore.toFixed(2)})
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Select Symptom</Text>
          <View style={styles.symptomGrid}>
            {symptomTypes.map((symptom) => (
              <TouchableOpacity
                key={symptom}
                style={[
                  styles.symptomButton,
                  selectedSymptom === symptom && styles.symptomButtonActive,
                ]}
                onPress={() => setSelectedSymptom(symptom)}
              >
                <Text
                  style={[
                    styles.symptomButtonText,
                    selectedSymptom === symptom &&
                      styles.symptomButtonTextActive,
                  ]}
                >
                  {symptomLabels[symptom]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Filter by Score Type */}
      <View style={styles.filterCard}>
        <Text style={styles.cardSectionTitle}>Filter Results</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filterType === "all" && styles.filterButtonActive]}
            onPress={() => setFilterType("all")}
          >
            <Text style={[styles.filterButtonText, filterType === "all" && styles.filterButtonTextActive]}>
              All ({sortedData.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterType === "positive" && styles.filterButtonActive]}
            onPress={() => setFilterType("positive")}
          >
            <Text style={[styles.filterButtonText, filterType === "positive" && styles.filterButtonTextActive]}>
              Helpful ({insights?.positive || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterType === "negative" && styles.filterButtonActive]}
            onPress={() => setFilterType("negative")}
          >
            <Text style={[styles.filterButtonText, filterType === "negative" && styles.filterButtonTextActive]}>
              Trigger ({insights?.negative || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterType === "neutral" && styles.filterButtonActive]}
            onPress={() => setFilterType("neutral")}
          >
            <Text style={[styles.filterButtonText, filterType === "neutral" && styles.filterButtonTextActive]}>
              Neutral ({insights?.neutral || 0})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Card style={styles.card}>
        <Card.Title title={`Correlated Foods ${filterType !== "all" ? `(${filterType})` : ""}`} />
        <Card.Content>
          {isLoading ? (
            <ActivityIndicator
              animating={true}
              size="large"
              style={{ marginVertical: 20 }}
            />
          ) : isError ? (
            <Text style={styles.errorText}>Error: {error.message}</Text>
          ) : filteredData.length > 0 ? (
            <View>
              {filteredData.map((item, index) => {
                const scoreColor = getScoreColor(item.averageSymptomScore);
                const isLastItem = index === filteredData.length - 1;
                const percentage = Math.abs((item.averageSymptomScore / 1) * 100);
                return (
                  <View
                    key={item.foodName}
                    style={[
                      styles.foodItem,
                      isLastItem && styles.foodItemLast,
                    ]}
                  >
                    <View style={styles.foodItemHeader}>
                      <View style={styles.foodItemTitleContainer}>
                        <Icon source="food-croissant" size={20} color="#666" />
                        <Text style={styles.foodItemTitle}>{item.foodName}</Text>
                      </View>
                      <Text style={[
                        styles.scoreChip,
                        {
                          backgroundColor: `${scoreColor}20`,
                          color: scoreColor
                        }
                      ]}>
                        {item.averageSymptomScore > 0 ? '+' : ''}{item.averageSymptomScore.toFixed(2)}
                      </Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarTrack}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${Math.min(percentage * 100, 100)}%`,
                              backgroundColor: scoreColor,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressBarLabel}>
                        {item.averageSymptomScore > 0.2
                          ? "Helpful"
                          : item.averageSymptomScore < -0.2
                          ? "May Trigger"
                          : "Neutral"}
                      </Text>
                    </View>

                    <View style={styles.foodItemDetails}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>📊 Logged:</Text>
                        <Text style={styles.detailValue}>
                          {item.occurrences} times
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <EmptyListComponent />
          )}
        </Card.Content>
      </Card>

      <BannerAd size="medium" position="bottom" />

      <Modal
        visible={isInfoModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsInfoModalVisible(false)}
      >
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Score Explanation</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setIsInfoModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.infoModalContent}>
              <Text style={styles.infoText}>
                The scores represent the correlation between foods and your symptom levels.
              </Text>

              <View style={styles.colorExplanation}>
                <View style={styles.colorRow}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: POSITIVE_COLOR },
                    ]}
                  />
                  <Text style={styles.colorLabel}>
                    <Text style={{ fontWeight: "bold" }}>Positive ({">"} 0.2):</Text> Foods associated with increased symptoms
                  </Text>
                </View>

                <View style={styles.colorRow}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: NEUTRAL_COLOR },
                    ]}
                  />
                  <Text style={styles.colorLabel}>
                    <Text style={{ fontWeight: "bold" }}>Neutral (-0.2 to 0.2):</Text> No significant correlation
                  </Text>
                </View>

                <View style={styles.colorRow}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: NEGATIVE_COLOR },
                    ]}
                  />
                  <Text style={styles.colorLabel}>
                    <Text style={{ fontWeight: "bold" }}>Negative ({"<"} -0.2):</Text> Foods associated with decreased symptoms
                  </Text>
                </View>
              </View>

              <Text style={styles.infoText}>
                <Text style={{ fontWeight: "bold" }}>How it works:{"\n"}</Text>
                The app analyzes your food entries and symptom ratings to calculate average scores. Higher scores indicate foods that may worsen symptoms, while lower scores suggest foods that may help reduce symptoms.
              </Text>

              <Text style={styles.infoNote}>
                Note: These correlations are based on your personal data. More entries lead to more accurate insights.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
