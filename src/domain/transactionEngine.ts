import type { NewTransaction, Transaction } from '../types/transaction';
import type { GameSession } from '../types/session';
import type { HouseRules } from '../types/houseRules';
import type { EntityId } from '../types/primitives';

export type ValidationResult =
  | 'ok'
  | 'insufficient_funds'
  | 'entity_inactive'
  | 'invalid_amount';

/**
 * Validates a proposed transaction against current session state.
 * Returns 'ok' or an error code — never throws.
 * Note: insufficient_funds is advisory — real Monopoly allows loans.
 */
export function validateTransaction(
  tx: NewTransaction,
  session: GameSession
): ValidationResult {
  const from = session.entities.find(e => e.id === tx.fromEntityId);
  const to = session.entities.find(e => e.id === tx.toEntityId);

  if (!from || !to) return 'entity_inactive';
  if (!from.isActive || !to.isActive) return 'entity_inactive';
  if (!tx.amount || tx.amount <= 0) return 'invalid_amount';

  // Advisory only — negative balance is allowed (loan scenario)
  if (from.balance < tx.amount && from.type === 'player') {
    return 'insufficient_funds';
  }

  return 'ok';
}

/**
 * Applies house rules to a transaction before execution.
 * Returns a potentially modified copy of the transaction.
 */
export function applyHouseRules(
  tx: NewTransaction,
  rules: HouseRules,
  session: GameSession
): NewTransaction {
  const mutable = { ...tx };


  // Starting bonus override: replace SALARY amount with configured bonus
  if (tx.type === 'SALARY') {
    mutable.amount = rules.startingBonus;
  }

  return mutable;
}

/**
 * Computes the balance delta for each entity after a transaction.
 * Payer balance decreases, receiver balance increases.
 */
export function computeBalanceDeltas(
  tx: Pick<Transaction, 'fromEntityId' | 'toEntityId' | 'amount'>
): Record<EntityId, number> {
  return {
    [tx.fromEntityId]: -tx.amount,
    [tx.toEntityId]: +tx.amount,
  };
}

/**
 * Checks if a transaction amount would result in insufficient funds.
 * (Advisory — does not block the transaction.)
 */
export function getShortfallAmount(
  tx: NewTransaction,
  session: GameSession
): number {
  const from = session.entities.find(e => e.id === tx.fromEntityId);
  if (!from || from.type !== 'player') return 0;
  return Math.max(0, tx.amount - from.balance);
}
