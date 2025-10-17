import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { syncWeatherData } from "@/services/weatherSyncService";

export const useWeatherSync = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Sync weather data when app loads
    syncWeatherData();

    // Set up app state listener to sync when app comes to foreground
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          // App has come to the foreground, sync weather
          syncWeatherData();
        }

        appState.current = nextAppState;
      }
    );

    // Set up interval to sync every 6 hours while app is active
    const interval = setInterval(() => {
      if (AppState.currentState === "active") {
        syncWeatherData();
      }
    }, 6 * 60 * 60 * 1000); // 6 hours in milliseconds

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);
};
