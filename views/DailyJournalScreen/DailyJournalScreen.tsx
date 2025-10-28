import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useRouter } from "expo-router";
import {
  insertJournalEntry,
  getJournalEntriesByRange,
} from "@/storage/database";
import { useTheme } from "@/context/ThemeContext";
import { BannerAd } from "@/components/ads";

const CHARACTER_LIMIT = 1000;

const DailyJournalScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"write" | "read">("write");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [range, setRange] = useState<"day" | "week" | "month">("day");
  const [readDate, setReadDate] = useState<Date>(new Date());

  const styles = StyleSheet.create({
    container: {
      paddingBottom: theme.spacing.xl,
      backgroundColor: theme.colors.background,
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
    title: {
      fontSize: 24,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    tabContainer: {
      flexDirection: "row",
      margin: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      overflow: "hidden",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    tabButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      alignItems: "center",
      backgroundColor: "transparent",
    },
    tabButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    tabButtonText: {
      fontSize: 15,
      fontWeight: "500",
      color: theme.colors.textSecondary,
    },
    tabButtonTextActive: {
      color: theme.colors.textOnPrimary,
      fontWeight: "600",
    },
    filterContainer: {
      margin: theme.spacing.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
    },
    filterTitle: {
      fontWeight: "600",
      fontSize: 16,
      marginBottom: theme.spacing.md,
      color: theme.colors.textPrimary,
    },
    buttonGroup: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    filterButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.round,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.textSecondary,
    },
    filterButtonTextActive: {
      color: theme.colors.textOnPrimary,
      fontWeight: "600",
    },
    inputContainer: {
      margin: theme.spacing.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
    },
    dateRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    dateText: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.textSecondary,
    },
    textInput: {
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      height: 200,
      marginBottom: theme.spacing.sm,
      textAlignVertical: "top",
      fontSize: 16,
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.background,
    },
    counter: {
      textAlign: "right",
      marginBottom: theme.spacing.md,
      color: theme.colors.textLight,
      fontSize: 12,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.round,
      alignItems: "center",
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      color: theme.colors.textOnPrimary,
      fontSize: 16,
      fontWeight: "600",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      color: theme.colors.textPrimary,
    },
    emptyState: {
      alignItems: "center",
      padding: theme.spacing.xl,
    },
    emptyStateIcon: {
      fontSize: 48,
      marginBottom: theme.spacing.md,
    },
    noEntries: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    entryContainer: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    entryDate: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    expandIcon: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    entryPreview: {
      fontSize: 14,
      color: theme.colors.textPrimary,
      lineHeight: 20,
    },
  });

  const mutation = useMutation({
    mutationFn: ({ content, date }: { content: string; date: string }) =>
      insertJournalEntry(content, date),
    onSuccess: () => {
      Alert.alert("Note Saved", "Your journal entry has been saved.");
      setNote("");
      refetch();
    },
    onError: () => {
      Alert.alert("Save Failed", "An error occurred while saving your note.");
    },
  });

  const { data: entries = [], refetch } = useQuery({
    queryKey: ["journalEntries", range, readDate],
    queryFn: async () => {
      let fromDate: Date;
      let toDate: Date;

      switch (range) {
        case "day":
          // Ensure we get the full day in local timezone
          fromDate = DateTime.fromJSDate(readDate).startOf("day").toJSDate();
          toDate = DateTime.fromJSDate(readDate).endOf("day").toJSDate();
          break;
        case "week":
          fromDate = DateTime.fromJSDate(readDate)
            .startOf("week")
            .toJSDate();
          toDate = DateTime.fromJSDate(readDate).endOf("week").toJSDate();
          break;
        case "month":
          fromDate = DateTime.fromJSDate(readDate)
            .startOf("month")
            .toJSDate();
          toDate = DateTime.fromJSDate(readDate).endOf("month").toJSDate();
          break;
        default:
          fromDate = DateTime.fromJSDate(readDate).startOf("day").toJSDate();
          toDate = DateTime.fromJSDate(readDate).endOf("day").toJSDate();
      }

      return await getJournalEntriesByRange(fromDate, toDate);
    },
  });

  const handleSave = () => {
    if (note.trim().length === 0) {
      Alert.alert("Empty Note", "Please write something before saving.");
      return;
    }
    mutation.mutate({ content: note, date: selectedDate.toISOString() });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>📔</Text>
          <Text style={styles.title}>Daily Journal</Text>
          <Text style={styles.subtitle}>Express your thoughts and feelings</Text>
        </View>

        <BannerAd size="small" position="top" />

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "write" && styles.tabButtonActive]}
          onPress={() => setActiveTab("write")}
        >
          <Text style={[styles.tabButtonText, activeTab === "write" && styles.tabButtonTextActive]}>
            ✍️ Write Entry
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "read" && styles.tabButtonActive]}
          onPress={() => setActiveTab("read")}
        >
          <Text style={[styles.tabButtonText, activeTab === "read" && styles.tabButtonTextActive]}>
            📚 Read Entries
          </Text>
        </TouchableOpacity>
      </View>

      {/* Write View */}
      {activeTab === "write" && (
        <View style={styles.inputContainer}>
          <View style={styles.dateRow}>
            <Text style={styles.inputLabel}>Today's Entry</Text>
            <Text style={styles.dateText}>
              {DateTime.fromJSDate(selectedDate).toLocaleString(DateTime.DATE_MED)}
            </Text>
          </View>
          <TextInput
            style={styles.textInput}
            multiline
            maxLength={CHARACTER_LIMIT}
            placeholder="Write your thoughts..."
            placeholderTextColor={theme.colors.textLight}
            value={note}
            onChangeText={setNote}
          />
          <Text style={styles.counter}>
            {note.length} / {CHARACTER_LIMIT}
          </Text>
          <TouchableOpacity
            style={[styles.saveButton, mutation.isPending && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={mutation.isPending}
          >
            <Text style={styles.saveButtonText}>
              {mutation.isPending ? "Saving..." : "💾 Save Entry"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Read View */}
      {activeTab === "read" && (
        <>
          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>Time Period</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.filterButton, range === "day" && styles.filterButtonActive]}
                onPress={() => {
                  setRange("day");
                  setReadDate(new Date());
                }}
              >
                <Text style={[styles.filterButtonText, range === "day" && styles.filterButtonTextActive]}>
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, range === "week" && styles.filterButtonActive]}
                onPress={() => {
                  setRange("week");
                  setReadDate(new Date());
                }}
              >
                <Text style={[styles.filterButtonText, range === "week" && styles.filterButtonTextActive]}>
                  Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, range === "month" && styles.filterButtonActive]}
                onPress={() => {
                  setRange("month");
                  setReadDate(new Date());
                }}
              >
                <Text style={[styles.filterButtonText, range === "month" && styles.filterButtonTextActive]}>
                  Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.filterButtonText}>
                  📅 Pick Date
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={readDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setReadDate(date);
                  setRange("day");
                }
              }}
            />
          )}

          <Text style={styles.sectionTitle}>Saved Entries</Text>
          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📖</Text>
              <Text style={styles.noEntries}>No entries for this period</Text>
            </View>
          ) : (
            entries.map((entry, index) => (
              <TouchableOpacity
                key={entry?.id || index}
                onPress={() => router.push(`/journal-entry-detail?id=${entry?.id}`)}
                style={styles.entryContainer}
              >
                <View style={styles.entryHeader}>
                  <Text style={styles.entryDate}>
                    {DateTime.fromISO(entry?.date).toLocaleString(
                      DateTime.DATETIME_MED
                    )}
                  </Text>
                  <Text style={styles.expandIcon}>→</Text>
                </View>
                <Text style={styles.entryPreview} numberOfLines={2}>
                  {entry?.content}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </>
      )}

        <BannerAd size="medium" position="bottom" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DailyJournalScreen;
