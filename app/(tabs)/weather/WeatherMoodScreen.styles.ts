import { StyleSheet } from "react-native";
import { BrightTheme } from "@/constants/Theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrightTheme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: BrightTheme.colors.textSecondary,
    fontSize: 16,
  },
  header: {
    padding: BrightTheme.spacing.lg,
    paddingTop: BrightTheme.spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
    marginBottom: BrightTheme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: 14,
    color: BrightTheme.colors.textSecondary,
    lineHeight: 22,
  },
  summaryCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    backgroundColor: BrightTheme.colors.surface,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: BrightTheme.colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
    marginBottom: 12,
  },
  patternCard: {
    backgroundColor: BrightTheme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  patternHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  patternEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  patternMood: {
    fontSize: 18,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
    flex: 1,
  },
  patternStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: BrightTheme.colors.border,
    borderBottomWidth: 1,
    borderBottomColor: BrightTheme.colors.border,
  },
  patternStat: {
    alignItems: "center",
  },
  patternLabel: {
    fontSize: 12,
    color: BrightTheme.colors.textSecondary,
    marginBottom: 4,
  },
  patternValue: {
    fontSize: 18,
    fontWeight: "700",
    color: BrightTheme.colors.primary,
  },
  patternCondition: {
    marginTop: 12,
    paddingTop: 12,
  },
  patternConditionText: {
    fontSize: 14,
    color: BrightTheme.colors.textSecondary,
    textAlign: "center",
  },
  entryCard: {
    backgroundColor: BrightTheme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrightTheme.colors.border,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: "500",
    color: BrightTheme.colors.textSecondary,
  },
  entryMoodEmoji: {
    fontSize: 28,
  },
  entryDetails: {
    gap: 8,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entryLabel: {
    fontSize: 14,
    color: BrightTheme.colors.textSecondary,
    fontWeight: "500",
  },
  entryValue: {
    fontSize: 14,
    color: BrightTheme.colors.textPrimary,
    fontWeight: "600",
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: "center",
    marginTop: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: BrightTheme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  errorText: {
    color: BrightTheme.colors.error,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
