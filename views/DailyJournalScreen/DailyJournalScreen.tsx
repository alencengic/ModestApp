import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import {
  insertJournalEntry,
  getJournalEntriesByRange,
} from "@/storage/database";

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
      <Text style={styles.title}>Daily Journal</Text>
      <View style={styles.buttonGroup}>
        <Button title="Today" onPress={() => setRange("day")} />
        <Button title="This Week" onPress={() => setRange("week")} />
        <Button title="This Month" onPress={() => setRange("month")} />
        <Button
          title="Choose a Day"
          onPress={() => {
            setRange("custom");
            setShowDatePicker(true);
          }}
        />
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

      <TextInput
        style={styles.textInput}
        multiline
        maxLength={CHARACTER_LIMIT}
        placeholder="Write your thoughts..."
        value={note}
        onChangeText={setNote}
      />
      <Text style={styles.counter}>
        {note.length} / {CHARACTER_LIMIT}
      </Text>
      <Button
        title="Save Note"
        onPress={handleSave}
        disabled={mutation.isPending}
      />

      <Text style={styles.subtitle}>Saved Entries</Text>
      {entries.length === 0 ? (
        <Text style={styles.noEntries}>No entries for this range.</Text>
      ) : (
        entries.map((entry, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveEntryDate(entry?.date)}
              style={styles.entryContainer}
            >
              <Text style={styles.entryText}>
                {DateTime.fromISO(entry?.date).toLocaleString(
                  DateTime.DATETIME_MED
                )}
              </Text>

              {activeEntryDate === entry?.date && (
                <Text style={styles.entryDetail}>{entry?.content}</Text>
              )}
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
};

export default DailyJournalScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 24,
    marginBottom: 8,
    fontWeight: "bold",
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 200,
    marginBottom: 8,
    textAlignVertical: "top",
  },
  counter: {
    textAlign: "right",
    marginBottom: 16,
    color: "#888",
    fontSize: 12,
  },
  entryContainer: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  entryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  entryDetail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  noEntries: {
    fontStyle: "italic",
    color: "#999",
  },
});
