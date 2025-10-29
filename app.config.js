import "dotenv/config";

export default {
  expo: {
    name: "ModestApp",
    slug: "ModestApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.modestapp.modest",
      buildNumber: "1.0.0",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "We need your location to provide weather-based mood insights.",
        NSLocationAlwaysUsageDescription: "We need your location to provide weather-based mood insights.",
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.modestapp.modest",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-sqlite",
      "expo-font",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location to track weather data for mood correlation.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      WEATHER_API_KEY: process.env.WEATHER_API_KEY,
      eas: {
        projectId: "a348872e-eee0-4c7b-838f-a16a904e73d5",
      },
    },
  },
};
