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
import { BrightTheme } from "@/constants/Theme";
import { BannerAd } from "@/components/ads";

const CHARACTER_LIMIT = 1000;

const DailyJournalScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"write" | "read">("write");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [range, setRange] = useState<"day" | "week" | "month">("day");
  const [readDate, setReadDate] = useState<Date>(new Date());

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
            placeholderTextColor={BrightTheme.colors.textLight}
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

const styles = StyleSheet.create({
  container: {
    paddingBottom: BrightTheme.spacing.xl,
    backgroundColor: BrightTheme.colors.background,
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
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
    marginBottom: BrightTheme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: BrightTheme.colors.textSecondary,
  },
  tabContainer: {
    flexDirection: "row",
    margin: BrightTheme.spacing.md,
    marginBottom: BrightTheme.spacing.sm,
    borderRadius: BrightTheme.borderRadius.lg,
    overflow: "hidden",
    backgroundColor: BrightTheme.colors.surface,
    borderWidth: 1,
    borderColor: BrightTheme.colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: BrightTheme.spacing.md,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  tabButtonActive: {
    backgroundColor: BrightTheme.colors.primary,
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: BrightTheme.colors.textSecondary,
  },
  tabButtonTextActive: {
    color: BrightTheme.colors.textOnPrimary,
    fontWeight: "600",
  },
  filterContainer: {
    margin: BrightTheme.spacing.md,
    padding: BrightTheme.spacing.lg,
    backgroundColor: BrightTheme.colors.surface,
    borderRadius: BrightTheme.borderRadius.lg,
  },
  filterTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: BrightTheme.spacing.md,
    color: BrightTheme.colors.textPrimary,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: BrightTheme.spacing.sm,
  },
  filterButton: {
    paddingVertical: BrightTheme.spacing.sm,
    paddingHorizontal: BrightTheme.spacing.md,
    borderRadius: BrightTheme.borderRadius.round,
    backgroundColor: BrightTheme.colors.background,
    borderWidth: 1,
    borderColor: BrightTheme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: BrightTheme.colors.primary,
    borderColor: BrightTheme.colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: BrightTheme.colors.textSecondary,
  },
  filterButtonTextActive: {
    color: BrightTheme.colors.textOnPrimary,
    fontWeight: "600",
  },
  inputContainer: {
    margin: BrightTheme.spacing.md,
    padding: BrightTheme.spacing.lg,
    backgroundColor: BrightTheme.colors.surface,
    borderRadius: BrightTheme.borderRadius.lg,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: BrightTheme.spacing.md,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    color: BrightTheme.colors.textSecondary,
  },
  textInput: {
    borderColor: BrightTheme.colors.border,
    borderWidth: 1,
    borderRadius: BrightTheme.borderRadius.md,
    padding: BrightTheme.spacing.md,
    height: 200,
    marginBottom: BrightTheme.spacing.sm,
    textAlignVertical: "top",
    fontSize: 16,
    color: BrightTheme.colors.textPrimary,
    backgroundColor: BrightTheme.colors.background,
  },
  counter: {
    textAlign: "right",
    marginBottom: BrightTheme.spacing.md,
    color: BrightTheme.colors.textLight,
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: BrightTheme.colors.primary,
    padding: BrightTheme.spacing.md,
    borderRadius: BrightTheme.borderRadius.round,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: BrightTheme.colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: BrightTheme.spacing.md,
    marginTop: BrightTheme.spacing.lg,
    marginBottom: BrightTheme.spacing.md,
    color: BrightTheme.colors.textPrimary,
  },
  emptyState: {
    alignItems: "center",
    padding: BrightTheme.spacing.xl,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: BrightTheme.spacing.md,
  },
  noEntries: {
    fontSize: 16,
    color: BrightTheme.colors.textSecondary,
    textAlign: "center",
  },
  entryContainer: {
    backgroundColor: BrightTheme.colors.surface,
    marginHorizontal: BrightTheme.spacing.md,
    marginBottom: BrightTheme.spacing.md,
    padding: BrightTheme.spacing.md,
    borderRadius: BrightTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: BrightTheme.colors.border,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: BrightTheme.spacing.sm,
  },
  entryDate: {
    fontSize: 14,
    color: BrightTheme.colors.textSecondary,
    fontWeight: "500",
  },
  expandIcon: {
    fontSize: 16,
    color: BrightTheme.colors.primary,
    fontWeight: "600",
  },
  entryPreview: {
    fontSize: 14,
    color: BrightTheme.colors.textPrimary,
    lineHeight: 20,
  },
});
