import { StyleSheet } from "react-native";

export const productivityRatingStyles = StyleSheet.create({
  productivityContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  productivityTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  productivityButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  productivityButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#ccc",
    backgroundColor: "#e0e0e0",
  },
  selectedProductivity: {
    backgroundColor: "#4caf50",
  },
  productivityText: {
    fontSize: 18,
  },
  selectedProductivityText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
  },
});
