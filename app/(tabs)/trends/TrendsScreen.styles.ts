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
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
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
  chartWrapper: {
    margin: BrightTheme.spacing.md,
    padding: BrightTheme.spacing.lg,
    backgroundColor: BrightTheme.colors.surface,
    borderRadius: BrightTheme.borderRadius.xl,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: BrightTheme.spacing.sm,
    color: BrightTheme.colors.textPrimary,
  },
  chartSubtitle: {
    fontSize: 14,
    color: BrightTheme.colors.textSecondary,
    marginBottom: BrightTheme.spacing.lg,
  },
  chartViewContainer: {
    height: 320,
    width: "100%",
    marginBottom: 20,
    backgroundColor: BrightTheme.colors.background,
    borderRadius: 12,
    padding: 10,
  },
  errorText: {
    color: BrightTheme.colors.error,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: BrightTheme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BrightTheme.colors.border,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: BrightTheme.colors.background,
    borderRadius: 8,
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: BrightTheme.colors.textPrimary,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BrightTheme.colors.border,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: BrightTheme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: BrightTheme.colors.textSecondary,
    fontWeight: "500",
  },
});
