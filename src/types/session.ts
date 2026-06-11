import type { SessionId, EditionId } from './primitives';
import type { Entity } from './entity';
import type { Transaction, UndoEntry } from './transaction';
import type { HouseRules, RuleChangeLogEntry } from './houseRules';
import type { EditionConfig } from './edition';

export interface GameSettings {
  playerCount: number;
  startingBalance: number;
  bankFloat: number;
  showConfirmOnSalary: boolean; // Default: false (instant)
  undoWindowMs: number;         // Default: 15000
  hapticsEnabled: boolean;
  animationsEnabled: boolean;
}

export interface GameSession {
  id: SessionId;
  sessionCode: string;          // e.g. "BNK-7X4"
  schemaVersion: number;        // Current: 2
  createdAt: number;            // Unix ms
  updatedAt: number;            // Unix ms
  edition: EditionId;
  editionConfig: EditionConfig; // Snapshot at game start
  entities: Entity[];
  transactions: Transaction[];  // Append-only
  undoStack: UndoEntry[];
  houseRules: HouseRules;
  ruleChangeLog: RuleChangeLogEntry[];
  settings: GameSettings;
  status: 'active' | 'ended' | 'archived';
}

/** Lightweight summary for home screen session list */
export interface SessionSummary {
  id: SessionId;
  sessionCode: string;
  edition: EditionId;
  playerNames: string[];
  transactionCount: number;
  createdAt: number;
  updatedAt: number;
  status: 'active' | 'ended' | 'archived';
}
