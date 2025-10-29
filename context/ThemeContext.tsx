import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import {
  ThemeMode,
  ColorPaletteName,
  COLOR_PALETTES,
  CommonTheme,
  Theme,
} from "@/constants/ColorPalettes";
import {
  loadThemePreferences,
  saveThemeMode as saveThemeModeToStorage,
  saveColorPalette as saveColorPaletteToStorage,
  DEFAULT_THEME_PREFERENCES,
} from "@/storage/themeStorage";

interface ThemeContextType {
  // Current theme
  theme: Theme;

  // Theme mode (light/dark/auto)
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;

  // Color palette
  colorPalette: ColorPaletteName;
  setColorPalette: (palette: ColorPaletteName) => Promise<void>;

  // Computed values
  isDark: boolean;

  // Loading state
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(DEFAULT_THEME_PREFERENCES.mode);
  const [colorPalette, setColorPaletteState] = useState<ColorPaletteName>(DEFAULT_THEME_PREFERENCES.palette);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preferences on mount
  useEffect(() => {
    loadThemePreferences()
      .then((preferences) => {
        setThemeModeState(preferences.mode);
        setColorPaletteState(preferences.palette);
      })
      .catch((error) => {
        console.error("Failed to load theme preferences:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Determine if dark mode is active
  const isDark = useMemo(() => {
    if (themeMode === "auto") {
      return systemColorScheme === "dark";
    }
    return themeMode === "dark";
  }, [themeMode, systemColorScheme]);

  // Get current theme
  const theme = useMemo((): Theme => {
    const palette = COLOR_PALETTES[colorPalette];
    const selectedPalette = isDark ? palette.dark : palette.light;

    return {
      ...selectedPalette,
      ...CommonTheme,
      shadows: {
        sm: {
          ...CommonTheme.shadows.sm,
          shadowColor: selectedPalette.colors.primary,
        },
        md: {
          ...CommonTheme.shadows.md,
          shadowColor: selectedPalette.colors.primary,
        },
        lg: {
          ...CommonTheme.shadows.lg,
          shadowColor: selectedPalette.colors.primary,
        },
      },
    };
  }, [colorPalette, isDark]);

  // Set theme mode and save to storage
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await saveThemeModeToStorage(mode);
    } catch (error) {
      console.error("Failed to save theme mode:", error);
      // Revert on error
      loadThemePreferences().then((preferences) => {
        setThemeModeState(preferences.mode);
      });
      throw error;
    }
  }, []);

  // Set color palette and save to storage
  const setColorPalette = useCallback(async (palette: ColorPaletteName) => {
    try {
      setColorPaletteState(palette);
      await saveColorPaletteToStorage(palette);
    } catch (error) {
      console.error("Failed to save color palette:", error);
      // Revert on error
      loadThemePreferences().then((preferences) => {
        setColorPaletteState(preferences.palette);
      });
      throw error;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      themeMode,
      setThemeMode,
      colorPalette,
      setColorPalette,
      isDark,
      isLoading,
    }),
    [theme, themeMode, setThemeMode, colorPalette, setColorPalette, isDark, isLoading]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Helper hook to get theme colors
export function useThemeColors() {
  const { theme } = useTheme();
  return theme.colors;
}

// Helper hook to get theme gradients
export function useThemeGradients() {
  const { theme } = useTheme();
  return theme.gradients;
}

// Helper hook to get theme spacing
export function useThemeSpacing() {
  const { theme } = useTheme();
  return theme.spacing;
}

// Helper hook to get theme typography
export function useThemeTypography() {
  const { theme } = useTheme();
  return theme.typography;
}
