import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function MoodLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false, // All screens use custom back buttons
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="analytics"
        options={{
          title: "Mood Analytics",
        }}
      />
      <Stack.Screen
        name="lifestyle-analysis"
        options={{
          title: "Lifestyle Factors",
        }}
      />
      <Stack.Screen
        name="food-impact-analysis"
        options={{
          title: "Food Impact Analysis",
        }}
      />
    </Stack>
  );
}
