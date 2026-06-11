import { Platform } from 'react-native';

// ─── Core Palette ─────────────────────────────────────────────────────────────
export const Colors = {
  // Primary (Retro Monopoly Theme)
  cream: '#F4F1EA',     // The main warm paper background
  maroon: '#1A1A1A',    // Replacing the primary maroon with Retro Black for text/borders
  gold: '#C5A059',      // The retro gold accent
  parchment: '#FFFFFF', // Clean white for card backgrounds
  errorRed: '#B91C1C',  // Stamp Red for bankrupt/negative

  // Extended
  maroonLight: '#F4F1EA', // Used for some generic backgrounds
  goldMuted: '#D1CFC7',   // Greyish board dots
  creamDark: '#E5E1D8',
  ink: '#1A1A1A',         // Absolute black for typography
  ghost: '#1A1A1A',       // Used for disabled, just using opacity on ink instead
  green: '#16A34A',       // Positive salary

  // Utility
  white: '#FFFFFF',
  black: '#1A1A1A',       // Neobrutalist borders
  transparent: 'transparent',
} as const;

// ─── Dark Mode Tokens ─────────────────────────────────────────────────────────
export const DarkColors = {
  ...Colors, // Force light mode for the retro paper look
} as const;

// ─── Player Accent Colours (8 slots) ─────────────────────────────────────────
export const PlayerColors = [
  '#C5A059', // Gold
  '#E11D48', // Rose Red
  '#2563EB', // Blue
  '#16A34A', // Green
  '#CA8A04', // Amber
  '#7C3AED', // Violet
  '#0891B2', // Cyan
  '#475569', // Slate
] as const;

// ─── Property Group Colours ───────────────────────────────────────────────────
export const PropertyGroupColors: Record<string, string> = {
  brown: '#8B4513',
  light_blue: '#87CEEB',
  pink: '#FF69B4',
  orange: '#FFA500',
  red: '#DC143C',
  yellow: '#FFD700',
  green: '#228B22',
  dark_blue: '#00008B',
  station: '#1A1A1A',
  utility: '#C0C0C0',
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────
export const Radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
// We approximate Bebas Neue and Lora using system fonts
export const Typography = {
  // Font families
  display: 'AlfaSlabOne-Regular',
  displayMedium: 'AlfaSlabOne-Regular',
  body: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  bodySemibold: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  bodyMedium: Platform.OS === 'ios' ? 'Georgia' : 'serif',

  // Font sizes
  size: {
    display: 40,
    balance: 36,
    h1: 28,
    h2: 20,
    body: 16,
    caption: 12,
    button: 18,
    micro: 10,
  },

  // Line heights
  lineHeight: {
    display: 48,
    balance: 40,
    h1: 34,
    h2: 26,
    body: 24,
    caption: 18,
    button: 22,
    micro: 14,
  },
} as const;

// ─── Component Sizes ──────────────────────────────────────────────────────────
export const ComponentSizes = {
  playerCard: { height: 160 },
  playerCardExpanded: { height: 220 },
  denominationChip: { height: 48, minWidth: 72 },
  radialNode: { size: 60 },
  fab: { size: 56 },
  snackbar: { height: 56 },
  sessionCodeBadge: { height: 32 },
  header: { height: 60 },
  primaryButton: { height: 56 },
} as const;

// ─── Shadows (Neobrutalist) ───────────────────────────────────────────────────
export const Shadows = {
  card: {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8, // Android fallback
  },
  btn: {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4, // Android fallback
  },
  sheet: {
    borderTopWidth: 4,
    borderColor: '#1A1A1A',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 12,
  },
  fab: {
    borderWidth: 2,
    borderColor: '#1A1A1A',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
} as const;
