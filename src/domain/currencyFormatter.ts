import type { CurrencyConfig } from '../types/edition';

/**
 * Formats a monetary amount according to the edition's currency config.
 * All amounts are integers — no floating point.
 */
export function formatBalance(amount: number, config: CurrencyConfig): string {
  if (config.notation === 'indian') {
    return formatIndian(amount, config.symbol);
  }

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback if Intl fails
    return `${config.symbol}${Math.abs(amount).toLocaleString()}`;
  }
}

/**
 * Indian locale number formatter using lakh/crore abbreviations.
 * Handles negative values.
 */
export function formatIndian(amount: number, symbol: string): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 10_000_000) {
    const cr = abs / 10_000_000;
    const formatted = cr % 1 === 0 ? `${cr}` : cr.toFixed(1);
    return `${sign}${symbol}${formatted}Cr`;
  }
  if (abs >= 100_000) {
    const lakh = abs / 100_000;
    const formatted = lakh % 1 === 0 ? `${lakh}` : lakh.toFixed(1);
    return `${sign}${symbol}${formatted}L`;
  }
  // Standard Indian grouping below 1 lakh (custom, not relying on en-IN Intl)
  return `${sign}${symbol}${formatIndianRaw(abs)}`;
}

/**
 * Custom Indian number grouping (2-2-3 from right) for values below 1 lakh.
 * We avoid en-IN Intl.NumberFormat due to inconsistency across iOS/Android.
 */
function formatIndianRaw(n: number): string {
  const s = n.toString();
  if (s.length <= 3) return s;
  if (s.length <= 5) return `${s.slice(0, s.length - 3)},${s.slice(-3)}`;
  return `${s.slice(0, s.length - 5)},${s.slice(-5, -3)},${s.slice(-3)}`;
}

/**
 * Screen-reader friendly balance string.
 * Announces "15 lakh" instead of "1500000" for Indian edition.
 */
export function speakBalance(amount: number, config: CurrencyConfig): string {
  if (config.notation === 'indian') {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? 'negative ' : '';
    if (abs >= 10_000_000) {
      return `${sign}${config.symbol}${(abs / 10_000_000).toFixed(1)} crore`;
    }
    if (abs >= 100_000) {
      return `${sign}${config.symbol}${(abs / 100_000).toFixed(1)} lakh`;
    }
  }
  return formatBalance(amount, config);
}

/**
 * Formats an amount for display in chips/buttons (shorter format).
 */
export function formatChip(amount: number, symbol: string): string {
  if (amount >= 1_000_000) return `${symbol}${amount / 1_000_000}M`;
  if (amount >= 1_000) return `${symbol}${amount / 1_000}K`;
  return `${symbol}${amount}`;
}
