// ─── ID Type Aliases ──────────────────────────────────────────────────────────
export type SessionId = string;     // UUID v4
export type EntityId = string;      // UUID v4
export type TransactionId = string; // UUID v4
export type PropertyId = string;    // Stable slug e.g. "mayfair"
export type RuleId = string;        // UUID v4

// ─── Edition ──────────────────────────────────────────────────────────────────
export type EditionId =
  | 'standard_us'
  | 'standard_uk'
  | 'standard_in'
  | 'custom';

// ─── Entity ───────────────────────────────────────────────────────────────────
export type EntityType =
  | 'player'
  | 'bank'
  | 'community_chest'
  | 'custom';

// ─── Transaction ──────────────────────────────────────────────────────────────
export type TransactionType =
  | 'TRANSFER'
  | 'SALARY'
  | 'RENT'
  | 'PURCHASE'
  | 'HOUSE_HOTEL'
  | 'MORTGAGE'
  | 'MORTGAGE_REPAY'
  | 'TAX'
  | 'FINE'
  | 'AUCTION_WIN'
  | 'REVERSAL'
  | 'CUSTOM';

// ─── House Rules ──────────────────────────────────────────────────────────────
export type HouseRuleKey =
  | 'startingBonus'
  | 'allowNegative100'
  | 'infiniteBankMoney';
