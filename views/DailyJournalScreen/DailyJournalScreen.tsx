import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { LinearGradient } from "expo-linear-gradient";
import {
  insertJournalEntry,
  getJournalEntriesByRange,
} from "@/storage/database";
import { BrightTheme } from "@/constants/Theme";
import { BannerAd } from "@/components/ads";

const CHARACTER_LIMIT = 1000;

const DailyJournalScreen: React.FC = () => {
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [range, setRange] = useState<"day" | "week" | "month" | "custom">(
    "day"
  );
  const [activeEntryDate, setActiveEntryDate] = useState<string | null>(null);

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
    queryKey: ["journalEntries", range, selectedDate],
    queryFn: async () => {
      let fromDate: Date;
      let toDate: Date;

      switch (range) {
        case "day":
          fromDate = selectedDate;
          toDate = selectedDate;
          break;
        case "week":
          fromDate = DateTime.fromJSDate(selectedDate)
            .startOf("week")
            .toJSDate();
          toDate = DateTime.fromJSDate(selectedDate).endOf("week").toJSDate();
          break;
        case "month":
          fromDate = DateTime.fromJSDate(selectedDate)
            .startOf("month")
            .toJSDate();
          toDate = DateTime.fromJSDate(selectedDate).endOf("month").toJSDate();
          break;
        case "custom":
        default:
          fromDate = selectedDate;
          toDate = selectedDate;
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📔</Text>
        <Text style={styles.title}>Daily Journal</Text>
        <Text style={styles.subtitle}>Express your thoughts and feelings</Text>
      </View>

      <BannerAd size="small" position="top" />

      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Time Period</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.filterButton, range === "day" && styles.filterButtonActive]}
            onPress={() => setRange("day")}
          >
            <Text style={[styles.filterButtonText, range === "day" && styles.filterButtonTextActive]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, range === "week" && styles.filterButtonActive]}
            onPress={() => setRange("week")}
          >
            <Text style={[styles.filterButtonText, range === "week" && styles.filterButtonTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, range === "month" && styles.filterButtonActive]}
            onPress={() => setRange("month")}
          >
            <Text style={[styles.filterButtonText, range === "month" && styles.filterButtonTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, range === "custom" && styles.filterButtonActive]}
            onPress={() => {
              setRange("custom");
              setShowDatePicker(true);
            }}
          >
            <Text style={[styles.filterButtonText, range === "custom" && styles.filterButtonTextActive]}>
              Custom
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              setSelectedDate(date);
            }
          }}
        />
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>✍️ Today's Entry</Text>
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

      <Text style={styles.sectionTitle}>📚 Saved Entries</Text>
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📖</Text>
          <Text style={styles.noEntries}>No entries for this period</Text>
        </View>
      ) : (
        entries.map((entry, index) => {
          const isActive = activeEntryDate === entry?.date;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveEntryDate(isActive ? null : entry?.date)}
              style={[styles.entryContainer, isActive && styles.entryContainerActive]}
            >
              <View style={styles.entryHeader}>
                <Text style={styles.entryDate}>
                  {DateTime.fromISO(entry?.date).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </Text>
                <Text style={styles.expandIcon}>{isActive ? "▲" : "▼"}</Text>
              </View>

              {isActive && (
                <Text style={styles.entryDetail}>{entry?.content}</Text>
              )}
            </TouchableOpacity>
          );
        })
      )}

      <BannerAd size="medium" position="bottom" />
    </ScrollView>
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
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: BrightTheme.spacing.md,
    color: BrightTheme.colors.textPrimary,
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
  entryContainerActive: {
    borderColor: BrightTheme.colors.primary,
    backgroundColor: BrightTheme.colors.background,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entryDate: {
    fontSize: 14,
    color: BrightTheme.colors.textSecondary,
    fontWeight: "500",
  },
  expandIcon: {
    fontSize: 12,
    color: BrightTheme.colors.textSecondary,
  },
  entryDetail: {
    fontSize: 14,
    color: BrightTheme.colors.textPrimary,
    marginTop: BrightTheme.spacing.md,
    paddingTop: BrightTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: BrightTheme.colors.divider,
    lineHeight: 22,
  },
});
