// components/WeatherDisplay.tsx

import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import axios from "axios";
import { weatherDisplayStyles } from "./WeatherDisplay.styles";

interface WeatherDisplayProps {
  location: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ location }) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const apiKey = "a51474a85e4b86d8e1e879aa55a7c398";
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
        );

        setWeatherData(response.data);
      } catch (error) {
        setError("Failed to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={weatherDisplayStyles.error}>{error}</Text>;
  }

  return (
    <View style={weatherDisplayStyles.container}>
      <Text style={weatherDisplayStyles.city}>{weatherData.name}</Text>
      <Text style={weatherDisplayStyles.temperature}>
        {weatherData.main.temp}°C
      </Text>
      <Text style={weatherDisplayStyles.description}>
        {weatherData.weather[0].description}
      </Text>
    </View>
  );
};

export default WeatherDisplay;
