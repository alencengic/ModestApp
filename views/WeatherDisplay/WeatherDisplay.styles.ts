// components/WeatherDisplay.styles.ts

import { StyleSheet } from "react-native";

export const weatherDisplayStyles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
    marginVertical: 10,
  },
  city: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  temperature: {
    fontSize: 30,
    fontWeight: "600",
    color: "#4caf50",
  },
  description: {
    fontSize: 18,
    color: "#888",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});
