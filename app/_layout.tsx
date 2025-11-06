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
import { AuthProvider, useAuth } from "@/context/AuthContext";
import "@/i18n/i18n.config";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isDark } = useTheme();
  const { user, loading: authLoading } = useAuth();
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

  // Handle authentication and onboarding flow
  useEffect(() => {
    if (!authLoading && hasSeenOnboarding !== null) {
      const currentPath = segments.join('/');
      const isOnAuthScreen = currentPath.includes('auth');
      const isOnOnboardingFlow = currentPath.includes('onboarding') || currentPath.includes('profile-setup');

      if (!user && !isOnAuthScreen) {
        // User not authenticated, redirect to auth
        router.replace("/auth");
      } else if (user && !hasSeenOnboarding && !isOnOnboardingFlow) {
        // User authenticated but hasn't seen onboarding
        router.replace("/onboarding");
      } else if (user && hasSeenOnboarding && (isOnAuthScreen || isOnOnboardingFlow)) {
        // User authenticated and has seen onboarding, redirect to main app
        router.replace("/(tabs)");
      }
    }
  }, [user, authLoading, hasSeenOnboarding, segments]);

  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await scheduleDailyNotifications();
      }
    };

    setupNotifications();
  }, []);

  if (authLoading || hasSeenOnboarding === null) {
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
        <Stack.Screen name="auth" options={{ headerShown: false }} />
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
          <AuthProvider>
            <UserProfileProvider>
              <RootLayoutNav />
            </UserProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
