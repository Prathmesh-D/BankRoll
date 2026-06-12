import type { EditionConfig } from '../../types/edition';

export const STANDARD_UK: EditionConfig = {
  id: 'standard_uk',
  name: 'UK (London) Edition',
  currency: { symbol: '£', code: 'GBP', locale: 'en-GB', notation: 'standard' },
  startingBalance: 1500,
  bankFloat: 20580,
  salary: 200,
  taxPresets: [
    { id: 'luxury', label: 'Luxury Tax', amount: 75 },
    { id: 'income_flat', label: 'Income Tax (£200)', amount: 200 },
    { id: 'income_pct', label: 'Income Tax (10%)', amount: -1 },
  ],
  colorGroups: [
    { id: 'brown',      label: 'Brown',      hex: '#955436', propertyIds: ['old_kent_road', 'whitechapel'] },
    { id: 'light_blue', label: 'Light Blue', hex: '#87CEEB', propertyIds: ['angel_islington', 'euston_road', 'pentonville'] },
    { id: 'pink',       label: 'Pink',       hex: '#FF69B4', propertyIds: ['pall_mall', 'whitehall', 'northumberland'] },
    { id: 'orange',     label: 'Orange',     hex: '#FFA500', propertyIds: ['bow_street', 'marlborough', 'vine_street'] },
    { id: 'red',        label: 'Red',        hex: '#DC143C', propertyIds: ['strand', 'fleet_street', 'trafalgar'] },
    { id: 'yellow',     label: 'Yellow',     hex: '#FFD700', propertyIds: ['leicester', 'coventry', 'piccadilly'] },
    { id: 'green',      label: 'Green',      hex: '#228B22', propertyIds: ['bond_street', 'oxford_street', 'regent_street'] },
    { id: 'dark_blue',  label: 'Dark Blue',  hex: '#0072BB', propertyIds: ['park_lane', 'mayfair'] },
    { id: 'station',    label: 'Stations',   hex: '#6E6E6E', propertyIds: ['kings_cross', 'marylebone', 'fenchurch', 'liverpool_st'] },
    { id: 'utility',    label: 'Utilities',  hex: '#C0C0C0', propertyIds: ['electric', 'water'] },
  ],
  properties: [
    // ── BROWN ─────────────────────────────────────────────────────────────────
    {
      id: 'old_kent_road', name: 'Old Kent Road',
      colorGroup: 'brown', colorHex: '#955436',
      purchasePrice: 60, mortgageValue: 30, unmortgageCost: 33,
      houseCost: 50, hotelCost: 50, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 2 }, { houses: 1, amount: 10 },
        { houses: 2, amount: 30 }, { houses: 3, amount: 90 },
        { houses: 4, amount: 160 }, { houses: 5, amount: 250 },
      ],
    },
    {
      id: 'whitechapel', name: 'Whitechapel Road',
      colorGroup: 'brown', colorHex: '#955436',
      purchasePrice: 60, mortgageValue: 30, unmortgageCost: 33,
      houseCost: 50, hotelCost: 50, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 4 }, { houses: 1, amount: 20 },
        { houses: 2, amount: 60 }, { houses: 3, amount: 180 },
        { houses: 4, amount: 320 }, { houses: 5, amount: 450 },
      ],
    },
    // ── LIGHT BLUE ────────────────────────────────────────────────────────────
    {
      id: 'angel_islington', name: 'The Angel, Islington',
      colorGroup: 'light_blue', colorHex: '#87CEEB',
      purchasePrice: 100, mortgageValue: 50, unmortgageCost: 55,
      houseCost: 50, hotelCost: 50, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 6 }, { houses: 1, amount: 30 },
        { houses: 2, amount: 90 }, { houses: 3, amount: 270 },
        { houses: 4, amount: 400 }, { houses: 5, amount: 550 },
      ],
    },
    {
      id: 'euston_road', name: 'Euston Road',
      colorGroup: 'light_blue', colorHex: '#87CEEB',
      purchasePrice: 100, mortgageValue: 50, unmortgageCost: 55,
      houseCost: 50, hotelCost: 50, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 6 }, { houses: 1, amount: 30 },
        { houses: 2, amount: 90 }, { houses: 3, amount: 270 },
        { houses: 4, amount: 400 }, { houses: 5, amount: 550 },
      ],
    },
    {
      id: 'pentonville', name: 'Pentonville Road',
      colorGroup: 'light_blue', colorHex: '#87CEEB',
      purchasePrice: 120, mortgageValue: 60, unmortgageCost: 66,
      houseCost: 50, hotelCost: 50, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 8 }, { houses: 1, amount: 40 },
        { houses: 2, amount: 100 }, { houses: 3, amount: 300 },
        { houses: 4, amount: 450 }, { houses: 5, amount: 600 },
      ],
    },
    // ── PINK ──────────────────────────────────────────────────────────────────
    {
      id: 'pall_mall', name: 'Pall Mall',
      colorGroup: 'pink', colorHex: '#FF69B4',
      purchasePrice: 140, mortgageValue: 70, unmortgageCost: 77,
      houseCost: 100, hotelCost: 100, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 10 }, { houses: 1, amount: 50 },
        { houses: 2, amount: 150 }, { houses: 3, amount: 450 },
        { houses: 4, amount: 625 }, { houses: 5, amount: 750 },
      ],
    },
    {
      id: 'whitehall', name: 'Whitehall',
      colorGroup: 'pink', colorHex: '#FF69B4',
      purchasePrice: 140, mortgageValue: 70, unmortgageCost: 77,
      houseCost: 100, hotelCost: 100, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 10 }, { houses: 1, amount: 50 },
        { houses: 2, amount: 150 }, { houses: 3, amount: 450 },
        { houses: 4, amount: 625 }, { houses: 5, amount: 750 },
      ],
    },
    {
      id: 'northumberland', name: 'Northumberland Avenue',
      colorGroup: 'pink', colorHex: '#FF69B4',
      purchasePrice: 160, mortgageValue: 80, unmortgageCost: 88,
      houseCost: 100, hotelCost: 100, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 12 }, { houses: 1, amount: 60 },
        { houses: 2, amount: 180 }, { houses: 3, amount: 500 },
        { houses: 4, amount: 700 }, { houses: 5, amount: 900 },
      ],
    },
    // ── ORANGE ────────────────────────────────────────────────────────────────
    {
      id: 'bow_street', name: 'Bow Street',
      colorGroup: 'orange', colorHex: '#FFA500',
      purchasePrice: 180, mortgageValue: 90, unmortgageCost: 99,
      houseCost: 100, hotelCost: 100, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 14 }, { houses: 1, amount: 70 },
        { houses: 2, amount: 200 }, { houses: 3, amount: 550 },
        { houses: 4, amount: 750 }, { houses: 5, amount: 950 },
      ],
    },
    {
      id: 'marlborough', name: 'Marlborough Street',
      colorGroup: 'orange', colorHex: '#FFA500',
      purchasePrice: 180, mortgageValue: 90, unmortgageCost: 99,
      houseCost: 100, hotelCost: 100, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 14 }, { houses: 1, amount: 70 },
        { houses: 2, amount: 200 }, { houses: 3, amount: 550 },
        { houses: 4, amount: 750 }, { houses: 5, amount: 950 },
      ],
    },
    {
      id: 'vine_street', name: 'Vine Street',
      colorGroup: 'orange', colorHex: '#FFA500',
      purchasePrice: 200, mortgageValue: 100, unmortgageCost: 110,
      houseCost: 100, hotelCost: 100, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 16 }, { houses: 1, amount: 80 },
        { houses: 2, amount: 220 }, { houses: 3, amount: 600 },
        { houses: 4, amount: 800 }, { houses: 5, amount: 1000 },
      ],
    },
    // ── RED ───────────────────────────────────────────────────────────────────
    {
      id: 'strand', name: 'Strand',
      colorGroup: 'red', colorHex: '#DC143C',
      purchasePrice: 220, mortgageValue: 110, unmortgageCost: 121,
      houseCost: 150, hotelCost: 150, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 18 }, { houses: 1, amount: 90 },
        { houses: 2, amount: 250 }, { houses: 3, amount: 700 },
        { houses: 4, amount: 875 }, { houses: 5, amount: 1050 },
      ],
    },
    {
      id: 'fleet_street', name: 'Fleet Street',
      colorGroup: 'red', colorHex: '#DC143C',
      purchasePrice: 220, mortgageValue: 110, unmortgageCost: 121,
      houseCost: 150, hotelCost: 150, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 18 }, { houses: 1, amount: 90 },
        { houses: 2, amount: 250 }, { houses: 3, amount: 700 },
        { houses: 4, amount: 875 }, { houses: 5, amount: 1050 },
      ],
    },
    {
      id: 'trafalgar', name: 'Trafalgar Square',
      colorGroup: 'red', colorHex: '#DC143C',
      purchasePrice: 240, mortgageValue: 120, unmortgageCost: 132,
      houseCost: 150, hotelCost: 150, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 20 }, { houses: 1, amount: 100 },
        { houses: 2, amount: 300 }, { houses: 3, amount: 750 },
        { houses: 4, amount: 925 }, { houses: 5, amount: 1100 },
      ],
    },
    // ── YELLOW ────────────────────────────────────────────────────────────────
    {
      id: 'leicester', name: 'Leicester Square',
      colorGroup: 'yellow', colorHex: '#FFD700',
      purchasePrice: 260, mortgageValue: 130, unmortgageCost: 143,
      houseCost: 150, hotelCost: 150, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 22 }, { houses: 1, amount: 110 },
        { houses: 2, amount: 330 }, { houses: 3, amount: 800 },
        { houses: 4, amount: 975 }, { houses: 5, amount: 1150 },
      ],
    },
    {
      id: 'coventry', name: 'Coventry Street',
      colorGroup: 'yellow', colorHex: '#FFD700',
      purchasePrice: 260, mortgageValue: 130, unmortgageCost: 143,
      houseCost: 150, hotelCost: 150, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 22 }, { houses: 1, amount: 110 },
        { houses: 2, amount: 330 }, { houses: 3, amount: 800 },
        { houses: 4, amount: 975 }, { houses: 5, amount: 1150 },
      ],
    },
    {
      id: 'piccadilly', name: 'Piccadilly',
      colorGroup: 'yellow', colorHex: '#FFD700',
      purchasePrice: 280, mortgageValue: 140, unmortgageCost: 154,
      houseCost: 150, hotelCost: 150, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 24 }, { houses: 1, amount: 120 },
        { houses: 2, amount: 360 }, { houses: 3, amount: 850 },
        { houses: 4, amount: 1025 }, { houses: 5, amount: 1200 },
      ],
    },
    // ── GREEN ─────────────────────────────────────────────────────────────────
    {
      id: 'bond_street', name: 'Bond Street',
      colorGroup: 'green', colorHex: '#228B22',
      purchasePrice: 300, mortgageValue: 150, unmortgageCost: 165,
      houseCost: 200, hotelCost: 200, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 26 }, { houses: 1, amount: 130 },
        { houses: 2, amount: 390 }, { houses: 3, amount: 900 },
        { houses: 4, amount: 1100 }, { houses: 5, amount: 1275 },
      ],
    },
    {
      id: 'oxford_street', name: 'Oxford Street',
      colorGroup: 'green', colorHex: '#228B22',
      purchasePrice: 300, mortgageValue: 150, unmortgageCost: 165,
      houseCost: 200, hotelCost: 200, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 26 }, { houses: 1, amount: 130 },
        { houses: 2, amount: 390 }, { houses: 3, amount: 900 },
        { houses: 4, amount: 1100 }, { houses: 5, amount: 1275 },
      ],
    },
    {
      id: 'regent_street', name: 'Regent Street',
      colorGroup: 'green', colorHex: '#228B22',
      purchasePrice: 320, mortgageValue: 160, unmortgageCost: 176,
      houseCost: 200, hotelCost: 200, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 28 }, { houses: 1, amount: 150 },
        { houses: 2, amount: 450 }, { houses: 3, amount: 1000 },
        { houses: 4, amount: 1200 }, { houses: 5, amount: 1400 },
      ],
    },
    // ── DARK BLUE ─────────────────────────────────────────────────────────────
    {
      id: 'park_lane', name: 'Park Lane',
      colorGroup: 'dark_blue', colorHex: '#0072BB',
      purchasePrice: 350, mortgageValue: 175, unmortgageCost: 193,
      houseCost: 200, hotelCost: 200, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 35 }, { houses: 1, amount: 175 },
        { houses: 2, amount: 500 }, { houses: 3, amount: 1100 },
        { houses: 4, amount: 1300 }, { houses: 5, amount: 1500 },
      ],
    },
    {
      id: 'mayfair', name: 'Mayfair',
      colorGroup: 'dark_blue', colorHex: '#0072BB',
      purchasePrice: 400, mortgageValue: 200, unmortgageCost: 220,
      houseCost: 200, hotelCost: 200, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 50 }, { houses: 1, amount: 200 },
        { houses: 2, amount: 600 }, { houses: 3, amount: 1400 },
        { houses: 4, amount: 1700 }, { houses: 5, amount: 2000 },
      ],
    },
    // ── STATIONS ──────────────────────────────────────────────────────────────
    {
      id: 'kings_cross', name: "King's Cross Station",
      colorGroup: 'station', colorHex: '#6E6E6E',
      purchasePrice: 200, mortgageValue: 100, unmortgageCost: 110,
      houseCost: 0, hotelCost: 0, isStation: true, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 25 }, { houses: 1, amount: 25 },
        { houses: 2, amount: 25 }, { houses: 3, amount: 25 },
        { houses: 4, amount: 25 }, { houses: 5, amount: 25 },
      ],
      stationRentTiers: [25, 50, 100, 200],
    },
    {
      id: 'marylebone', name: 'Marylebone Station',
      colorGroup: 'station', colorHex: '#6E6E6E',
      purchasePrice: 200, mortgageValue: 100, unmortgageCost: 110,
      houseCost: 0, hotelCost: 0, isStation: true, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 25 }, { houses: 1, amount: 25 },
        { houses: 2, amount: 25 }, { houses: 3, amount: 25 },
        { houses: 4, amount: 25 }, { houses: 5, amount: 25 },
      ],
      stationRentTiers: [25, 50, 100, 200],
    },
    {
      id: 'fenchurch', name: 'Fenchurch St. Station',
      colorGroup: 'station', colorHex: '#6E6E6E',
      purchasePrice: 200, mortgageValue: 100, unmortgageCost: 110,
      houseCost: 0, hotelCost: 0, isStation: true, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 25 }, { houses: 1, amount: 25 },
        { houses: 2, amount: 25 }, { houses: 3, amount: 25 },
        { houses: 4, amount: 25 }, { houses: 5, amount: 25 },
      ],
      stationRentTiers: [25, 50, 100, 200],
    },
    {
      id: 'liverpool_st', name: 'Liverpool St. Station',
      colorGroup: 'station', colorHex: '#6E6E6E',
      purchasePrice: 200, mortgageValue: 100, unmortgageCost: 110,
      houseCost: 0, hotelCost: 0, isStation: true, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 25 }, { houses: 1, amount: 25 },
        { houses: 2, amount: 25 }, { houses: 3, amount: 25 },
        { houses: 4, amount: 25 }, { houses: 5, amount: 25 },
      ],
      stationRentTiers: [25, 50, 100, 200],
    },
    // ── UTILITIES ─────────────────────────────────────────────────────────────
    {
      id: 'electric', name: 'Electric Company',
      colorGroup: 'utility', colorHex: '#C0C0C0',
      purchasePrice: 150, mortgageValue: 75, unmortgageCost: 83,
      houseCost: 0, hotelCost: 0, isStation: false, isUtility: true,
      rentTiers: [
        { houses: 0, amount: 0 }, { houses: 1, amount: 0 },
        { houses: 2, amount: 0 }, { houses: 3, amount: 0 },
        { houses: 4, amount: 0 }, { houses: 5, amount: 0 },
      ],
    },
    {
      id: 'water', name: 'Water Works',
      colorGroup: 'utility', colorHex: '#C0C0C0',
      purchasePrice: 150, mortgageValue: 75, unmortgageCost: 83,
      houseCost: 0, hotelCost: 0, isStation: false, isUtility: true,
      rentTiers: [
        { houses: 0, amount: 0 }, { houses: 1, amount: 0 },
        { houses: 2, amount: 0 }, { houses: 3, amount: 0 },
        { houses: 4, amount: 0 }, { houses: 5, amount: 0 },
      ],
    },
  ],
};
