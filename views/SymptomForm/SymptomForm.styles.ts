import { StyleSheet } from "react-native";

export const symptomFormStyles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#ccc",
    backgroundColor: "#e0e0e0",
  },
  buttonSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  selectedButtonText: {
    color: "#fff",
  },
  bloatingButton: {
    width: "auto",
    minWidth: 80,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  mealTagButton: {
    width: "auto",
    minWidth: 90,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  toggleSection: {
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#333",
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  toggleButtonTextActive: {
    color: "#fff",
  },
});
