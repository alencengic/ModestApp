import { getCurrentLocation, LocationCoords } from "./locationService";
import { insertWeatherData, getWeatherByDate } from "@/storage/weather_data";
import { DateTime } from "luxon";
import Constants from "expo-constants";

const WEATHER_API_KEY = Constants.expoConfig?.extra?.WEATHER_API_KEY || "a51474a85e4b86d8e1e879aa55a7c398";
const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1";

export interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
    };
    humidity: number;
    pressure_mb: number;
  };
}

export const fetchWeatherData = async (
  coords?: LocationCoords
): Promise<WeatherApiResponse | null> => {
  try {
    // Get location if not provided
    const location = coords || (await getCurrentLocation());

    if (!location) {
      console.log("No location available for weather fetch");
      return null;
    }

    const { latitude, longitude } = location;
    const url = `${WEATHER_API_BASE_URL}/current.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}`;

    console.log("Fetching weather from:", url.replace(WEATHER_API_KEY, "***"));

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Weather API error:", response.status, response.statusText);
      const errorBody = await response.text();
      console.error("Error details:", errorBody);
      return null;
    }

    const data: WeatherApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

export const fetchAndSaveWeatherData = async (): Promise<boolean> => {
  try {
    const weatherData = await fetchWeatherData();

    if (!weatherData) {
      return false;
    }

    const currentDate = DateTime.now().toISODate() as string;

    // Check if we already have weather data for today
    const existingWeather = await getWeatherByDate(currentDate);
    if (existingWeather) {
      console.log("Weather data already exists for today");
      return true;
    }

    // Save to database
    await insertWeatherData({
      date: currentDate,
      temperature: weatherData.current.temp_c,
      condition: weatherData.current.condition.text,
      humidity: weatherData.current.humidity,
      pressure: weatherData.current.pressure_mb,
      location_name: `${weatherData.location.name}, ${weatherData.location.country}`,
      fetched_at: DateTime.now().toISO(),
    });

    console.log("Weather data saved successfully");
    return true;
  } catch (error) {
    console.error("Error in fetchAndSaveWeatherData:", error);
    return false;
  }
};
