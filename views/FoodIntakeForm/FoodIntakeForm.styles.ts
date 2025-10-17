import { StyleSheet } from "react-native";

export const foodIntakeFormStyles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 25,
    textAlign: "center",
    color: "#666",
  },
  mealSection: {
    marginBottom: 25,
  },
  mealCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mealCardFilled: {
    backgroundColor: "#e3f2fd",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  mealIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  mealLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: "#ff6b6b",
    fontSize: 14,
    fontWeight: "600",
  },
  inputField: {
    height: 48,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  inputFieldFocused: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  suggestionsContainer: {
    marginTop: 10,
    maxHeight: 180,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  suggestionItemLast: {
    borderBottomWidth: 0,
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
  noSuggestions: {
    padding: 15,
    alignItems: "center",
  },
  noSuggestionsText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  closeButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
