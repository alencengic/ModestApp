import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import {
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/storage/journal_entries";
import { useTheme } from "@/context/ThemeContext";

const CHARACTER_LIMIT = 1000;

const JournalEntryDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const { data: entry, isLoading } = useQuery({
    queryKey: ["journalEntry", id],
    queryFn: async () => {
      const entryId = parseInt(id || "0", 10);
      return await getJournalEntryById(entryId);
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      updateJournalEntry(id, content),
    onSuccess: () => {
      Alert.alert("Success", "Entry updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["journalEntry", id] });
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to update entry");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteJournalEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
      Alert.alert("Deleted", "Entry deleted successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
    onError: () => {
      Alert.alert("Error", "Failed to delete entry");
    },
  });

  const handleEdit = () => {
    setEditedContent(entry?.content || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedContent.trim().length === 0) {
      Alert.alert("Empty Note", "Please write something before saving.");
      return;
    }
    const entryId = parseInt(id || "0", 10);
    updateMutation.mutate({ id: entryId, content: editedContent });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent("");
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this entry? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const entryId = parseInt(id || "0", 10);
            deleteMutation.mutate(entryId);
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: theme.spacing.lg,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.xl,
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    errorText: {
      fontSize: 18,
      color: theme.colors.error,
      marginBottom: theme.spacing.lg,
      textAlign: "center",
    },
    header: {
      marginBottom: theme.spacing.lg,
    },
    backButton: {
      marginBottom: theme.spacing.md,
    },
    backButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
    },
    dateLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.sm,
    },
    dateText: {
      fontSize: 14,
      color: theme.colors.textPrimary,
      fontWeight: "500",
    },
    contentContainer: {
      marginBottom: theme.spacing.xl,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      minHeight: 200,
    },
    contentText: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.textPrimary,
    },
    textInput: {
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      minHeight: 200,
      textAlignVertical: "top",
      fontSize: 16,
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.background,
    },
    counter: {
      textAlign: "right",
      marginTop: theme.spacing.sm,
      color: theme.colors.textLight,
      fontSize: 12,
    },
    actionsContainer: {
      marginTop: theme.spacing.md,
    },
    editActions: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    viewActions: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    button: {
      flex: 1,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.round,
      alignItems: "center",
    },
    editButton: {
      backgroundColor: theme.colors.primary,
    },
    editButtonText: {
      color: theme.colors.textOnPrimary,
      fontSize: 16,
      fontWeight: "600",
    },
    deleteButton: {
      backgroundColor: theme.colors.error,
    },
    deleteButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
    },
    saveButtonText: {
      color: theme.colors.textOnPrimary,
      fontSize: 16,
      fontWeight: "600",
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelButtonText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      fontWeight: "600",
    },
    buttonDisabled: {
      opacity: 0.5,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading entry...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Entry not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Journal Entry</Text>
        </View>

        {/* Date */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Date:</Text>
          <Text style={styles.dateText}>
            {DateTime.fromISO(entry.date).toLocaleString(DateTime.DATETIME_MED)}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.textInput}
                multiline
                maxLength={CHARACTER_LIMIT}
                placeholder="Write your thoughts..."
                placeholderTextColor={theme.colors.textLight}
                value={editedContent}
                onChangeText={setEditedContent}
                autoFocus
              />
              <Text style={styles.counter}>
                {editedContent.length} / {CHARACTER_LIMIT}
              </Text>
            </>
          ) : (
            <Text style={styles.contentText}>{entry.content}</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {isEditing ? (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.saveButton,
                  updateMutation.isPending && styles.buttonDisabled,
                ]}
                onPress={handleSave}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.saveButtonText}>
                  {updateMutation.isPending ? "Saving..." : "💾 Save Changes"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.viewActions}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={handleEdit}
              >
                <Text style={styles.editButtonText}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.deleteButton,
                  deleteMutation.isPending && styles.buttonDisabled,
                ]}
                onPress={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <Text style={styles.deleteButtonText}>
                  {deleteMutation.isPending ? "Deleting..." : "🗑️ Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JournalEntryDetailScreen;
