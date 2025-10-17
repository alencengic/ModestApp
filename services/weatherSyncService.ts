import { fetchAndSaveWeatherData } from "./weatherService";
import { getWeatherByDate } from "@/storage/weather_data";
import { DateTime } from "luxon";

// Check if weather data needs to be synced
export const shouldSyncWeather = async (): Promise<boolean> => {
  try {
    const currentDate = DateTime.now().toISODate() as string;
    const existingWeather = await getWeatherByDate(currentDate);

    // Sync if no data exists for today
    if (!existingWeather) {
      return true;
    }

    // Sync if data is older than 6 hours
    const fetchedAt = DateTime.fromISO(existingWeather.fetched_at);
    const hoursSinceFetch = DateTime.now().diff(fetchedAt, "hours").hours;

    return hoursSinceFetch >= 6;
  } catch (error) {
    console.error("Error checking weather sync status:", error);
    return false;
  }
};

// Sync weather data if needed
export const syncWeatherData = async (): Promise<boolean> => {
  try {
    const needsSync = await shouldSyncWeather();

    if (!needsSync) {
      console.log("Weather data is up to date");
      return true;
    }

    console.log("Syncing weather data...");
    const success = await fetchAndSaveWeatherData();

    if (success) {
      console.log("Weather sync completed successfully");
    } else {
      console.log("Weather sync failed");
    }

    return success;
  } catch (error) {
    console.error("Error in syncWeatherData:", error);
    return false;
  }
};
