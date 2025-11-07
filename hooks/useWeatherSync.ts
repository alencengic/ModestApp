import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { syncWeatherData } from "@/services/weatherSyncService";
import { useAuth } from "@/context/AuthContext";

export const useWeatherSync = () => {
  const appState = useRef(AppState.currentState);
  const { user } = useAuth();

  useEffect(() => {
    // Only sync weather if user is authenticated
    if (!user) return;
    
    syncWeatherData();

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active" &&
          user // Check user is still authenticated
        ) {
          syncWeatherData();
        }

        appState.current = nextAppState;
      }
    );

    const interval = setInterval(() => {
      if (AppState.currentState === "active" && user) {
        syncWeatherData();
      }
    }, 6 * 60 * 60 * 1000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [user]);
};
