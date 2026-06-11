// ─── Session Code Generator ───────────────────────────────────────────────────
// Charset excludes ambiguous glyphs: 0, O, I, 1
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generatePart(n: number): string {
  return Array.from({ length: n }, () =>
    CHARSET[Math.floor(Math.random() * CHARSET.length)]
  ).join('');
}

/**
 * Generates a session code in format "BNK-XXX" (3-char prefix + 3-char suffix)
 * Prefix is always "BNK" for BankRoll branding
 */
export function generateCode(): string {
  return `BNK-${generatePart(3)}`;
}

/**
 * Generates a unique session code not already in the existing codes map.
 */
export function generateUniqueCode(existingCodes: Record<string, string>): string {
  let code: string;
  let attempts = 0;
  do {
    code = generateCode();
    attempts++;
    if (attempts > 1000) {
      // Extremely unlikely — fall back to full 6-char random
      code = `${generatePart(3)}-${generatePart(3)}`;
    }
  } while (existingCodes[code]);
  return code;
}

/**
 * Formats a raw code string to canonical display format.
 * e.g. "BNK7X4" → "BNK-7X4" or "bnk7x4" → "BNK-7X4"
 */
export function formatCode(raw: string): string {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (clean.length <= 3) return clean;
  return `${clean.slice(0, 3)}-${clean.slice(3, 6)}`;
}

/**
 * Validates that a code string is in the correct format.
 */
export function isValidCode(code: string): boolean {
  return /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(code);
}
