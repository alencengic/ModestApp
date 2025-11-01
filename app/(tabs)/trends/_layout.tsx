import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function TrendsLayout() {
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
        name="index"
        options={{
          title: "Trends and Analytics",
        }}
      />
      <Stack.Screen
        name="food-analytics"
        options={{
          title: "Food Analytics",
        }}
      />
    </Stack>
  );
}
