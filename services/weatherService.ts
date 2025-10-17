import { getCurrentLocation, LocationCoords } from "./locationService";
import { insertWeatherData, getWeatherByDate } from "@/storage/weather_data";
import { DateTime } from "luxon";
import Constants from "expo-constants";

const WEATHER_API_KEY = Constants.expoConfig?.extra?.WEATHER_API_KEY || "a51474a85e4b86d8e1e879aa55a7c398";
const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherApiResponse {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
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
    const url = `${WEATHER_API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;

    console.log("Fetching weather from OpenWeatherMap:", url.replace(WEATHER_API_KEY, "***"));

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Weather API error:", response.status, response.statusText);
      const errorBody = await response.text();
      console.error("Error details:", errorBody);
      return null;
    }

    const data: WeatherApiResponse = await response.json();
    console.log("Weather data received:", data);
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

    // Save to database (OpenWeatherMap format)
    await insertWeatherData({
      date: currentDate,
      temperature: weatherData.main.temp,
      condition: weatherData.weather[0]?.description || "Unknown",
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      location_name: `${weatherData.name}, ${weatherData.sys.country}`,
      fetched_at: DateTime.now().toISO(),
    });

    console.log("Weather data saved successfully");
    return true;
  } catch (error) {
    console.error("Error in fetchAndSaveWeatherData:", error);
    return false;
  }
};
