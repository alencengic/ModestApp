import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function DailyLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false, // All screens use custom back buttons or drawer
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="journal"
        options={{
          title: "Daily Journal",
        }}
      />
      <Stack.Screen
        name="daily"
        options={{
          title: "Daily Entry",
        }}
      />
    </Stack>
  );
}
