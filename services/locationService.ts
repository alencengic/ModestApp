import * as Location from "expo-location";

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export const getCurrentLocation = async (): Promise<LocationCoords | null> => {
  try {
    // Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("Location permission denied");
      return null;
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
};

export const checkLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === "granted";
};
