import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { syncWeatherData } from "@/services/weatherSyncService";

export const useWeatherSync = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    syncWeatherData();

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          syncWeatherData();
        }

        appState.current = nextAppState;
      }
    );

    const interval = setInterval(() => {
      if (AppState.currentState === "active") {
        syncWeatherData();
      }
    }, 6 * 60 * 60 * 1000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);
};
