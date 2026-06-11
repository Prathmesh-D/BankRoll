import type { EntityId, PropertyId } from './primitives';
import type { EntityType } from './primitives';

export interface Entity {
  id: EntityId;
  type: EntityType;
  name: string;                  // Max 20 chars
  avatar: string;                // Emoji char or single capital letter
  color: string;                 // Hex colour from player palette
  balance: number;               // Integer. Negative = in debt.
  mortgagedProperties: PropertyId[];
  isActive: boolean;             // false = bankrupt
  createdAt: number;             // Unix ms
}
