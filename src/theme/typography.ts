import { Platform } from 'react-native';

export const Typography = {
  fontFamily: Platform.select({
    ios: '-apple-system',
    android: 'sans-serif',
  }),
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 38,
  },
  weights: {
    regular: '400' as const,
    medium: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
    black: '900' as const,
  },
};