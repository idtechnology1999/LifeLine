// Single resolved color source. `constants/colors.ts` (`Colors`) and
// `src/theme/colors.ts` (`colors`) both derive their values from here now,
// so the two previously-independent palettes can no longer drift apart —
// see docs/total-documentation.md §10 for why this existed as two (really
// three, counting the inline-hex set used across app/driver/** and
// app/dispatcher/**) separate systems.
export const Theme = {
  // Brand
  brandBlue: '#0A7AFF',

  // Ink / text
  ink: '#1A1A1A',
  inkMuted: '#8E8E93',
  inkSubtle: '#9AA3B2',

  // Surfaces & borders
  white: '#FFFFFF',
  surface: '#F0F7FF',
  border: '#E5E5EA',

  // Semantic
  success: '#34C759',
  warning: '#FF9F0A',
  danger: '#FF3B30',
} as const;
