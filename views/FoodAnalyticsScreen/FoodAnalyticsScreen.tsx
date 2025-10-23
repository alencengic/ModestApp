import React, { useState, useMemo } from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { List, Card, ActivityIndicator, Icon } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import {
  getFoodSymptomCorrelationData,
  SymptomType,
  FoodSymptomCorrelation,
} from "../../storage/correlations";
import { BrightTheme } from "@/constants/Theme";
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

export default function FoodAnalyticsScreen() {
  const POSITIVE_COLOR = "#3CB371";
  const NEUTRAL_COLOR = "#A9A9A9";
  const NEGATIVE_COLOR = "#CD5C5C";

  const [selectedSymptom, setSelectedSymptom] =
    useState<SymptomType>("bloating");
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

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

  const getScoreColor = (score: number): string => {
    if (score > 0.2) return POSITIVE_COLOR;
    if (score < -0.2) return NEGATIVE_COLOR;
    return NEUTRAL_COLOR;
  };

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

      <Card style={styles.card}>
        <Card.Title title="Correlated Foods" />
        <Card.Content>
          {isLoading ? (
            <ActivityIndicator
              animating={true}
              size="large"
              style={{ marginVertical: 20 }}
            />
          ) : isError ? (
            <Text style={styles.errorText}>Error: {error.message}</Text>
          ) : sortedData.length > 0 ? (
            <View>
              {sortedData.map((item, index) => {
                const scoreColor = getScoreColor(item.averageSymptomScore);
                const isLastItem = index === sortedData.length - 1;
                return (
                  <View
                    key={item.foodName}
                    style={[
                      styles.foodItem,
                      isLastItem && styles.foodItemLast,
                    ]}
                  >
                    <View style={styles.foodItemHeader}>
                      <Icon source="food-croissant" size={20} color="#666" />
                      <Text style={styles.foodItemTitle}>{item.foodName}</Text>
                    </View>
                    <View style={styles.foodItemDetails}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Avg Score:</Text>
                        <Text
                          style={[
                            styles.detailValue,
                            { color: scoreColor, fontWeight: "bold" },
                          ]}
                        >
                          {item.averageSymptomScore.toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Occurrences:</Text>
                        <Text style={styles.detailValue}>
                          {item.occurrences}
                        </Text>
                      </View>
                      <View style={styles.colorIndicatorRow}>
                        <Text style={styles.detailLabel}>Association:</Text>
                        <View
                          style={[
                            styles.colorIndicatorSwatch,
                            { backgroundColor: scoreColor },
                          ]}
                        />
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

const styles = StyleSheet.create({
  container: {
    paddingBottom: BrightTheme.spacing.xl,
    backgroundColor: BrightTheme.colors.background,
    flexGrow: 1,
  },
  header: {
    padding: BrightTheme.spacing.xl,
    alignItems: "center",
    backgroundColor: BrightTheme.colors.background,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: BrightTheme.spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
    marginBottom: BrightTheme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: BrightTheme.colors.textSecondary,
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    margin: BrightTheme.spacing.md,
    borderRadius: BrightTheme.borderRadius.lg,
    ...BrightTheme.shadows.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
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
    backgroundColor: BrightTheme.colors.primary,
    borderColor: BrightTheme.colors.primary,
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

  // Info button styles
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: BrightTheme.spacing.sm,
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
    color: BrightTheme.colors.primary,
  },

  // Info modal styles
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
});
