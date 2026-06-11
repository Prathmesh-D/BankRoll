import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import type { GameStore, NewGameConfig } from '../types/store';
import type { GameSession } from '../types/session';
import type { Entity } from '../types/entity';
import type { Transaction } from '../types/transaction';
import type { NewTransaction } from '../types/transaction';
import type { HouseRules } from '../types/houseRules';
import type { AppSettings } from '../types/settings';

import * as StorageAPI from '../infrastructure/storage';
import { migrateSession } from '../infrastructure/migrations';
import { generateUniqueCode } from '../domain/sessionCode';
import { validateTransaction, applyHouseRules, computeBalanceDeltas } from '../domain/transactionEngine';
import { defaultHouseRules, defaultAppSettings, PLAYER_COLOURS, DEFAULT_AVATARS, UNDO_WINDOW_MS } from '../domain/defaults';
import { getEditionConfig } from '../data/editions';

// ─── Custom MMKV Storage Adapter for Zustand ─────────────────────────────────
const mmkvStorage = {
  getItem: (name: string): string | null => {
    return StorageAPI.storage.getString(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    StorageAPI.storage.set(name, value);
  },
  removeItem: (name: string): void => {
    (StorageAPI.storage as any).delete(name);
  },
};

// ─── Store ────────────────────────────────────────────────────────────────────
export const useGameStore = create<GameStore>()(
  immer((set, get) => {
    const activeId = StorageAPI.getActiveSessionId();
    return {
      // ─── Initial State ─────────────────────────────────────────────────────
      session: activeId ? StorageAPI.getSession(activeId) : null,
      sessionHistory: StorageAPI.getSessionSummaries(),
      appSettings: StorageAPI.getAppSettings() ?? defaultAppSettings(),

    // ─── Session Actions ───────────────────────────────────────────────────
    initGame: (config: NewGameConfig): string => {
      const sessionId = uuidv4();
      const sessionCode = generateUniqueCode(StorageAPI.getSessionCodes());

      // Resolve edition config
      let editionConfig = config.customEditionConfig as any;
      if (!editionConfig && config.edition !== 'custom') {
        editionConfig = getEditionConfig(config.edition);
      }

      const now = Date.now();
      const startingBalance = config.startingBalance ?? editionConfig.startingBalance;
      const bankFloat = config.bankFloat ?? editionConfig.bankFloat;

      // Build entities
      const entities: Entity[] = [];

      // Players
      config.playerNames.forEach((name, i) => {
        entities.push({
          id: uuidv4(),
          type: 'player',
          name: name || `Player ${i + 1}`,
          avatar: config.playerAvatars[i] ?? DEFAULT_AVATARS[i % DEFAULT_AVATARS.length],
          color: (config.playerColors?.[i]) ?? PLAYER_COLOURS[i % PLAYER_COLOURS.length],
          balance: startingBalance,
          mortgagedProperties: [],
          isActive: true,
          createdAt: now,
        });
      });

      // Bank entity
      entities.push({
        id: uuidv4(),
        type: 'bank',
        name: 'Bank',
        avatar: 'bank',
        color: '#511F20',
        balance: bankFloat,
        mortgagedProperties: [],
        isActive: true,
        createdAt: now,
      });



      const houseRules: HouseRules = {
        ...defaultHouseRules(editionConfig),
        ...config.houseRules,
      };

      const session: GameSession = {
        id: sessionId,
        sessionCode,
        schemaVersion: 2,
        createdAt: now,
        updatedAt: now,
        edition: config.edition as any,
        editionConfig,
        entities,
        transactions: [],
        undoStack: [],
        houseRules,
        ruleChangeLog: [],
        settings: {
          playerCount: config.playerNames.length,
          startingBalance,
          bankFloat,
          showConfirmOnSalary: false,
          undoWindowMs: UNDO_WINDOW_MS,
          hapticsEnabled: true,
          animationsEnabled: true,
        },
        status: 'active',
      };

      // Persist
      StorageAPI.saveSession(session);
      StorageAPI.setSessionCode(sessionCode, sessionId);
      StorageAPI.setActiveSessionId(sessionId);

      set(state => {
        state.session = session;
        state.sessionHistory = StorageAPI.getSessionSummaries();
      });

      return sessionId;
    },

    restoreSession: (code: string): 'ok' | 'not_found' => {
      const normalizedCode = code.toUpperCase().trim();
      const found = StorageAPI.lookupSessionByCode(normalizedCode);
      if (!found) return 'not_found';

      const migrated = migrateSession(found as unknown as Record<string, unknown>);
      StorageAPI.setActiveSessionId(migrated.id);

      set(state => {
        state.session = migrated;
      });

      return 'ok';
    },

    endGame: (): void => {
      set(state => {
        if (!state.session) return;
        state.session.status = 'ended';
        state.session.updatedAt = Date.now();
      });
      const session = get().session;
      if (session) {
        StorageAPI.saveSession(session);
        set(s => { s.sessionHistory = StorageAPI.getSessionSummaries(); });
      }
    },

    archiveSession: (id: string): void => {
      const session = StorageAPI.getSession(id);
      if (session) {
        session.status = 'archived';
        session.updatedAt = Date.now();
        StorageAPI.saveSession(session);
        set(s => { s.sessionHistory = StorageAPI.getSessionSummaries(); });
      }
    },

    deleteSession: (id: string): void => {
      StorageAPI.deleteSession(id);
      set(state => {
        if (state.session?.id === id) state.session = null;
        state.sessionHistory = state.sessionHistory.filter(s => s.id !== id);
      });
    },

    // ─── Entity Actions ────────────────────────────────────────────────────
    updateEntity: (id: string, patch): void => {
      set(state => {
        if (!state.session) return;
        const entity = state.session.entities.find(e => e.id === id);
        if (entity) Object.assign(entity, patch);
        state.session.updatedAt = Date.now();
      });
      const s = get().session;
      if (s) StorageAPI.saveSession(s);
    },

    bankruptEntity: (id: string): void => {
      const state = get();
      if (!state.session) return;

      const entity = state.session.entities.find(e => e.id === id);
      const bank = state.session.entities.find(e => e.type === 'bank');
      if (!entity || !bank) return;

      const txId = uuidv4();
      const now = Date.now();

      set(s => {
        if (!s.session) return;
        const e = s.session.entities.find(en => en.id === id);
        const b = s.session.entities.find(en => en.type === 'bank');
        if (!e || !b) return;

        // Transfer remaining balance to bank
        if (e.balance > 0) {
          b.balance += e.balance;
          const tx: Transaction = {
            id: txId,
            timestamp: now,
            fromEntityId: e.id,
            toEntityId: b.id,
            amount: e.balance,
            type: 'TRANSFER',
            label: `Bankruptcy — ${e.name}`,
            isReversed: false,
          };
          s.session.transactions.push(tx);
        }
        e.balance = 0;
        e.isActive = false;
        s.session.updatedAt = now;
      });

      const sess = get().session;
      if (sess) StorageAPI.saveSession(sess);
    },

    // ─── Transaction Actions ───────────────────────────────────────────────
    executeTransaction: (tx: NewTransaction): string => {
      const state = get();
      if (!state.session) throw new Error('No active session');

      // Apply house rules before validation
      const adjustedTx = applyHouseRules(tx, state.session.houseRules, state.session);

      const txId = uuidv4();
      const now = Date.now();
      const expiresAt = now + (state.session.settings.undoWindowMs ?? UNDO_WINDOW_MS);

      const transaction: Transaction = {
        id: txId,
        timestamp: now,
        fromEntityId: adjustedTx.fromEntityId,
        toEntityId: adjustedTx.toEntityId,
        amount: adjustedTx.amount,
        type: adjustedTx.type,
        label: adjustedTx.label,
        propertyId: adjustedTx.propertyId,
        houseCount: adjustedTx.houseCount,
        isReversed: false,
      };

      const deltas = computeBalanceDeltas(transaction);

      set(s => {
        if (!s.session) return;
        // Apply balance deltas
        s.session.entities.forEach(entity => {
          if (deltas[entity.id] !== undefined) {
            if (entity.type === 'bank' && s.session!.houseRules.infiniteBankMoney) {
              // Skip updating bank balance if infinite money rule is on
            } else {
              entity.balance += deltas[entity.id];
            }
          }

          // Apply mortgage states
          if (transaction.propertyId) {
             if (transaction.type === 'MORTGAGE' && entity.id === transaction.toEntityId) {
                 entity.mortgagedProperties.push(transaction.propertyId);
             }
             if (transaction.type === 'MORTGAGE_REPAY' && entity.id === transaction.fromEntityId) {
                 entity.mortgagedProperties = entity.mortgagedProperties.filter(id => id !== transaction.propertyId);
             }
          }
        });
        s.session.transactions.push(transaction);
        s.session.undoStack.push({ transactionId: txId, expiresAt });
        s.session.updatedAt = now;
      });

      const sess = get().session;
      if (sess) StorageAPI.saveSession(sess);

      // Auto-clear undo entry after expiry
      setTimeout(() => {
        get().clearUndoEntry(txId);
      }, state.session.settings.undoWindowMs ?? UNDO_WINDOW_MS);

      return txId;
    },

    undoTransaction: (txId: string): void => {
      const state = get();
      if (!state.session) return;

      const original = state.session.transactions.find(t => t.id === txId);
      if (!original || original.isReversed) return;

      const reversalId = uuidv4();
      const now = Date.now();

      // Create reversal transaction (swapped from/to)
      const reversal: Transaction = {
        id: reversalId,
        timestamp: now,
        fromEntityId: original.toEntityId,
        toEntityId: original.fromEntityId,
        amount: original.amount,
        type: 'REVERSAL',
        label: `Undo: ${original.label ?? original.type}`,
        isReversed: false,
      };

      const deltas = computeBalanceDeltas(reversal);

      set(s => {
        if (!s.session) return;
        // Mark original as reversed
        const orig = s.session.transactions.find(t => t.id === txId);
        if (orig) {
          orig.isReversed = true;
          orig.reversedBy = reversalId;
        }
        // Apply reversal deltas
        s.session.entities.forEach(entity => {
          if (deltas[entity.id] !== undefined) {
            if (entity.type === 'bank' && s.session!.houseRules.infiniteBankMoney) {
              // Skip updating bank balance
            } else {
              entity.balance += deltas[entity.id];
            }
          }

          // Reverse mortgage states
          if (orig?.propertyId) {
             if (orig.type === 'MORTGAGE' && entity.id === orig.toEntityId) {
                 entity.mortgagedProperties = entity.mortgagedProperties.filter(id => id !== orig.propertyId);
             }
             if (orig.type === 'MORTGAGE_REPAY' && entity.id === orig.fromEntityId) {
                 entity.mortgagedProperties.push(orig.propertyId);
             }
          }
        });
        s.session.transactions.push(reversal);
        // Remove from undo stack
        s.session.undoStack = s.session.undoStack.filter(
          e => e.transactionId !== txId
        );
        s.session.updatedAt = now;
      });

      const sess = get().session;
      if (sess) StorageAPI.saveSession(sess);
    },

    clearUndoEntry: (txId: string): void => {
      set(s => {
        if (!s.session) return;
        const entry = s.session.undoStack.find(e => e.transactionId === txId);
        if (!entry) return;
        // Only clear if expired
        if (Date.now() >= entry.expiresAt) {
          s.session.undoStack = s.session.undoStack.filter(
            e => e.transactionId !== txId
          );
        }
      });
    },

    // ─── Property Actions ──────────────────────────────────────────────────
    mortgageProperty: (entityId: string, propertyId: string): void => {
      const state = get();
      if (!state.session) return;

      const entity = state.session.entities.find(e => e.id === entityId);
      const bank = state.session.entities.find(e => e.type === 'bank');
      const property = state.session.editionConfig.properties.find(p => p.id === propertyId);
      if (!entity || !bank || !property) return;

      if (entity.mortgagedProperties.includes(propertyId)) return; // Already mortgaged

      set(s => {
        if (!s.session) return;
        const e = s.session.entities.find(en => en.id === entityId);
        if (e) e.mortgagedProperties.push(propertyId);
        s.session.updatedAt = Date.now();
      });

      // Execute mortgage transaction (bank → player)
      get().executeTransaction({
        fromEntityId: bank.id,
        toEntityId: entityId,
        amount: property.mortgageValue,
        type: 'MORTGAGE',
        label: `Mortgage · ${property.name}`,
        propertyId,
      });
    },

    unmortgageProperty: (entityId: string, propertyId: string): void => {
      const state = get();
      if (!state.session) return;

      const bank = state.session.entities.find(e => e.type === 'bank');
      const property = state.session.editionConfig.properties.find(p => p.id === propertyId);
      if (!bank || !property) return;

      set(s => {
        if (!s.session) return;
        const e = s.session.entities.find(en => en.id === entityId);
        if (e) {
          e.mortgagedProperties = e.mortgagedProperties.filter(pid => pid !== propertyId);
        }
        s.session.updatedAt = Date.now();
      });

      // Execute unmortgage transaction (player → bank)
      get().executeTransaction({
        fromEntityId: entityId,
        toEntityId: bank.id,
        amount: property.unmortgageCost,
        type: 'MORTGAGE_REPAY',
        label: `Unmortgage · ${property.name}`,
        propertyId,
      });
    },

    // ─── House Rules Actions ───────────────────────────────────────────────
    toggleHouseRule: (key, value): void => {
      const state = get();
      if (!state.session) return;

      const oldValue = (state.session.houseRules as any)[key];
      const now = Date.now();

      set(s => {
        if (!s.session) return;
        (s.session.houseRules as any)[key] = value;
        s.session.ruleChangeLog.push({
          timestamp: now,
          ruleKey: key,
          oldValue,
          newValue: value,
        });
        s.session.updatedAt = now;
      });

      const sess = get().session;
      if (sess) StorageAPI.saveSession(sess);
    },

    addCustomRule: (rule): void => {
      const state = get();
      if (!state.session) return;
      if (state.session.houseRules.customRules.length >= 10) return;

      const newRule = { ...rule, id: uuidv4() };

      set(s => {
        if (!s.session) return;
        s.session.houseRules.customRules.push(newRule);
        s.session.updatedAt = Date.now();
      });

      const sess = get().session;
      if (sess) StorageAPI.saveSession(sess);
    },

    updateCustomRule: (id, patch): void => {
      set(s => {
        if (!s.session) return;
        const rule = s.session.houseRules.customRules.find(r => r.id === id);
        if (rule) Object.assign(rule, patch);
        s.session.updatedAt = Date.now();
      });
      const sess = get().session;
      if (sess) StorageAPI.saveSession(sess);
    },

    removeCustomRule: (id): void => {
      set(s => {
        if (!s.session) return;
        s.session.houseRules.customRules = s.session.houseRules.customRules.filter(
          r => r.id !== id
        );
        s.session.updatedAt = Date.now();
      });
      const sess = get().session;
      if (sess) StorageAPI.saveSession(sess);
    },

    // ─── Settings ──────────────────────────────────────────────────────────
    updateAppSettings: (patch): void => {
      set(s => {
        Object.assign(s.appSettings, patch);
      });
      StorageAPI.saveAppSettings(get().appSettings);
    },
  };
  })
);
