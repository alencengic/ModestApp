import { StyleSheet } from "react-native";

export const moodRatingStyles = StyleSheet.create({
  moodContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  moodTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  moodButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  moodButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 24,
    borderColor: "#ccc",
    backgroundColor: "#e0e0e0",
  },
  selectedMood: {
    backgroundColor: "#ffd700",
    borderColor: "#ffa500",
  },
  emoji: {
    fontSize: 24,
  },
  selectedText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
  },
});
