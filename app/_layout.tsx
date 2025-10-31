import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
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
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { UserProfileProvider } from "@/context/UserProfileContext";
import { LanguageProvider } from "@/context/LanguageContext";
import "@/i18n/i18n.config";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isDark } = useTheme();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

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
    if (hasSeenOnboarding !== null) {
      // Redirect to onboarding if not seen
      const currentPath = segments.join('/');
      const isOnOnboardingFlow = currentPath.includes('onboarding') || currentPath.includes('profile-setup');
      if (!hasSeenOnboarding && !isOnOnboardingFlow) {
        router.replace("/onboarding");
      }
    }
  }, [hasSeenOnboarding, segments]);

  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await scheduleDailyNotifications();
      }
    };

    setupNotifications();
  }, []);

  if (hasSeenOnboarding === null) {
    return null;
  }

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      >
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="journal-entry-detail" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <UserProfileProvider>
            <RootLayoutNav />
          </UserProfileProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
