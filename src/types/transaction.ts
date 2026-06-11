import type { EntityId, PropertyId, TransactionId, TransactionType } from './primitives';

export interface Transaction {
  id: TransactionId;
  timestamp: number;           // Unix ms
  fromEntityId: EntityId;
  toEntityId: EntityId;
  amount: number;              // Always positive integer. Direction = from → to.
  type: TransactionType;
  label?: string;              // Human label e.g. "Rent · Mayfair"
  propertyId?: PropertyId;    // For RENT, HOUSE_HOTEL, MORTGAGE flows
  houseCount?: number;         // For HOUSE_HOTEL transactions
  isReversed: boolean;         // true after undo
  reversedBy?: TransactionId; // Points to the REVERSAL transaction
}

/** Input type for executeTransaction — store fills id, timestamp, isReversed */
export interface NewTransaction {
  fromEntityId: EntityId;
  toEntityId: EntityId;
  amount: number;
  type: TransactionType;
  label?: string;
  propertyId?: PropertyId;
  houseCount?: number;
}

export interface UndoEntry {
  transactionId: TransactionId;
  expiresAt: number;           // Unix ms = timestamp + undoWindowMs
}
