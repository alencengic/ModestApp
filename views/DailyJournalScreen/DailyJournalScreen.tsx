import React, { useState, useCallback } from "react";
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
} from "@/storage/supabase/journalEntries";
import { useTheme } from "@/context/ThemeContext";
import { BannerAd } from "@/components/ads";
import { useTranslation } from "react-i18next";
import { searchJournalEntries, saveSearch } from "@/services/searchService";

const CHARACTER_LIMIT = 1000;

const DailyJournalScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"write" | "read">("write");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [range, setRange] = useState<"day" | "week" | "month">("day");
  const [readDate, setReadDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchJournalEntries(query);
      setSearchResults(results);
      await saveSearch(query);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const styles = StyleSheet.create({
    container: {
      paddingBottom: theme.spacing.xl,
      backgroundColor: theme.colors.background,
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
    datePickerContainer: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    },
  });

  const mutation = useMutation({
    mutationFn: ({ content, date }: { content: string; date: string }) =>
      insertJournalEntry(content, date),
    onSuccess: () => {
      Alert.alert(t('dailyJournal.noteSaved'), t('dailyJournal.noteSavedMessage'));
      setNote("");
      refetch();
    },
    onError: () => {
      Alert.alert(t('dailyJournal.saveFailed'), t('dailyJournal.saveFailedMessage'));
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
      Alert.alert(t('dailyJournal.emptyNote'), t('dailyJournal.emptyNoteMessage'));
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
        <BannerAd size="small" position="top" />

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "write" && styles.tabButtonActive]}
          onPress={() => setActiveTab("write")}
        >
          <Text style={[styles.tabButtonText, activeTab === "write" && styles.tabButtonTextActive]}>
            {t('dailyJournal.writeEntry')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "read" && styles.tabButtonActive]}
          onPress={() => setActiveTab("read")}
        >
          <Text style={[styles.tabButtonText, activeTab === "read" && styles.tabButtonTextActive]}>
            {t('dailyJournal.readEntries')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Write View */}
      {activeTab === "write" && (
        <View style={styles.inputContainer}>
          <View style={styles.dateRow}>
            <Text style={styles.inputLabel}>{t('dailyJournal.todaysEntry')}</Text>
            <Text style={styles.dateText}>
              {DateTime.fromJSDate(selectedDate).toLocaleString(DateTime.DATE_MED)}
            </Text>
          </View>
          <TextInput
            style={styles.textInput}
            multiline
            maxLength={CHARACTER_LIMIT}
            placeholder={t('dailyJournal.writePlaceholder')}
            placeholderTextColor={theme.colors.textLight}
            value={note}
            onChangeText={setNote}
          />
          <Text style={styles.counter}>
            {t('dailyJournal.charactersRemaining', { count: note.length, max: CHARACTER_LIMIT })}
          </Text>
          <TouchableOpacity
            style={[styles.saveButton, mutation.isPending && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={mutation.isPending}
          >
            <Text style={styles.saveButtonText}>
              {mutation.isPending ? t('common.loading') : `💾 ${t('common.save')} ${t('dailyJournal.title')}`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Read View */}
      {activeTab === "read" && (
        <>
          {/* Search Bar */}
          <View style={{
            marginHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.sm,
          }}>
            <TextInput
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                fontSize: 16,
                color: theme.colors.textPrimary,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              placeholder="🔍 Search journal entries..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                handleSearch(text);
              }}
            />
          </View>

          {/* Search Results */}
          {searchQuery.trim() && searchResults.length > 0 && (
            <View style={{
              marginHorizontal: theme.spacing.md,
              marginBottom: theme.spacing.md,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.sm,
              }}>
                Found {searchResults.length} results
              </Text>
              {searchResults.slice(0, 5).map((result, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    paddingVertical: theme.spacing.sm,
                    borderBottomWidth: idx < searchResults.length - 1 ? 1 : 0,
                    borderBottomColor: theme.colors.divider,
                  }}
                  onPress={() => router.push(`/journal-entry-detail?id=${result.id}`)}
                >
                  <Text style={{ color: theme.colors.textPrimary, fontSize: 14 }}>
                    {result.content?.substring(0, 80)}...
                  </Text>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                    {result.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>{t('dailyJournal.timePeriod')}</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.filterButton, range === "day" && styles.filterButtonActive]}
                onPress={() => {
                  setRange("day");
                  setReadDate(new Date());
                }}
              >
                <Text style={[styles.filterButtonText, range === "day" && styles.filterButtonTextActive]}>
                  {t('dailyJournal.today')}
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
                  {t('dailyJournal.week')}
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
                  {t('dailyJournal.month')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.filterButtonText}>
                  📅 {t('dailyJournal.day')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={readDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (event.type === "set" && date) {
                    setReadDate(date);
                    setRange("day");
                    setShowDatePicker(false);
                  } else if (event.type === "dismissed") {
                    setShowDatePicker(false);
                  }
                }}
              />
            </View>
          )}

          <Text style={styles.sectionTitle}>{t('dailyJournal.readEntries')}</Text>
          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📖</Text>
              <Text style={styles.noEntries}>{t('dailyJournal.noEntries')}</Text>
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
