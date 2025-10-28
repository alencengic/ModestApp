import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeMode, ColorPaletteName } from "@/constants/ColorPalettes";

const THEME_MODE_KEY = "@modest_app:theme_mode";
const COLOR_PALETTE_KEY = "@modest_app:color_palette";

export interface ThemePreferences {
  mode: ThemeMode;
  palette: ColorPaletteName;
}

export const DEFAULT_THEME_PREFERENCES: ThemePreferences = {
  mode: "auto",
  palette: "bright",
};

/**
 * Load theme preferences from storage
 */
export async function loadThemePreferences(): Promise<ThemePreferences> {
  try {
    const [modeStr, paletteStr] = await Promise.all([
      AsyncStorage.getItem(THEME_MODE_KEY),
      AsyncStorage.getItem(COLOR_PALETTE_KEY),
    ]);

    const mode = (modeStr as ThemeMode) || DEFAULT_THEME_PREFERENCES.mode;
    const palette = (paletteStr as ColorPaletteName) || DEFAULT_THEME_PREFERENCES.palette;

    return { mode, palette };
  } catch (error) {
    console.error("Error loading theme preferences:", error);
    return DEFAULT_THEME_PREFERENCES;
  }
}

/**
 * Save theme mode to storage
 */
export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_MODE_KEY, mode);
  } catch (error) {
    console.error("Error saving theme mode:", error);
    throw error;
  }
}

/**
 * Save color palette to storage
 */
export async function saveColorPalette(palette: ColorPaletteName): Promise<void> {
  try {
    await AsyncStorage.setItem(COLOR_PALETTE_KEY, palette);
  } catch (error) {
    console.error("Error saving color palette:", error);
    throw error;
  }
}

/**
 * Save complete theme preferences to storage
 */
export async function saveThemePreferences(preferences: ThemePreferences): Promise<void> {
  try {
    await Promise.all([
      saveThemeMode(preferences.mode),
      saveColorPalette(preferences.palette),
    ]);
  } catch (error) {
    console.error("Error saving theme preferences:", error);
    throw error;
  }
}

/**
 * Clear all theme preferences (reset to defaults)
 */
export async function clearThemePreferences(): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem(THEME_MODE_KEY),
      AsyncStorage.removeItem(COLOR_PALETTE_KEY),
    ]);
  } catch (error) {
    console.error("Error clearing theme preferences:", error);
    throw error;
  }
}
