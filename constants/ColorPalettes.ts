import { scale, scaleFontSize } from "@/utils/responsive";

export type ThemeMode = "light" | "dark" | "auto";
export type ColorPaletteName = "bright" | "ocean" | "forest" | "sunset" | "lavender";

export interface ColorPalette {
  name: string;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;

    secondary: string;
    secondaryLight: string;
    secondaryDark: string;

    accent: string;
    accentLight: string;
    success: string;
    info: string;
    warning: string;
    error: string;

    background: string;
    surface: string;
    surfaceLight: string;

    cardBackground: string;
    cardShadow: string;

    textPrimary: string;
    textSecondary: string;
    textLight: string;
    textOnPrimary: string;

    border: string;
    divider: string;

    moodColors: {
      ecstatic: string;
      veryHappy: string;
      happy: string;
      neutral: string;
      sad: string;
    };

    chartColors: string[];

    cardColors: {
      dailyEntry: string;
      dailyJournal: string;
      trends: string;
      moodAnalytics: string;
      foodAnalytics: string;
      weatherMood: string;
    };
  };

  gradients: {
    primary: readonly [string, string];
    secondary: readonly [string, string];
    background: readonly [string, string];
    mood: readonly [string, string];
  };
}

// Bright Theme (Original - Light)
export const BrightLightPalette: ColorPalette = {
  name: "Bright",
  colors: {
    primary: "#C88B6B",
    primaryLight: "#E8B4A0",
    primaryDark: "#A67152",

    secondary: "#F5DCC8",
    secondaryLight: "#F5E6D3",
    secondaryDark: "#E8C4B0",

    accent: "#D4CBBB",
    accentLight: "#E5DED1",
    success: "#A8B896",
    info: "#B0A89C",
    warning: "#E8B4A0",
    error: "#C88B6B",

    background: "#F5E6D3",
    surface: "#FFFFFF",
    surfaceLight: "#F5E6D3",

    cardBackground: "#FFFFFF",
    cardShadow: "rgba(200, 139, 107, 0.1)",

    textPrimary: "#2C2C2C",
    textSecondary: "#666666",
    textLight: "#999999",
    textOnPrimary: "#FFFFFF",

    border: "#E5DED1",
    divider: "#F5E6D3",

    moodColors: {
      ecstatic: "#F5DCC8",
      veryHappy: "#E8B4A0",
      happy: "#F5E6D3",
      neutral: "#D4CBBB",
      sad: "#B0A89C",
    },

    chartColors: [
      "#C88B6B",
      "#E8B4A0",
      "#F5DCC8",
      "#D4CBBB",
      "#A8B896",
      "#E8C4B0",
      "#C8B4A0",
      "#B0A89C",
      "#F5E6D3",
      "#A67152",
    ],

    cardColors: {
      dailyEntry: "#F5DCC8",
      dailyJournal: "#E8C4B0",
      trends: "#E8B4A0",
      moodAnalytics: "#F5E6D3",
      foodAnalytics: "#D4CBBB",
      weatherMood: "#C8B4A0",
    },
  },

  gradients: {
    primary: ["#E8B4A0", "#C88B6B"] as const,
    secondary: ["#F5E6D3", "#F5DCC8"] as const,
    background: ["#F5E6D3", "#F5E6D3"] as const,
    mood: ["#F5E6D3", "#F5DCC8"] as const,
  },
};

// Bright Theme - Dark Variant
export const BrightDarkPalette: ColorPalette = {
  name: "Bright",
  colors: {
    primary: "#F5C3A9",
    primaryLight: "#F5DCC8",
    primaryDark: "#E8B4A0",

    secondary: "#4A3F35",
    secondaryLight: "#5C5047",
    secondaryDark: "#3A302A",

    accent: "#8A7A6B",
    accentLight: "#A89E8F",
    success: "#A8B896",
    info: "#B0A89C",
    warning: "#F5C3A9",
    error: "#FF8A6B",

    background: "#1A1512",
    surface: "#2A2219",
    surfaceLight: "#3A302A",

    cardBackground: "#2A2219",
    cardShadow: "rgba(0, 0, 0, 0.3)",

    textPrimary: "#F5E6D3",
    textSecondary: "#D4C5B3",
    textLight: "#B0A89C",
    textOnPrimary: "#1A1512",

    border: "#5C5047",
    divider: "#3A302A",

    moodColors: {
      ecstatic: "#F5DCC8",
      veryHappy: "#E8B4A0",
      happy: "#D4CBBB",
      neutral: "#9B8E7F",
      sad: "#6B5D50",
    },

    chartColors: [
      "#E8B4A0",
      "#F5DCC8",
      "#D4CBBB",
      "#C88B6B",
      "#A8B896",
      "#B0A89C",
      "#9B8E7F",
      "#8A7A6B",
      "#6B5D50",
      "#A67152",
    ],

    cardColors: {
      dailyEntry: "#4A3F35",
      dailyJournal: "#5C5047",
      trends: "#6B5D50",
      moodAnalytics: "#3A302A",
      foodAnalytics: "#4A3F35",
      weatherMood: "#5C5047",
    },
  },

  gradients: {
    primary: ["#C88B6B", "#E8B4A0"] as const,
    secondary: ["#3A302A", "#4A3F35"] as const,
    background: ["#1A1512", "#2A2219"] as const,
    mood: ["#4A3F35", "#6B5D50"] as const,
  },
};

// Ocean Theme - Light
export const OceanLightPalette: ColorPalette = {
  name: "Ocean",
  colors: {
    primary: "#4A90A4",
    primaryLight: "#7BB3C0",
    primaryDark: "#2C6B7C",

    secondary: "#A8D5E2",
    secondaryLight: "#C8E8F0",
    secondaryDark: "#87BBCC",

    accent: "#70A9B8",
    accentLight: "#96C7D3",
    success: "#6CBF84",
    info: "#5A9FB0",
    warning: "#F5B461",
    error: "#E57373",

    background: "#E8F4F8",
    surface: "#FFFFFF",
    surfaceLight: "#F0F8FB",

    cardBackground: "#FFFFFF",
    cardShadow: "rgba(74, 144, 164, 0.1)",

    textPrimary: "#1A3A4A",
    textSecondary: "#546E7A",
    textLight: "#90A4AE",
    textOnPrimary: "#FFFFFF",

    border: "#B0BEC5",
    divider: "#CFD8DC",

    moodColors: {
      ecstatic: "#7BB3C0",
      veryHappy: "#A8D5E2",
      happy: "#C8E8F0",
      neutral: "#B0BEC5",
      sad: "#78909C",
    },

    chartColors: [
      "#4A90A4",
      "#7BB3C0",
      "#A8D5E2",
      "#70A9B8",
      "#6CBF84",
      "#5A9FB0",
      "#96C7D3",
      "#87BBCC",
      "#C8E8F0",
      "#2C6B7C",
    ],

    cardColors: {
      dailyEntry: "#A8D5E2",
      dailyJournal: "#96C7D3",
      trends: "#7BB3C0",
      moodAnalytics: "#C8E8F0",
      foodAnalytics: "#87BBCC",
      weatherMood: "#70A9B8",
    },
  },

  gradients: {
    primary: ["#7BB3C0", "#4A90A4"] as const,
    secondary: ["#C8E8F0", "#A8D5E2"] as const,
    background: ["#E8F4F8", "#F0F8FB"] as const,
    mood: ["#C8E8F0", "#A8D5E2"] as const,
  },
};

// Ocean Theme - Dark
export const OceanDarkPalette: ColorPalette = {
  name: "Ocean",
  colors: {
    primary: "#A8D5E2",
    primaryLight: "#C8E8F0",
    primaryDark: "#7BB3C0",

    secondary: "#1E3A47",
    secondaryLight: "#2C4F5E",
    secondaryDark: "#152833",

    accent: "#6A9CAC",
    accentLight: "#8BBAC7",
    success: "#8BDEA0",
    info: "#7BB3C0",
    warning: "#FFD084",
    error: "#FF8989",

    background: "#0A1A22",
    surface: "#152833",
    surfaceLight: "#1E3A47",

    cardBackground: "#152833",
    cardShadow: "rgba(0, 0, 0, 0.3)",

    textPrimary: "#E8F4F8",
    textSecondary: "#C8E8F0",
    textLight: "#8BBAC7",
    textOnPrimary: "#0A1A22",

    border: "#3A5F6E",
    divider: "#1E3A47",

    moodColors: {
      ecstatic: "#A8D5E2",
      veryHappy: "#7BB3C0",
      happy: "#5A9FB0",
      neutral: "#4A7C8C",
      sad: "#2C4F5E",
    },

    chartColors: [
      "#7BB3C0",
      "#A8D5E2",
      "#5A9FB0",
      "#4A90A4",
      "#6CBF84",
      "#6A9CAC",
      "#4A7C8C",
      "#87BBCC",
      "#2C4F5E",
      "#2C6B7C",
    ],

    cardColors: {
      dailyEntry: "#1E3A47",
      dailyJournal: "#2C4F5E",
      trends: "#4A7C8C",
      moodAnalytics: "#152833",
      foodAnalytics: "#1E3A47",
      weatherMood: "#2C4F5E",
    },
  },

  gradients: {
    primary: ["#4A90A4", "#7BB3C0"] as const,
    secondary: ["#152833", "#1E3A47"] as const,
    background: ["#0A1A22", "#152833"] as const,
    mood: ["#1E3A47", "#2C4F5E"] as const,
  },
};

// Forest Theme - Light
export const ForestLightPalette: ColorPalette = {
  name: "Forest",
  colors: {
    primary: "#6B8E6F",
    primaryLight: "#98BF9B",
    primaryDark: "#4A6B4E",

    secondary: "#A8C5A8",
    secondaryLight: "#C5DFC5",
    secondaryDark: "#8BAF8B",

    accent: "#7FA884",
    accentLight: "#A8C5A8",
    success: "#76B583",
    info: "#6B8E7A",
    warning: "#D4A574",
    error: "#C86B6B",

    background: "#EFF5EF",
    surface: "#FFFFFF",
    surfaceLight: "#F5F9F5",

    cardBackground: "#FFFFFF",
    cardShadow: "rgba(107, 142, 111, 0.1)",

    textPrimary: "#2A3E2A",
    textSecondary: "#556B55",
    textLight: "#8A9A8A",
    textOnPrimary: "#FFFFFF",

    border: "#C5DFC5",
    divider: "#D8E8D8",

    moodColors: {
      ecstatic: "#98BF9B",
      veryHappy: "#A8C5A8",
      happy: "#C5DFC5",
      neutral: "#8BAF8B",
      sad: "#6B8E7A",
    },

    chartColors: [
      "#6B8E6F",
      "#98BF9B",
      "#A8C5A8",
      "#7FA884",
      "#76B583",
      "#8BAF8B",
      "#A8C5A8",
      "#6B8E7A",
      "#C5DFC5",
      "#4A6B4E",
    ],

    cardColors: {
      dailyEntry: "#A8C5A8",
      dailyJournal: "#98BF9B",
      trends: "#7FA884",
      moodAnalytics: "#C5DFC5",
      foodAnalytics: "#8BAF8B",
      weatherMood: "#76B583",
    },
  },

  gradients: {
    primary: ["#98BF9B", "#6B8E6F"] as const,
    secondary: ["#C5DFC5", "#A8C5A8"] as const,
    background: ["#EFF5EF", "#F5F9F5"] as const,
    mood: ["#C5DFC5", "#A8C5A8"] as const,
  },
};

// Forest Theme - Dark
export const ForestDarkPalette: ColorPalette = {
  name: "Forest",
  colors: {
    primary: "#B5D9B8",
    primaryLight: "#C5DFC5",
    primaryDark: "#98BF9B",

    secondary: "#2A3E2A",
    secondaryLight: "#3E5538",
    secondaryDark: "#1C2B1C",

    accent: "#7FA884",
    accentLight: "#9DC2A0",
    success: "#8DD49A",
    info: "#8AB08F",
    warning: "#F0C090",
    error: "#E88B8B",

    background: "#151C15",
    surface: "#1C2B1C",
    surfaceLight: "#2A3E2A",

    cardBackground: "#1C2B1C",
    cardShadow: "rgba(0, 0, 0, 0.3)",

    textPrimary: "#EFF5EF",
    textSecondary: "#C5DFC5",
    textLight: "#9DC2A0",
    textOnPrimary: "#151C15",

    border: "#4A6348",
    divider: "#2A3E2A",

    moodColors: {
      ecstatic: "#C5DFC5",
      veryHappy: "#98BF9B",
      happy: "#7FA884",
      neutral: "#556B55",
      sad: "#3E5538",
    },

    chartColors: [
      "#98BF9B",
      "#C5DFC5",
      "#7FA884",
      "#6B8E6F",
      "#76B583",
      "#A8C5A8",
      "#556B55",
      "#8BAF8B",
      "#3E5538",
      "#4A6B4E",
    ],

    cardColors: {
      dailyEntry: "#2A3E2A",
      dailyJournal: "#3E5538",
      trends: "#556B55",
      moodAnalytics: "#1C2B1C",
      foodAnalytics: "#2A3E2A",
      weatherMood: "#3E5538",
    },
  },

  gradients: {
    primary: ["#6B8E6F", "#98BF9B"] as const,
    secondary: ["#1C2B1C", "#2A3E2A"] as const,
    background: ["#151C15", "#1C2B1C"] as const,
    mood: ["#2A3E2A", "#3E5538"] as const,
  },
};

// Sunset Theme - Light
export const SunsetLightPalette: ColorPalette = {
  name: "Sunset",
  colors: {
    primary: "#E67A5F",
    primaryLight: "#F5A389",
    primaryDark: "#C85F4A",

    secondary: "#F5C3A9",
    secondaryLight: "#FCDFC8",
    secondaryDark: "#E8A88A",

    accent: "#F5A070",
    accentLight: "#F5C3A9",
    success: "#8BC896",
    info: "#C89B7A",
    warning: "#F5D461",
    error: "#E55F5F",

    background: "#FFF5F0",
    surface: "#FFFFFF",
    surfaceLight: "#FFF8F5",

    cardBackground: "#FFFFFF",
    cardShadow: "rgba(230, 122, 95, 0.1)",

    textPrimary: "#3A2A25",
    textSecondary: "#6B5550",
    textLight: "#9A8075",
    textOnPrimary: "#FFFFFF",

    border: "#F5C3A9",
    divider: "#FCDFC8",

    moodColors: {
      ecstatic: "#F5A389",
      veryHappy: "#F5C3A9",
      happy: "#FCDFC8",
      neutral: "#E8A88A",
      sad: "#C89B7A",
    },

    chartColors: [
      "#E67A5F",
      "#F5A389",
      "#F5C3A9",
      "#F5A070",
      "#8BC896",
      "#E8A88A",
      "#F5C3A9",
      "#C89B7A",
      "#FCDFC8",
      "#C85F4A",
    ],

    cardColors: {
      dailyEntry: "#F5C3A9",
      dailyJournal: "#F5A389",
      trends: "#F5A070",
      moodAnalytics: "#FCDFC8",
      foodAnalytics: "#E8A88A",
      weatherMood: "#C89B7A",
    },
  },

  gradients: {
    primary: ["#F5A389", "#E67A5F"] as const,
    secondary: ["#FCDFC8", "#F5C3A9"] as const,
    background: ["#FFF5F0", "#FFF8F5"] as const,
    mood: ["#FCDFC8", "#F5C3A9"] as const,
  },
};

// Sunset Theme - Dark
export const SunsetDarkPalette: ColorPalette = {
  name: "Sunset",
  colors: {
    primary: "#FFB8A0",
    primaryLight: "#F5C3A9",
    primaryDark: "#F5A389",

    secondary: "#3A2A25",
    secondaryLight: "#4F3C35",
    secondaryDark: "#2A1F1A",

    accent: "#B08070",
    accentLight: "#D0A090",
    success: "#A0DBAD",
    info: "#E8B89A",
    warning: "#FFE48B",
    error: "#FF8B8B",

    background: "#1A120F",
    surface: "#2A1F1A",
    surfaceLight: "#3A2A25",

    cardBackground: "#2A1F1A",
    cardShadow: "rgba(0, 0, 0, 0.3)",

    textPrimary: "#FFF5F0",
    textSecondary: "#FFDCC8",
    textLight: "#D0A090",
    textOnPrimary: "#1A120F",

    border: "#6A4F45",
    divider: "#3A2A25",

    moodColors: {
      ecstatic: "#F5C3A9",
      veryHappy: "#F5A389",
      happy: "#C89B7A",
      neutral: "#8B5F4A",
      sad: "#4F3C35",
    },

    chartColors: [
      "#F5A389",
      "#F5C3A9",
      "#C89B7A",
      "#E67A5F",
      "#8BC896",
      "#B08070",
      "#8B5F4A",
      "#E8A88A",
      "#4F3C35",
      "#C85F4A",
    ],

    cardColors: {
      dailyEntry: "#3A2A25",
      dailyJournal: "#4F3C35",
      trends: "#8B5F4A",
      moodAnalytics: "#2A1F1A",
      foodAnalytics: "#3A2A25",
      weatherMood: "#4F3C35",
    },
  },

  gradients: {
    primary: ["#E67A5F", "#F5A389"] as const,
    secondary: ["#2A1F1A", "#3A2A25"] as const,
    background: ["#1A120F", "#2A1F1A"] as const,
    mood: ["#3A2A25", "#4F3C35"] as const,
  },
};

// Lavender Theme - Light
export const LavenderLightPalette: ColorPalette = {
  name: "Lavender",
  colors: {
    primary: "#9B7EBD",
    primaryLight: "#C5B3D9",
    primaryDark: "#7B5FA0",

    secondary: "#D4C5E8",
    secondaryLight: "#E8DFF5",
    secondaryDark: "#BDA8D4",

    accent: "#B095CD",
    accentLight: "#D4C5E8",
    success: "#8BC896",
    info: "#9B8EC5",
    warning: "#E8C461",
    error: "#D47BA0",

    background: "#F5F0FA",
    surface: "#FFFFFF",
    surfaceLight: "#F9F5FC",

    cardBackground: "#FFFFFF",
    cardShadow: "rgba(155, 126, 189, 0.1)",

    textPrimary: "#2A1F3A",
    textSecondary: "#5A4D6B",
    textLight: "#8A7A9A",
    textOnPrimary: "#FFFFFF",

    border: "#D4C5E8",
    divider: "#E8DFF5",

    moodColors: {
      ecstatic: "#C5B3D9",
      veryHappy: "#D4C5E8",
      happy: "#E8DFF5",
      neutral: "#BDA8D4",
      sad: "#9B8EC5",
    },

    chartColors: [
      "#9B7EBD",
      "#C5B3D9",
      "#D4C5E8",
      "#B095CD",
      "#8BC896",
      "#BDA8D4",
      "#D4C5E8",
      "#9B8EC5",
      "#E8DFF5",
      "#7B5FA0",
    ],

    cardColors: {
      dailyEntry: "#D4C5E8",
      dailyJournal: "#C5B3D9",
      trends: "#B095CD",
      moodAnalytics: "#E8DFF5",
      foodAnalytics: "#BDA8D4",
      weatherMood: "#9B8EC5",
    },
  },

  gradients: {
    primary: ["#C5B3D9", "#9B7EBD"] as const,
    secondary: ["#E8DFF5", "#D4C5E8"] as const,
    background: ["#F5F0FA", "#F9F5FC"] as const,
    mood: ["#E8DFF5", "#D4C5E8"] as const,
  },
};

// Lavender Theme - Dark
export const LavenderDarkPalette: ColorPalette = {
  name: "Lavender",
  colors: {
    primary: "#D9C8ED",
    primaryLight: "#E8DFF5",
    primaryDark: "#C5B3D9",

    secondary: "#2A1F3A",
    secondaryLight: "#3F334F",
    secondaryDark: "#1F152A",

    accent: "#7B6A8B",
    accentLight: "#9B8AAB",
    success: "#A0DBAD",
    info: "#B8A8D5",
    warning: "#FFD88B",
    error: "#F098C0",

    background: "#151020",
    surface: "#1F152A",
    surfaceLight: "#2A1F3A",

    cardBackground: "#1F152A",
    cardShadow: "rgba(0, 0, 0, 0.3)",

    textPrimary: "#F5F0FA",
    textSecondary: "#E8DFF5",
    textLight: "#B8A8D5",
    textOnPrimary: "#151020",

    border: "#54476B",
    divider: "#2A1F3A",

    moodColors: {
      ecstatic: "#E8DFF5",
      veryHappy: "#C5B3D9",
      happy: "#9B8EC5",
      neutral: "#7B6A8B",
      sad: "#3F334F",
    },

    chartColors: [
      "#C5B3D9",
      "#E8DFF5",
      "#9B8EC5",
      "#9B7EBD",
      "#8BC896",
      "#B095CD",
      "#7B6A8B",
      "#BDA8D4",
      "#3F334F",
      "#7B5FA0",
    ],

    cardColors: {
      dailyEntry: "#2A1F3A",
      dailyJournal: "#3F334F",
      trends: "#5A4D6B",
      moodAnalytics: "#1F152A",
      foodAnalytics: "#2A1F3A",
      weatherMood: "#3F334F",
    },
  },

  gradients: {
    primary: ["#9B7EBD", "#C5B3D9"] as const,
    secondary: ["#1F152A", "#2A1F3A"] as const,
    background: ["#151020", "#1F152A"] as const,
    mood: ["#2A1F3A", "#3F334F"] as const,
  },
};

// Map of all palettes
export const COLOR_PALETTES: Record<ColorPaletteName, { light: ColorPalette; dark: ColorPalette }> = {
  bright: { light: BrightLightPalette, dark: BrightDarkPalette },
  ocean: { light: OceanLightPalette, dark: OceanDarkPalette },
  forest: { light: ForestLightPalette, dark: ForestDarkPalette },
  sunset: { light: SunsetLightPalette, dark: SunsetDarkPalette },
  lavender: { light: LavenderLightPalette, dark: LavenderDarkPalette },
};

// Common theme properties (shared across all themes)
export const CommonTheme = {
  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
    xxl: scale(48),
  },

  borderRadius: {
    sm: scale(8),
    md: scale(12),
    lg: scale(16),
    xl: scale(24),
    round: 999,
  },

  shadows: {
    sm: {
      shadowOffset: { width: 0, height: scale(2) },
      shadowOpacity: 0.08,
      shadowRadius: scale(4),
      elevation: 2,
    },
    md: {
      shadowOffset: { width: 0, height: scale(4) },
      shadowOpacity: 0.1,
      shadowRadius: scale(8),
      elevation: 4,
    },
    lg: {
      shadowOffset: { width: 0, height: scale(6) },
      shadowOpacity: 0.12,
      shadowRadius: scale(12),
      elevation: 6,
    },
  },

  typography: {
    h1: {
      fontSize: scaleFontSize(32),
      fontWeight: "700" as const,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: scaleFontSize(24),
      fontWeight: "700" as const,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: scaleFontSize(20),
      fontWeight: "600" as const,
      letterSpacing: -0.2,
    },
    body: {
      fontSize: scaleFontSize(16),
      fontWeight: "400" as const,
      lineHeight: scaleFontSize(24),
    },
    caption: {
      fontSize: scaleFontSize(14),
      fontWeight: "400" as const,
      lineHeight: scaleFontSize(20),
    },
  },
};

export type Theme = ColorPalette & typeof CommonTheme;
