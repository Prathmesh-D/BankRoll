import type { SessionId, EntityId, TransactionId, PropertyId, RuleId, HouseRuleKey } from './primitives';
import type { Entity } from './entity';
import type { NewTransaction } from './transaction';
import type { HouseRules, CustomRule } from './houseRules';
import type { GameSession, SessionSummary } from './session';
import type { AppSettings } from './settings';
import type { EditionConfig } from './edition';

/** Input type for initGame */
export interface NewGameConfig {
  edition: string;               // EditionId
  customEditionConfig?: Partial<EditionConfig>;
  playerNames: string[];
  playerAvatars: string[];
  playerColors?: string[];
  startingBalance?: number;      // Override edition default
  bankFloat?: number;
  houseRules?: Partial<HouseRules>;
}

export interface GameStore {
  // ─── State ────────────────────────────────────────────────────────────────
  session: GameSession | null;
  sessionHistory: SessionSummary[];
  appSettings: AppSettings;

  // ─── Session Actions ──────────────────────────────────────────────────────
  initGame: (config: NewGameConfig) => SessionId;
  restoreSession: (code: string) => 'ok' | 'not_found';
  endGame: () => void;
  archiveSession: (id: SessionId) => void;
  deleteSession: (id: SessionId) => void;

  // ─── Entity Actions ───────────────────────────────────────────────────────
  updateEntity: (id: EntityId, patch: Partial<Entity>) => void;
  bankruptEntity: (id: EntityId) => void;

  // ─── Transaction Actions ──────────────────────────────────────────────────
  executeTransaction: (tx: NewTransaction) => TransactionId;
  undoTransaction: (txId: TransactionId) => void;
  clearUndoEntry: (txId: TransactionId) => void;

  // ─── Property Actions ─────────────────────────────────────────────────────
  mortgageProperty: (entityId: EntityId, propertyId: PropertyId) => void;
  unmortgageProperty: (entityId: EntityId, propertyId: PropertyId) => void;

  // ─── House Rules Actions ──────────────────────────────────────────────────
  toggleHouseRule: (key: HouseRuleKey, value: boolean | number) => void;
  addCustomRule: (rule: Omit<CustomRule, 'id'>) => void;
  updateCustomRule: (id: RuleId, patch: Partial<CustomRule>) => void;
  removeCustomRule: (id: RuleId) => void;

  // ─── Settings ─────────────────────────────────────────────────────────────
  updateAppSettings: (patch: Partial<AppSettings>) => void;
}
