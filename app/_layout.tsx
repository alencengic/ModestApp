import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useWeatherSync } from "@/hooks/useWeatherSync";
import { requestNotificationPermissions, scheduleDailyNotifications } from "@/services/notificationService";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useWeatherSync();

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("hasSeenOnboarding");
      setHasSeenOnboarding(seen === "true");
    };
    checkOnboarding();
  }, []);

  // Re-check onboarding status when segments change (e.g., after completing onboarding)
  useEffect(() => {
    const recheckOnboarding = async () => {
      const seen = await AsyncStorage.getItem("hasSeenOnboarding");
      if (seen === "true" && !hasSeenOnboarding) {
        setHasSeenOnboarding(true);
      }
    };
    recheckOnboarding();
  }, [segments]);

  useEffect(() => {
    if (loaded && hasSeenOnboarding !== null) {
      SplashScreen.hideAsync();

      // Redirect to onboarding if not seen
      if (!hasSeenOnboarding && !segments.includes("onboarding")) {
        router.replace("/onboarding");
      }
    }
  }, [loaded, hasSeenOnboarding, segments]);

  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await scheduleDailyNotifications();
      }
    };

    setupNotifications();
  }, []);

  if (!loaded || hasSeenOnboarding === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="journal-entry-detail" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
