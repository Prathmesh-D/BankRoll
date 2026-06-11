import { STANDARD_US } from './standard_us';
import { STANDARD_UK } from './standard_uk';
import { STANDARD_IN } from './standard_in';
import { STANDARD_AU } from './standard_au';
import type { EditionConfig } from '../../types/edition';

export type EditionId = 'standard_us' | 'standard_uk' | 'standard_in' | 'standard_au' | 'custom';

export const EDITIONS: Record<string, EditionConfig | null> = {
  standard_us: STANDARD_US,
  standard_uk: STANDARD_UK,
  standard_in: STANDARD_IN,
  standard_au: STANDARD_AU,
  custom: null, // Built at runtime from NewGameConfig.customEditionConfig
};

/**
 * Retrieves an edition config by ID.
 * Throws for unknown editions — use isValidEdition() first if uncertain.
 */
export function getEditionConfig(id: string): EditionConfig {
  const config = EDITIONS[id];
  if (!config) {
    throw new Error(`Edition "${id}" not found or is custom (must be provided inline).`);
  }
  return config;
}

export function isValidEdition(id: string): boolean {
  return id in EDITIONS;
}

export const EDITION_LIST = [
  {
    id: 'standard_uk' as EditionId,
    name: 'UK (London)',
    flag: '🇬🇧',
    currency: '£',
    sampleProperty: 'Mayfair',
  },
  {
    id: 'standard_us' as EditionId,
    name: 'US Standard',
    flag: '🇺🇸',
    currency: '$',
    sampleProperty: 'Boardwalk',
  },
  {
    id: 'standard_au' as EditionId,
    name: 'Australian',
    flag: '🇦🇺',
    currency: '$',
    sampleProperty: 'Kings Avenue',
  },
  {
    id: 'standard_in' as EditionId,
    name: 'Indian (Mumbai)',
    flag: '🇮🇳',
    currency: '₹',
    sampleProperty: 'Pedder Road',
  },
];

export { STANDARD_US, STANDARD_UK, STANDARD_IN, STANDARD_AU };
