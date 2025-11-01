import { scale, scaleFontSize, verticalScale } from "@/utils/responsive";

export const BrightTheme = {
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
      shadowColor: "#C88B6B",
      shadowOffset: { width: 0, height: scale(2) },
      shadowOpacity: 0.08,
      shadowRadius: scale(4),
      elevation: 2,
    },
    md: {
      shadowColor: "#C88B6B",
      shadowOffset: { width: 0, height: scale(4) },
      shadowOpacity: 0.1,
      shadowRadius: scale(8),
      elevation: 4,
    },
    lg: {
      shadowColor: "#C88B6B",
      shadowOffset: { width: 0, height: scale(6) },
      shadowOpacity: 0.12,
      shadowRadius: scale(12),
      elevation: 6,
    },
  },

  typography: {
    fontFamily: {
      regular: "Inter_400Regular",
      medium: "Inter_500Medium",
      semiBold: "Inter_600SemiBold",
      bold: "Inter_700Bold",
    },
    h1: {
      fontSize: scaleFontSize(32),
      fontWeight: "700" as const,
      fontFamily: "Inter_700Bold",
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: scaleFontSize(24),
      fontWeight: "700" as const,
      fontFamily: "Inter_700Bold",
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: scaleFontSize(20),
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
      letterSpacing: -0.2,
    },
    body: {
      fontSize: scaleFontSize(16),
      fontWeight: "400" as const,
      fontFamily: "Inter_400Regular",
      lineHeight: scaleFontSize(24),
    },
    caption: {
      fontSize: scaleFontSize(14),
      fontWeight: "400" as const,
      fontFamily: "Inter_400Regular",
      lineHeight: scaleFontSize(20),
    },
  },
};

export const AdSizes = {
  banner: {
    width: 320,
    height: 50,
  },
  largeBanner: {
    width: 320,
    height: 100,
  },
  mediumRectangle: {
    width: 300,
    height: 250,
  },
  fullBanner: {
    width: 468,
    height: 60,
  },
  leaderboard: {
    width: 728,
    height: 90,
  },
};
