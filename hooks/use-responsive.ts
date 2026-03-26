import { Dimensions, useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return {
    // Screen sizes
    isSmallPhone: width < 375,      // iPhone SE
    isPhone: width >= 375 && width < 430,  // iPhone 12-14
    isLargePhone: width >= 430,     // iPhone 14 Pro Max
    isTablet: width >= 600,

    // Dimensions
    width,
    height,
    isPortrait: height > width,
    isLandscape: width > height,

    // Spacing helpers
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },

    // Font size helpers
    fontSize: {
      xs: width < 375 ? 11 : 12,
      sm: width < 375 ? 12 : 14,
      base: width < 375 ? 14 : 16,
      lg: width < 375 ? 16 : 18,
      xl: width < 375 ? 18 : 20,
      '2xl': width < 375 ? 20 : 24,
      '3xl': width < 375 ? 24 : 28,
    },

    // Padding helpers
    screenPadding: width < 375 ? 12 : 16,
    cardPadding: width < 375 ? 12 : 16,

    // Width helpers
    maxWidth: Math.min(width - 32, 500),
    fullWidth: width,
    halfWidth: (width - 24) / 2,
    thirdWidth: (width - 32) / 3,
  };
}
