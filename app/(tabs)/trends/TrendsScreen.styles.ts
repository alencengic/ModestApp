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
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
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
  selectedDateDisplay: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textOnPrimary,
  },
  chartWrapper: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
    color: theme.colors.textPrimary,
  },
  chartSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  foodCardsContainer: {
    marginTop: 10,
  },
  foodCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    position: "relative",
  },
  foodCardBar: {
    height: 4,
    position: "absolute",
    top: 0,
    left: 0,
  },
  foodCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
  },
  foodCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
    minWidth: 0,
  },
  foodCardDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  foodCardLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    flex: 1,
  },
  foodCardStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  foodCardValue: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  foodCardPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  errorText: {
    color: theme.colors.error,
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
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  legendContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 10,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: "500",
  },
  legendValues: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendValue: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  legendPercentage: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  statItem: {
    alignItems: "center",
    minWidth: 80,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },

  // Summary card styles
  summaryCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  summaryItem: {
    flex: 1,
    minWidth: 90,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },

  // Insights card styles
  insightsCard: {
    margin: theme.spacing.md,
    marginTop: 0,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },

  // Top foods section
  topFoodsSection: {
    marginBottom: theme.spacing.lg,
  },
  topFoodsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  topFoodsContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  topFoodCard: {
    flex: 1,
    minWidth: 100,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
  },
  topFoodMedal: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  topFoodName: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 4,
    textAlign: "center",
  },
  topFoodValue: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  topFoodBar: {
    width: "100%",
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  topFoodBarFill: {
    height: 6,
    borderRadius: 3,
  },
  topFoodPercentage: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.primary,
  },

  // Enhanced food card styles
  foodCardHighlight: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  rankBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.round,
  },
});
