import type { EditionConfig } from '../../types/edition';

// Indian edition amounts scaled proportionally to US edition (×10,000)
// e.g. US $60 → ₹6,00,000 (6 lakh)
export const STANDARD_IN: EditionConfig = {
  id: 'standard_in',
  name: 'Indian (Mumbai) Edition',
  currency: { symbol: '₹', code: 'INR', locale: 'en-IN', notation: 'indian' },
  startingBalance: 15_000_000,   // ₹1.5 crore
  bankFloat: 205_800_000,
  salary: 2_000_000,             // ₹20 lakh
  taxPresets: [
    { id: 'luxury', label: 'Luxury Tax', amount: 750_000 },
    { id: 'income_flat', label: 'Income Tax (₹20L)', amount: 2_000_000 },
    { id: 'income_pct', label: 'Income Tax (10%)', amount: -1 },
  ],
  colorGroups: [
    { id: 'brown',      label: 'Brown',      hex: '#955436', propertyIds: ['marine_lines', 'byculla'] },
    { id: 'light_blue', label: 'Light Blue', hex: '#87CEEB', propertyIds: ['grant_road', 'opera_house', 'churchgate'] },
    { id: 'pink',       label: 'Pink',       hex: '#FF69B4', propertyIds: ['andheri', 'juhu', 'versova'] },
    { id: 'orange',     label: 'Orange',     hex: '#FFA500', propertyIds: ['bandra', 'khar', 'santacruz'] },
    { id: 'red',        label: 'Red',        hex: '#DC143C', propertyIds: ['worli', 'lower_parel', 'prabhadevi'] },
    { id: 'yellow',     label: 'Yellow',     hex: '#FFD700', propertyIds: ['nariman_point', 'fort', 'colaba'] },
    { id: 'green',      label: 'Green',      hex: '#228B22', propertyIds: ['cuffe_parade', 'backbay', 'malabar_hill'] },
    { id: 'dark_blue',  label: 'Dark Blue',  hex: '#0072BB', propertyIds: ['altamount_road', 'pedder_road'] },
    { id: 'station',    label: 'Stations',   hex: '#6E6E6E', propertyIds: ['cst', 'dadar', 'thane', 'kurla'] },
    { id: 'utility',    label: 'Utilities',  hex: '#C0C0C0', propertyIds: ['bses', 'bmc'] },
  ],
  properties: [
    // ── BROWN ─────────────────────────────────────────────────────────────────
    {
      id: 'marine_lines', name: 'Marine Lines',
      colorGroup: 'brown', colorHex: '#955436',
      purchasePrice: 600_000, mortgageValue: 300_000, unmortgageCost: 330_000,
      houseCost: 500_000, hotelCost: 500_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 20_000 }, { houses: 1, amount: 100_000 },
        { houses: 2, amount: 300_000 }, { houses: 3, amount: 900_000 },
        { houses: 4, amount: 1_600_000 }, { houses: 5, amount: 2_500_000 },
      ],
    },
    {
      id: 'byculla', name: 'Byculla',
      colorGroup: 'brown', colorHex: '#955436',
      purchasePrice: 600_000, mortgageValue: 300_000, unmortgageCost: 330_000,
      houseCost: 500_000, hotelCost: 500_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 40_000 }, { houses: 1, amount: 200_000 },
        { houses: 2, amount: 600_000 }, { houses: 3, amount: 1_800_000 },
        { houses: 4, amount: 3_200_000 }, { houses: 5, amount: 4_500_000 },
      ],
    },
    // ── LIGHT BLUE ────────────────────────────────────────────────────────────
    {
      id: 'grant_road', name: 'Grant Road',
      colorGroup: 'light_blue', colorHex: '#87CEEB',
      purchasePrice: 1_000_000, mortgageValue: 500_000, unmortgageCost: 550_000,
      houseCost: 500_000, hotelCost: 500_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 60_000 }, { houses: 1, amount: 300_000 },
        { houses: 2, amount: 900_000 }, { houses: 3, amount: 2_700_000 },
        { houses: 4, amount: 4_000_000 }, { houses: 5, amount: 5_500_000 },
      ],
    },
    {
      id: 'opera_house', name: 'Opera House',
      colorGroup: 'light_blue', colorHex: '#87CEEB',
      purchasePrice: 1_000_000, mortgageValue: 500_000, unmortgageCost: 550_000,
      houseCost: 500_000, hotelCost: 500_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 60_000 }, { houses: 1, amount: 300_000 },
        { houses: 2, amount: 900_000 }, { houses: 3, amount: 2_700_000 },
        { houses: 4, amount: 4_000_000 }, { houses: 5, amount: 5_500_000 },
      ],
    },
    {
      id: 'churchgate', name: 'Churchgate',
      colorGroup: 'light_blue', colorHex: '#87CEEB',
      purchasePrice: 1_200_000, mortgageValue: 600_000, unmortgageCost: 660_000,
      houseCost: 500_000, hotelCost: 500_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 80_000 }, { houses: 1, amount: 400_000 },
        { houses: 2, amount: 1_000_000 }, { houses: 3, amount: 3_000_000 },
        { houses: 4, amount: 4_500_000 }, { houses: 5, amount: 6_000_000 },
      ],
    },
    // ── PINK ──────────────────────────────────────────────────────────────────
    {
      id: 'andheri', name: 'Andheri',
      colorGroup: 'pink', colorHex: '#FF69B4',
      purchasePrice: 1_400_000, mortgageValue: 700_000, unmortgageCost: 770_000,
      houseCost: 1_000_000, hotelCost: 1_000_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 100_000 }, { houses: 1, amount: 500_000 },
        { houses: 2, amount: 1_500_000 }, { houses: 3, amount: 4_500_000 },
        { houses: 4, amount: 6_250_000 }, { houses: 5, amount: 7_500_000 },
      ],
    },
    {
      id: 'juhu', name: 'Juhu',
      colorGroup: 'pink', colorHex: '#FF69B4',
      purchasePrice: 1_400_000, mortgageValue: 700_000, unmortgageCost: 770_000,
      houseCost: 1_000_000, hotelCost: 1_000_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 100_000 }, { houses: 1, amount: 500_000 },
        { houses: 2, amount: 1_500_000 }, { houses: 3, amount: 4_500_000 },
        { houses: 4, amount: 6_250_000 }, { houses: 5, amount: 7_500_000 },
      ],
    },
    {
      id: 'versova', name: 'Versova',
      colorGroup: 'pink', colorHex: '#FF69B4',
      purchasePrice: 1_600_000, mortgageValue: 800_000, unmortgageCost: 880_000,
      houseCost: 1_000_000, hotelCost: 1_000_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 120_000 }, { houses: 1, amount: 600_000 },
        { houses: 2, amount: 1_800_000 }, { houses: 3, amount: 5_000_000 },
        { houses: 4, amount: 7_000_000 }, { houses: 5, amount: 9_000_000 },
      ],
    },
    // ── ORANGE ────────────────────────────────────────────────────────────────
    {
      id: 'bandra', name: 'Bandra',
      colorGroup: 'orange', colorHex: '#FFA500',
      purchasePrice: 1_800_000, mortgageValue: 900_000, unmortgageCost: 990_000,
      houseCost: 1_000_000, hotelCost: 1_000_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 140_000 }, { houses: 1, amount: 700_000 },
        { houses: 2, amount: 2_000_000 }, { houses: 3, amount: 5_500_000 },
        { houses: 4, amount: 7_500_000 }, { houses: 5, amount: 9_500_000 },
      ],
    },
    {
      id: 'khar', name: 'Khar',
      colorGroup: 'orange', colorHex: '#FFA500',
      purchasePrice: 1_800_000, mortgageValue: 900_000, unmortgageCost: 990_000,
      houseCost: 1_000_000, hotelCost: 1_000_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 140_000 }, { houses: 1, amount: 700_000 },
        { houses: 2, amount: 2_000_000 }, { houses: 3, amount: 5_500_000 },
        { houses: 4, amount: 7_500_000 }, { houses: 5, amount: 9_500_000 },
      ],
    },
    {
      id: 'santacruz', name: 'Santacruz',
      colorGroup: 'orange', colorHex: '#FFA500',
      purchasePrice: 2_000_000, mortgageValue: 1_000_000, unmortgageCost: 1_100_000,
      houseCost: 1_000_000, hotelCost: 1_000_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 160_000 }, { houses: 1, amount: 800_000 },
        { houses: 2, amount: 2_200_000 }, { houses: 3, amount: 6_000_000 },
        { houses: 4, amount: 8_000_000 }, { houses: 5, amount: 10_000_000 },
      ],
    },
    // ── RED ───────────────────────────────────────────────────────────────────
    {
      id: 'worli', name: 'Worli',
      colorGroup: 'red', colorHex: '#DC143C',
      purchasePrice: 2_200_000, mortgageValue: 1_100_000, unmortgageCost: 1_210_000,
      houseCost: 1_500_000, hotelCost: 1_500_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 180_000 }, { houses: 1, amount: 900_000 },
        { houses: 2, amount: 2_500_000 }, { houses: 3, amount: 7_000_000 },
        { houses: 4, amount: 8_750_000 }, { houses: 5, amount: 10_500_000 },
      ],
    },
    {
      id: 'lower_parel', name: 'Lower Parel',
      colorGroup: 'red', colorHex: '#DC143C',
      purchasePrice: 2_200_000, mortgageValue: 1_100_000, unmortgageCost: 1_210_000,
      houseCost: 1_500_000, hotelCost: 1_500_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 180_000 }, { houses: 1, amount: 900_000 },
        { houses: 2, amount: 2_500_000 }, { houses: 3, amount: 7_000_000 },
        { houses: 4, amount: 8_750_000 }, { houses: 5, amount: 10_500_000 },
      ],
    },
    {
      id: 'prabhadevi', name: 'Prabhadevi',
      colorGroup: 'red', colorHex: '#DC143C',
      purchasePrice: 2_400_000, mortgageValue: 1_200_000, unmortgageCost: 1_320_000,
      houseCost: 1_500_000, hotelCost: 1_500_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 200_000 }, { houses: 1, amount: 1_000_000 },
        { houses: 2, amount: 3_000_000 }, { houses: 3, amount: 7_500_000 },
        { houses: 4, amount: 9_250_000 }, { houses: 5, amount: 11_000_000 },
      ],
    },
    // ── YELLOW ────────────────────────────────────────────────────────────────
    {
      id: 'nariman_point', name: 'Nariman Point',
      colorGroup: 'yellow', colorHex: '#FFD700',
      purchasePrice: 2_600_000, mortgageValue: 1_300_000, unmortgageCost: 1_430_000,
      houseCost: 1_500_000, hotelCost: 1_500_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 220_000 }, { houses: 1, amount: 1_100_000 },
        { houses: 2, amount: 3_300_000 }, { houses: 3, amount: 8_000_000 },
        { houses: 4, amount: 9_750_000 }, { houses: 5, amount: 11_500_000 },
      ],
    },
    {
      id: 'fort', name: 'Fort',
      colorGroup: 'yellow', colorHex: '#FFD700',
      purchasePrice: 2_600_000, mortgageValue: 1_300_000, unmortgageCost: 1_430_000,
      houseCost: 1_500_000, hotelCost: 1_500_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 220_000 }, { houses: 1, amount: 1_100_000 },
        { houses: 2, amount: 3_300_000 }, { houses: 3, amount: 8_000_000 },
        { houses: 4, amount: 9_750_000 }, { houses: 5, amount: 11_500_000 },
      ],
    },
    {
      id: 'colaba', name: 'Colaba',
      colorGroup: 'yellow', colorHex: '#FFD700',
      purchasePrice: 2_800_000, mortgageValue: 1_400_000, unmortgageCost: 1_540_000,
      houseCost: 1_500_000, hotelCost: 1_500_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 240_000 }, { houses: 1, amount: 1_200_000 },
        { houses: 2, amount: 3_600_000 }, { houses: 3, amount: 8_500_000 },
        { houses: 4, amount: 10_250_000 }, { houses: 5, amount: 12_000_000 },
      ],
    },
    // ── GREEN ─────────────────────────────────────────────────────────────────
    {
      id: 'cuffe_parade', name: 'Cuffe Parade',
      colorGroup: 'green', colorHex: '#228B22',
      purchasePrice: 3_000_000, mortgageValue: 1_500_000, unmortgageCost: 1_650_000,
      houseCost: 2_000_000, hotelCost: 2_000_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 260_000 }, { houses: 1, amount: 1_300_000 },
        { houses: 2, amount: 3_900_000 }, { houses: 3, amount: 9_000_000 },
        { houses: 4, amount: 11_000_000 }, { houses: 5, amount: 12_750_000 },
      ],
    },
    {
      id: 'backbay', name: 'Back Bay',
      colorGroup: 'green', colorHex: '#228B22',
      purchasePrice: 3_000_000, mortgageValue: 1_500_000, unmortgageCost: 1_650_000,
      houseCost: 2_000_000, hotelCost: 2_000_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 260_000 }, { houses: 1, amount: 1_300_000 },
        { houses: 2, amount: 3_900_000 }, { houses: 3, amount: 9_000_000 },
        { houses: 4, amount: 11_000_000 }, { houses: 5, amount: 12_750_000 },
      ],
    },
    {
      id: 'malabar_hill', name: 'Malabar Hill',
      colorGroup: 'green', colorHex: '#228B22',
      purchasePrice: 3_200_000, mortgageValue: 1_600_000, unmortgageCost: 1_760_000,
      houseCost: 2_000_000, hotelCost: 2_000_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 280_000 }, { houses: 1, amount: 1_500_000 },
        { houses: 2, amount: 4_500_000 }, { houses: 3, amount: 10_000_000 },
        { houses: 4, amount: 12_000_000 }, { houses: 5, amount: 14_000_000 },
      ],
    },
    // ── DARK BLUE ─────────────────────────────────────────────────────────────
    {
      id: 'altamount_road', name: 'Altamount Road',
      colorGroup: 'dark_blue', colorHex: '#0072BB',
      purchasePrice: 3_500_000, mortgageValue: 1_750_000, unmortgageCost: 1_925_000,
      houseCost: 2_000_000, hotelCost: 2_000_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 350_000 }, { houses: 1, amount: 1_750_000 },
        { houses: 2, amount: 5_000_000 }, { houses: 3, amount: 11_000_000 },
        { houses: 4, amount: 13_000_000 }, { houses: 5, amount: 15_000_000 },
      ],
    },
    {
      id: 'pedder_road', name: 'Pedder Road',
      colorGroup: 'dark_blue', colorHex: '#0072BB',
      purchasePrice: 4_000_000, mortgageValue: 2_000_000, unmortgageCost: 2_200_000,
      houseCost: 2_000_000, hotelCost: 2_000_000, isStation: false, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 500_000 }, { houses: 1, amount: 2_000_000 },
        { houses: 2, amount: 6_000_000 }, { houses: 3, amount: 14_000_000 },
        { houses: 4, amount: 17_000_000 }, { houses: 5, amount: 20_000_000 },
      ],
    },
    // ── STATIONS ──────────────────────────────────────────────────────────────
    {
      id: 'cst', name: 'CST (Chhatrapati Shivaji Terminus)',
      colorGroup: 'station', colorHex: '#6E6E6E',
      purchasePrice: 2_000_000, mortgageValue: 1_000_000, unmortgageCost: 1_100_000,
      houseCost: 0, hotelCost: 0, isStation: true, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 250_000 }, { houses: 1, amount: 250_000 },
        { houses: 2, amount: 250_000 }, { houses: 3, amount: 250_000 },
        { houses: 4, amount: 250_000 }, { houses: 5, amount: 250_000 },
      ],
      stationRentTiers: [250_000, 500_000, 1_000_000, 2_000_000],
    },
    {
      id: 'dadar', name: 'Dadar Station',
      colorGroup: 'station', colorHex: '#6E6E6E',
      purchasePrice: 2_000_000, mortgageValue: 1_000_000, unmortgageCost: 1_100_000,
      houseCost: 0, hotelCost: 0, isStation: true, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 250_000 }, { houses: 1, amount: 250_000 },
        { houses: 2, amount: 250_000 }, { houses: 3, amount: 250_000 },
        { houses: 4, amount: 250_000 }, { houses: 5, amount: 250_000 },
      ],
      stationRentTiers: [250_000, 500_000, 1_000_000, 2_000_000],
    },
    {
      id: 'thane', name: 'Thane Station',
      colorGroup: 'station', colorHex: '#6E6E6E',
      purchasePrice: 2_000_000, mortgageValue: 1_000_000, unmortgageCost: 1_100_000,
      houseCost: 0, hotelCost: 0, isStation: true, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 250_000 }, { houses: 1, amount: 250_000 },
        { houses: 2, amount: 250_000 }, { houses: 3, amount: 250_000 },
        { houses: 4, amount: 250_000 }, { houses: 5, amount: 250_000 },
      ],
      stationRentTiers: [250_000, 500_000, 1_000_000, 2_000_000],
    },
    {
      id: 'kurla', name: 'Kurla Station',
      colorGroup: 'station', colorHex: '#6E6E6E',
      purchasePrice: 2_000_000, mortgageValue: 1_000_000, unmortgageCost: 1_100_000,
      houseCost: 0, hotelCost: 0, isStation: true, isUtility: false,
      rentTiers: [
        { houses: 0, amount: 250_000 }, { houses: 1, amount: 250_000 },
        { houses: 2, amount: 250_000 }, { houses: 3, amount: 250_000 },
        { houses: 4, amount: 250_000 }, { houses: 5, amount: 250_000 },
      ],
      stationRentTiers: [250_000, 500_000, 1_000_000, 2_000_000],
    },
    // ── UTILITIES ─────────────────────────────────────────────────────────────
    {
      id: 'bses', name: 'BSES (Electricity)',
      colorGroup: 'utility', colorHex: '#C0C0C0',
      purchasePrice: 1_500_000, mortgageValue: 750_000, unmortgageCost: 825_000,
      houseCost: 0, hotelCost: 0, isStation: false, isUtility: true,
      rentTiers: [
        { houses: 0, amount: 0 }, { houses: 1, amount: 0 },
        { houses: 2, amount: 0 }, { houses: 3, amount: 0 },
        { houses: 4, amount: 0 }, { houses: 5, amount: 0 },
      ],
    },
    {
      id: 'bmc', name: 'BMC (Water Works)',
      colorGroup: 'utility', colorHex: '#C0C0C0',
      purchasePrice: 1_500_000, mortgageValue: 750_000, unmortgageCost: 825_000,
      houseCost: 0, hotelCost: 0, isStation: false, isUtility: true,
      rentTiers: [
        { houses: 0, amount: 0 }, { houses: 1, amount: 0 },
        { houses: 2, amount: 0 }, { houses: 3, amount: 0 },
        { houses: 4, amount: 0 }, { houses: 5, amount: 0 },
      ],
    },
  ],
};
