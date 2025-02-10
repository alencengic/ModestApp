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
    gap: 10,
  },
  moodButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#ccc",
    backgroundColor: "#e0e0e0",
  },
  selectedMood: {
    backgroundColor: "#ffd700",
  },
  emoji: {
    fontSize: 30,
  },
  selectedText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
  },
});
