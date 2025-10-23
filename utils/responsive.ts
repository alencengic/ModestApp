import { Dimensions, PixelRatio } from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 11/XR as reference: 414 x 896)
const BASE_WIDTH = 414;
const BASE_HEIGHT = 896;

/**
 * Scales a value based on screen width
 * @param size - The size to scale
 * @returns Scaled size
 */
export const scaleWidth = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Scales a value based on screen height
 * @param size - The size to scale
 * @returns Scaled size
 */
export const scaleHeight = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Scales font size based on screen width with moderation
 * @param size - The font size to scale
 * @param factor - Scaling factor (default: 0.5 for moderate scaling)
 * @returns Scaled font size
 */
export const scaleFontSize = (size: number, factor: number = 0.5): number => {
  const newSize = size + (scaleWidth(size) - size) * factor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Moderately scales a value (useful for spacing, padding, margins)
 * Uses average of width and height scaling for balanced results
 * @param size - The size to scale
 * @returns Moderately scaled size
 */
export const scale = (size: number): number => {
  const widthScale = SCREEN_WIDTH / BASE_WIDTH;
  const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;
  const scale = Math.min(widthScale, heightScale);
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

/**
 * Vertical scale - primarily for heights, margins, padding
 * @param size - The size to scale
 * @returns Vertically scaled size
 */
export const verticalScale = (size: number): number => {
  return Math.round(PixelRatio.roundToNearestPixel(scaleHeight(size)));
};

/**
 * Horizontal scale - primarily for widths, margins, padding
 * @param size - The size to scale
 * @returns Horizontally scaled size
 */
export const horizontalScale = (size: number): number => {
  return Math.round(PixelRatio.roundToNearestPixel(scaleWidth(size)));
};

/**
 * Returns true if device is a small screen (iPhone SE, iPhone 8, etc.)
 */
export const isSmallDevice = (): boolean => {
  return SCREEN_WIDTH < 375;
};

/**
 * Returns true if device is a large screen (iPhone Pro Max, etc.)
 */
export const isLargeDevice = (): boolean => {
  return SCREEN_WIDTH >= 428;
};

/**
 * Returns true if device is a medium screen (standard iPhone size)
 */
export const isMediumDevice = (): boolean => {
  return !isSmallDevice() && !isLargeDevice();
};

/**
 * Returns responsive value based on device size
 * @param small - Value for small devices
 * @param medium - Value for medium devices
 * @param large - Value for large devices
 */
export const responsiveSize = <T>(small: T, medium: T, large: T): T => {
  if (isSmallDevice()) return small;
  if (isLargeDevice()) return large;
  return medium;
};

// Screen size breakpoints
export const SCREEN_BREAKPOINTS = {
  small: 375,   // iPhone SE, iPhone 8
  medium: 414,  // iPhone 11, iPhone XR, iPhone 12/13/14
  large: 428,   // iPhone 12/13/14 Pro Max
} as const;

// Export screen dimensions for convenience
export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: isSmallDevice(),
  isMedium: isMediumDevice(),
  isLarge: isLargeDevice(),
} as const;

/**
 * Helper to get window dimensions that updates on orientation change
 */
export const useResponsiveDimensions = () => {
  return Dimensions.get('window');
};
