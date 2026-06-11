import type { HouseRules } from '../types/houseRules';
import type { AppSettings } from '../types/settings';
import type { EditionConfig } from '../types/edition';

export function defaultHouseRules(edition?: EditionConfig): HouseRules {
  return {
    startingBonus: edition?.salary ?? 200,
    noBankruptcy: false,
    infiniteBankMoney: false,
    customRules: [],
  };
}

export function defaultAppSettings(): AppSettings {
  return {
    theme: 'system',
    hapticsEnabled: true,
    animationsEnabled: true,
    reduceMotion: false,
    gesturelessMode: false,
  };
}

/** 8 distinct player accent colours that pair with both Cream and Maroon */
export const PLAYER_COLOURS = [
  '#2563EB', // Cobalt
  '#059669', // Emerald
  '#EA580C', // Tangerine
  '#7C3AED', // Violet
  '#DB2777', // Rose
  '#0891B2', // Teal
  '#D97706', // Amber
  '#475569', // Slate
] as const;

/** Default player emoji avatars (classic Monopoly token references) */
export const DEFAULT_AVATARS = [
  'briefcase',
  'boot',
  'car',
  'dog',
  'vault',
  'tophat',
  'crown',
  'diamond',
] as const;

export const AVATAR_IMAGES: Record<string, any> = {
  'briefcase': require('../../assets/images/avatars/t_avatar_briefcase.png'),
  'boot': require('../../assets/images/avatars/t_avatar_boot.png'),
  'car': require('../../assets/images/avatars/t_avatar_car.png'),
  'dog': require('../../assets/images/avatars/t_avatar_dog.png'),
  'vault': require('../../assets/images/avatars/t_avatar_vault.png'),
  'tophat': require('../../assets/images/avatars/t_avatar_tophat.png'),
  'crown': require('../../assets/images/avatars/t_avatar_crown.png'),
  'diamond': require('../../assets/images/avatars/t_avatar_diamond.png'),
  'bank': require('../../assets/images/avatars/t_avatar_bank.png'),
};

/** Default player names */
export const DEFAULT_PLAYER_NAMES = [
  'Player 1',
  'Player 2',
  'Player 3',
  'Player 4',
  'Player 5',
  'Player 6',
  'Player 7',
  'Player 8',
];

/** Standard Monopoly denomination chips per edition currency scale */
export function getDenominations(scale: number = 1): number[] {
  return [1, 5, 10, 20, 50, 100, 500].map(d => d * scale);
}

/** Denomination chips for Indian edition (scaled to lakh) */
export const INDIAN_DENOMINATIONS = [
  10_000,
  50_000,
  100_000,
  200_000,
  500_000,
  1_000_000,
  5_000_000,
];

/** Default undo window in milliseconds */
export const UNDO_WINDOW_MS = 15_000;

/** Maximum number of custom rules allowed */
export const MAX_CUSTOM_RULES = 10;

/** Maximum number of sessions stored in history */
export const MAX_SESSION_HISTORY = 10;
