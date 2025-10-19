import React, { useState, useMemo } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { List, Card, ActivityIndicator, Icon } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
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
  const [selectedSymptom, setSelectedSymptom] =
    useState<SymptomType>("bloating");

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🍎</Text>
        <Text style={styles.headerTitle}>Food Analytics</Text>
        <Text style={styles.headerSubtitle}>Track symptom correlations</Text>
      </View>

      <BannerAd size="small" position="top" />

      {/* --- Picker Section Refactored --- */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.pickerLabel}>
            Select Symptom
          </Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedSymptom}
              onValueChange={(itemValue) => setSelectedSymptom(itemValue)}
              style={styles.picker}
              mode="dropdown"
            >
              {symptomTypes.map((symptom) => (
                <Picker.Item
                  key={symptom}
                  label={
                    symptom.charAt(0).toUpperCase() +
                    symptom.slice(1).replace("_", " ")
                  }
                  value={symptom}
                />
              ))}
            </Picker>
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
            <List.Section>
              {sortedData.map((item) => (
                <List.Item
                  key={item.foodName}
                  title={item.foodName}
                  description={`Avg Score: ${item.averageSymptomScore.toFixed(
                    2
                  )} | Occurrences: ${item.occurrences}`}
                  left={() => <List.Icon icon="food-croissant" />}
                />
              ))}
            </List.Section>
          ) : (
            <EmptyListComponent />
          )}
        </Card.Content>
      </Card>

      <BannerAd size="medium" position="bottom" />
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
  pickerLabel: {
    marginBottom: 12,
    fontWeight: "bold",
  },
  pickerWrapper: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
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
});
