import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  chartWrapper: {
    margin: 10,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 100,
    padding: 20,
  },
  centeredText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
  },
  chartSectionTitle: {
    fontSize: 19,
    fontWeight: "600",
    marginBottom: 15,
    color: "#34495e",
  },
  pickerContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
  },
  picker: {
    width: "100%",
    height: Platform.OS === "android" ? 50 : undefined,
  },
  foodListItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  foodListItemLast: {
    borderBottomWidth: 0,
  },
  foodListItemName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    paddingVertical: 2,
  },
  detailLabel: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  detailValue: {
    fontSize: 14,
    color: "#34495e",
    fontWeight: "500",
  },
  moodIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  moodIndicatorSwatch: {
    width: 18,
    height: 18,
    marginLeft: 10,
    borderRadius: 9,
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
});
