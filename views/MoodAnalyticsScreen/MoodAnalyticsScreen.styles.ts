import { StyleSheet, Platform } from "react-native";
import { Theme } from "@/constants/ColorPalettes";
import { scaleFontSize, scale } from "@/utils/responsive";

export const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  chartWrapper: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
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
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: scaleFontSize(16),
    color: "#e74c3c",
    textAlign: "center",
  },
  chartSectionTitle: {
    fontSize: scaleFontSize(19),
    fontWeight: "600",
    marginBottom: scale(15),
    color: "#34495e",
  },
  pickerContainer: {
    marginHorizontal: scale(10),
    marginBottom: scale(20),
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: scale(8),
  },
  picker: {
    width: "100%",
    height: Platform.OS === "android" ? scale(50) : undefined,
  },
  foodListItem: {
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  foodListItemLast: {
    borderBottomWidth: 0,
  },
  foodListItemName: {
    fontSize: scaleFontSize(17),
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: scale(8),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(6),
    paddingVertical: scale(2),
  },
  detailLabel: {
    fontSize: scaleFontSize(14),
    color: "#7f8c8d",
  },
  detailValue: {
    fontSize: scaleFontSize(14),
    color: "#34495e",
    fontWeight: "500",
  },
  moodIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: scale(8),
  },
  moodIndicatorSwatch: {
    width: scale(18),
    height: scale(18),
    marginLeft: scale(10),
    borderRadius: scale(9),
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  filterContainer: {
    padding: 15,
    backgroundColor: "white",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },

  // Toggle buttons styles
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  toggleButtonTextActive: {
    color: "#fff",
  },

  // Food selector button styles
  foodSelectorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 10,
  },
  foodSelectorButtonText: {
    fontSize: 16,
    color: "#34495e",
    flex: 1,
  },
  foodSelectorButtonIcon: {
    fontSize: 12,
    color: "#7f8c8d",
    marginLeft: 10,
  },
  clearButton: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#e74c3c",
    borderRadius: 6,
    marginBottom: 10,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseButtonText: {
    fontSize: 20,
    color: "#666",
  },
  searchInput: {
    margin: 20,
    marginTop: 15,
    marginBottom: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  foodItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  foodItemSelected: {
    backgroundColor: "#e3f2fd",
  },
  foodItemText: {
    fontSize: 16,
    color: "#34495e",
  },
  foodItemTextSelected: {
    fontWeight: "600",
    color: theme.colors.primary,
  },

  // Info button styles
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing.sm,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoButtonText: {
    fontSize: 24,
    color: theme.colors.primary,
  },

  // Info modal styles
  infoModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxHeight: "80%",
    maxWidth: 500,
  },
  infoModalContent: {
    padding: 20,
    maxHeight: 400,
  },
  infoText: {
    fontSize: 15,
    color: "#34495e",
    lineHeight: 22,
    marginBottom: 16,
  },
  colorExplanation: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  colorLabel: {
    fontSize: 14,
    color: "#34495e",
    flex: 1,
    lineHeight: 20,
  },
  infoNote: {
    fontSize: 13,
    color: "#7f8c8d",
    fontStyle: "italic",
    marginTop: 8,
    padding: 12,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    lineHeight: 20,
  },

  // Date filter styles
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
});
