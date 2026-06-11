import type { RuleId } from './primitives';
import type { HouseRuleKey } from './primitives';

export interface HouseRules {
  startingBonus: number;         // Default: edition salary
  allowNegative100: boolean;         // Default: false
  infiniteBankMoney: boolean;      // Default: false
  customRules: CustomRule[];     // Max 10
}

export interface CustomRule {
  id: RuleId;
  name: string;                  // e.g. "Loan Interest Rate"
  value?: number;                // e.g. 10 (%)
  description?: string;
  isActive: boolean;
}

export interface RuleChangeLogEntry {
  timestamp: number;
  ruleKey: HouseRuleKey | 'customRule';
  ruleId?: RuleId;               // For custom rules
  oldValue: unknown;
  newValue: unknown;
  changedBy?: string;            // Future: entity name
}
