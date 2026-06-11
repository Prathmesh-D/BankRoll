import type { EditionConfig } from '../../types/edition';

export const STANDARD_AU: EditionConfig = {
  id: 'standard_au',
  name: 'Australian Edition',
  currency: { symbol: '$', code: 'AUD', locale: 'en-AU', notation: 'standard' },
  startingBalance: 1500,
  bankFloat: 20580,
  salary: 200,
  taxPresets: [
    { id: 'luxury', label: 'Luxury Tax', amount: 100 },
    { id: 'income_flat', label: 'Income Tax ($200)', amount: 200 },
    { id: 'income_pct', label: 'Income Tax (10%)', amount: -1 },
  ],
  colorGroups: [
    { id: 'brown',      label: 'Brown',      hex: '#8B4513', propertyIds: ['todd_st', 'smith_st'] },
    { id: 'light_blue', label: 'Light Blue', hex: '#87CEEB', propertyIds: ['salamanca_pl', 'davey_st', 'macquarie_st'] },
    { id: 'pink',       label: 'Pink',       hex: '#FF69B4', propertyIds: ['william_st', 'barrack_st', 'hay_st'] },
    { id: 'orange',     label: 'Orange',     hex: '#FFA500', propertyIds: ['north_terrace', 'victoria_square', 'rundle_mall'] },
    { id: 'red',        label: 'Red',        hex: '#DC143C', propertyIds: ['stanley_st', 'petries_bight', 'wickham_terrace'] },
    { id: 'yellow',     label: 'Yellow',     hex: '#FFD700', propertyIds: ['collins_st', 'elizabeth_st', 'bourke_st'] },
    { id: 'green',      label: 'Green',      hex: '#228B22', propertyIds: ['castlereagh_st', 'george_st', 'pitt_st'] },
    { id: 'dark_blue',  label: 'Dark Blue',  hex: '#00008B', propertyIds: ['flinders_way', 'kings_ave'] },
    { id: 'station',    label: 'Stations',   hex: '#1A1A1A', propertyIds: ['perth_station', 'adelaide_station', 'flinders_st_station', 'sydney_station'] },
    { id: 'utility',    label: 'Utilities',  hex: '#C0C0C0', propertyIds: ['australia_post', 'telstra'] },
  ],
  properties: [
    // ── BROWN ─────────────────────────────────────────────────────────────────
    {
      id: 'todd_st', name: 'Todd Street',
      colorGroup: 'brown', colorHex: '#8B4513',
      purchasePrice: 60, mortgageValue: 30, unmortgageCost: 33,
      houseCost: 50, hotelCost: 50, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 2 }, { houses: 1, amount: 10 },
        { houses: 2, amount: 30 }, { houses: 3, amount: 90 },
        { houses: 4, amount: 160 }, { houses: 5, amount: 250 },
      ],
    },
    {
      id: 'smith_st', name: 'Smith Street',
      colorGroup: 'brown', colorHex: '#8B4513',
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
      id: 'salamanca_pl', name: 'Salamanca Place',
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
      id: 'davey_st', name: 'Davey Street',
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
      id: 'macquarie_st', name: 'Macquarie Street',
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
      id: 'william_st', name: 'William Street',
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
      id: 'barrack_st', name: 'Barrack Street',
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
      id: 'hay_st', name: 'Hay Street',
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
      id: 'north_terrace', name: 'North Terrace',
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
      id: 'victoria_square', name: 'Victoria Square',
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
      id: 'rundle_mall', name: 'Rundle Mall',
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
      id: 'stanley_st', name: 'Stanley Street',
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
      id: 'petries_bight', name: 'Petries Bight',
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
      id: 'wickham_terrace', name: 'Wickham Terrace',
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
      id: 'collins_st', name: 'Collins Street',
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
      id: 'elizabeth_st', name: 'Elizabeth Street',
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
      id: 'bourke_st', name: 'Bourke Street',
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
      id: 'castlereagh_st', name: 'Castlereagh Street',
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
      id: 'george_st', name: 'George Street',
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
      id: 'pitt_st', name: 'Pitt Street',
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
      id: 'flinders_way', name: 'Flinders Way',
      colorGroup: 'dark_blue', colorHex: '#00008B',
      purchasePrice: 350, mortgageValue: 175, unmortgageCost: 193,
      houseCost: 200, hotelCost: 200, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 35 }, { houses: 1, amount: 175 },
        { houses: 2, amount: 500 }, { houses: 3, amount: 1100 },
        { houses: 4, amount: 1300 }, { houses: 5, amount: 1500 },
      ],
    },
    {
      id: 'kings_ave', name: 'Kings Avenue',
      colorGroup: 'dark_blue', colorHex: '#00008B',
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
      id: 'perth_station', name: 'Perth Station',
      colorGroup: 'station', colorHex: '#1A1A1A',
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
      id: 'adelaide_station', name: 'Adelaide Station',
      colorGroup: 'station', colorHex: '#1A1A1A',
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
      id: 'flinders_st_station', name: 'Flinders St. Station',
      colorGroup: 'station', colorHex: '#1A1A1A',
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
      id: 'sydney_station', name: 'Sydney Station',
      colorGroup: 'station', colorHex: '#1A1A1A',
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
      id: 'australia_post', name: 'Australia Post',
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
      id: 'telstra', name: 'Telstra',
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
