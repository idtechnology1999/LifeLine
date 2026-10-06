import { Platform } from 'react-native';

// Single source for the font family every screen was previously
// redeclaring independently. Still system-font for now; swapping in a
// custom typeface later only means changing it here.
export const FONT = Platform.select({ ios: 'System', default: 'System' });

// A real type scale, so new/updated screens stop inventing one-off sizes
// like 14.5 / 13.5 / 11.5. Existing screens can adopt these gradually.
export const FontSize = {
  caption: 12,
  small: 13,
  body: 15,
  bodyLarge: 16,
  label: 14,
  title: 18,
  heading: 22,
  display: 26,
  hero: 30,
} as const;

export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;
