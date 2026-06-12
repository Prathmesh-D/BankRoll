import type { PropertyId } from './primitives';

export interface CurrencyConfig {
  symbol: string;          // "$" | "£" | "₹"
  code: string;
  locale: string;          // "en-US" | "en-GB" | "en-IN"
  notation: 'standard' | 'indian';
}

export interface TaxPreset {
  id: string;
  label: string;           // e.g. "Luxury Tax", "Income Tax (10%)"
  amount: number;          // -1 = compute 10% of balance at runtime
}

export interface RentTier {
  houses: 0 | 1 | 2 | 3 | 4 | 5; // 5 = hotel
  amount: number;
}

export interface Property {
  id: PropertyId;
  name: string;
  colorGroup: string;      // e.g. "brown", "light_blue"
  colorHex: string;        // e.g. "#8B4513"
  purchasePrice: number;
  mortgageValue: number;   // = purchasePrice / 2
  unmortgageCost: number;  // = mortgageValue * 1.1
  houseCost: number;       // per house
  hotelCost: number;
  rentTiers: RentTier[];   // length 6 (0 houses through hotel)
  isStation: boolean;
  isUtility: boolean;
  stationRentTiers?: number[]; // [25, 50, 100, 200] for 1-4 stations owned
}

export interface ColorGroup {
  id: string;
  label: string;
  hex: string;
  propertyIds: PropertyId[];
}

export interface EditionConfig {
  id: string;              // EditionId
  name: string;
  currency: CurrencyConfig;
  startingBalance: number;
  bankFloat: number;
  salary: number;          // Go salary
  taxPresets: TaxPreset[];
  properties: Property[];  // 28 streets + 4 stations + 2 utilities = 34 total
  colorGroups: ColorGroup[];
}
