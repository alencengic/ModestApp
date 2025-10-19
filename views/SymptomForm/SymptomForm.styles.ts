import { StyleSheet } from "react-native";
import { BrightTheme } from "@/constants/Theme";

export const symptomFormStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BrightTheme.spacing.md,
  },
  section: {
    marginBottom: BrightTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: BrightTheme.spacing.lg,
    textAlign: "center",
    color: BrightTheme.colors.textPrimary,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: BrightTheme.spacing.sm,
    color: BrightTheme.colors.textPrimary,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: BrightTheme.spacing.sm,
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 24,
    borderColor: BrightTheme.colors.border,
    backgroundColor: BrightTheme.colors.surface,
    ...BrightTheme.shadows.sm,
  },
  buttonSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
  },
  selectedButton: {
    backgroundColor: BrightTheme.colors.primary,
    borderColor: BrightTheme.colors.primary,
    borderWidth: 2,
  },
  selectedButtonText: {
    color: BrightTheme.colors.textOnPrimary,
  },
  bloatingButton: {
    width: "auto",
    minWidth: 72,
    paddingHorizontal: 12,
    borderRadius: 21,
    height: 42,
  },
  mealTagButton: {
    width: "auto",
    minWidth: 80,
    paddingHorizontal: 12,
    borderRadius: 21,
    height: 42,
  },
  toggleSection: {
    marginBottom: BrightTheme.spacing.lg,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: BrightTheme.spacing.sm,
    paddingHorizontal: BrightTheme.spacing.md,
    backgroundColor: BrightTheme.colors.surface,
    borderRadius: BrightTheme.borderRadius.md,
    marginBottom: BrightTheme.spacing.sm,
    borderWidth: 1,
    borderColor: BrightTheme.colors.border,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: BrightTheme.colors.textPrimary,
  },
  toggleButton: {
    width: 56,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrightTheme.colors.border,
    backgroundColor: BrightTheme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: BrightTheme.colors.primary,
    borderColor: BrightTheme.colors.primary,
  },
  toggleButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: BrightTheme.colors.textSecondary,
  },
  toggleButtonTextActive: {
    color: BrightTheme.colors.textOnPrimary,
  },
  mealSummary: {
    backgroundColor: BrightTheme.colors.surface,
    padding: BrightTheme.spacing.md,
    borderRadius: BrightTheme.borderRadius.md,
    marginBottom: BrightTheme.spacing.lg,
    borderWidth: 1,
    borderColor: BrightTheme.colors.border,
  },
  mealLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: BrightTheme.colors.textPrimary,
    marginBottom: BrightTheme.spacing.xs,
  },
  mealItems: {
    fontSize: 14,
    color: BrightTheme.colors.textSecondary,
    lineHeight: 20,
  },
});
