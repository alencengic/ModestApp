import { StyleSheet } from "react-native";
import { Theme } from "@/constants/ColorPalettes";
import { scaleFontSize, scale } from "@/utils/responsive";

export const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.xl,
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: theme.spacing.md,
  },
  backButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  headerEmoji: {
    fontSize: scaleFontSize(48),
    marginBottom: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: scaleFontSize(24),
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  headerDescription: {
    fontSize: scaleFontSize(14),
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.lg,
    lineHeight: 20,
  },
  chartWrapper: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  chartSectionTitle: {
    fontSize: scaleFontSize(19),
    fontWeight: "600",
    marginBottom: scale(8),
    color: theme.colors.textPrimary,
  },
  sectionDescription: {
    fontSize: scaleFontSize(13),
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: scale(100),
    padding: scale(20),
  },
  centeredText: {
    fontSize: scaleFontSize(16),
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  comparisonContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  comparisonCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  comparisonCardTitle: {
    fontSize: scaleFontSize(16),
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  comparisonCardCount: {
    fontSize: scaleFontSize(12),
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  comparisonMetric: {
    marginBottom: theme.spacing.md,
  },
  comparisonMetricLabel: {
    fontSize: scaleFontSize(13),
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs / 2,
  },
  comparisonMetricValue: {
    fontSize: scaleFontSize(24),
    fontWeight: "700",
    marginBottom: theme.spacing.xs / 2,
  },
  comparisonMetricCategory: {
    fontSize: scaleFontSize(12),
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  differenceSummary: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  differenceSummaryTitle: {
    fontSize: scaleFontSize(14),
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  differenceSummaryText: {
    fontSize: scaleFontSize(14),
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  insightsCard: {
    backgroundColor: `${theme.colors.primary}15`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}30`,
  },
  insightsTitle: {
    fontSize: scaleFontSize(16),
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  insightsRecommendation: {
    fontSize: scaleFontSize(14),
    color: theme.colors.textPrimary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  confidenceLabel: {
    fontSize: scaleFontSize(12),
    color: theme.colors.textSecondary,
  },
  confidenceBold: {
    fontWeight: "700",
    color: theme.colors.primary,
    textTransform: "uppercase",
  },
  significantBadge: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.round,
  },
  significantText: {
    fontSize: scaleFontSize(11),
    fontWeight: "700",
    color: theme.colors.textOnPrimary,
  },
});
