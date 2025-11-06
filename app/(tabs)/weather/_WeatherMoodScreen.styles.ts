import { StyleSheet } from "react-native";
import { Theme } from "@/constants/ColorPalettes";

export const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  infoButtonText: {
    fontSize: 20,
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
  },
  summaryCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  patternCard: {
    backgroundColor: theme.colors.surface,
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
    color: theme.colors.textPrimary,
    flex: 1,
  },
  patternStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  patternStat: {
    alignItems: "center",
  },
  patternLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  patternValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  patternCondition: {
    marginTop: 12,
    paddingTop: 12,
  },
  patternConditionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  entryCard: {
    backgroundColor: theme.colors.surface,
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
    borderBottomColor: theme.colors.border,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.textSecondary,
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
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  entryValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
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
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 500,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 20,
    textAlign: "center",
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  modalCloseButton: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: theme.borderRadius.round,
    alignItems: "center",
    marginTop: 20,
  },
  modalCloseButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  insightsCard: {
    margin: 16,
    marginTop: 8,
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
  },
  insightRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    marginBottom: 16,
  },
  insightItem: {
    alignItems: "center",
    flex: 1,
  },
  insightEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  insightLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textAlign: "center",
  },
  insightValue: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  bestWeatherContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  bestWeatherLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 10,
    textAlign: "center",
  },
  bestWeatherBadge: {
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  bestWeatherText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  bestWeatherCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  // Filter styles
  filterCard: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  filterButtonTextActive: {
    color: theme.colors.textOnPrimary,
  },
  filterSubtext: {
    marginTop: 12,
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },

  // Summary row styles
  summaryRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },

  // Temperature range styles
  tempRangeContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  tempRangeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  tempRangeBar: {
    marginVertical: 16,
  },
  tempRangeTrack: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    position: "relative",
    overflow: "visible",
  },
  tempRangeFill: {
    position: "absolute",
    height: 8,
    borderRadius: 4,
  },
  tempRangeOptimal: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    top: -6,
    transform: [{ translateX: -10 }],
    borderWidth: 3,
    borderColor: theme.colors.textOnPrimary,
  },
  tempRangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tempRangeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  tempRangeOptimalLabel: {
    alignItems: "center",
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -50 }],
  },
  tempRangeOptimalText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  tempRangeOptimalSubtext: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },

  // Recommendations card styles
  recommendationsCard: {
    margin: 16,
    marginTop: 8,
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  recommendationIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  recommendationDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },

  // Progress bar styles
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  progressBarText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    textAlign: "right",
  },

  // Updated pattern styles
  patternMoodContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  patternWeatherEmoji: {
    fontSize: 28,
  },
});
