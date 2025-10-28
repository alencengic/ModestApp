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
  },
  statItem: {
    alignItems: "center",
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
});
