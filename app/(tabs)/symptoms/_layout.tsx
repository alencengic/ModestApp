import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function SymptomsLayout() {
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
        name="post-meal"
        options={{
          title: "Symptoms",
        }}
      />
    </Stack>
  );
}
