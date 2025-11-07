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
  const [hasCompletedProfileSetup, setHasCompletedProfileSetup] = useState<boolean | null>(null);

  useWeatherSync();

  // Check onboarding and profile setup status
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setHasSeenOnboarding(null);
        setHasCompletedProfileSetup(null);
        return;
      }

      try {
        const [onboardingSeen, profileSetupCompleted] = await Promise.all([
          AsyncStorage.getItem(`hasSeenOnboarding_${user.id}`),
          AsyncStorage.getItem(`hasCompletedProfileSetup_${user.id}`)
        ]);
        
        setHasSeenOnboarding(onboardingSeen === "true");
        setHasCompletedProfileSetup(profileSetupCompleted === "true");
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasSeenOnboarding(false);
        setHasCompletedProfileSetup(false);
      }
    };
    
    checkOnboardingStatus();
  }, [user]);

  // Handle authentication and onboarding flow
  useEffect(() => {
    if (!authLoading) {
      const currentPath = segments.join('/');
      const isOnAuthScreen = currentPath.includes('auth');
      const isOnOnboardingFlow = currentPath.includes('onboarding') || currentPath.includes('profile-setup');
      const isOnMainApp = currentPath.includes('(tabs)');

      if (!user) {
        // No authenticated user
        if (!isOnAuthScreen) {
          router.replace("/auth" as any);
        }
      } else {
        // User is authenticated
        if (isOnAuthScreen) {
          // Authenticated user on auth screen, redirect based on onboarding status
          if (hasSeenOnboarding === false) {
            router.replace("/onboarding" as any);
          } else if (hasSeenOnboarding === true && hasCompletedProfileSetup === false) {
            router.replace("/profile-setup" as any);
          } else if (hasSeenOnboarding === true && hasCompletedProfileSetup === true) {
            router.replace("/(tabs)" as any);
          }
        } else if (!hasSeenOnboarding && !isOnOnboardingFlow) {
          // User authenticated but hasn't seen onboarding and not on onboarding flow
          router.replace("/onboarding" as any);
        } else if (hasSeenOnboarding && !hasCompletedProfileSetup && !currentPath.includes('profile-setup')) {
          // User has seen onboarding but hasn't completed profile setup
          router.replace("/profile-setup" as any);
        } else if (hasSeenOnboarding && hasCompletedProfileSetup && isOnOnboardingFlow) {
          // User fully onboarded but on onboarding flow, redirect to main app
          router.replace("/(tabs)" as any);
        }
      }
    }
  }, [user, authLoading, hasSeenOnboarding, hasCompletedProfileSetup, segments]);

  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await scheduleDailyNotifications();
      }
    };

    setupNotifications();
  }, []);

  if (authLoading) {
    return null;
  }

  // Don't render until we have checked onboarding status for authenticated users
  if (user && (hasSeenOnboarding === null || hasCompletedProfileSetup === null)) {
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
