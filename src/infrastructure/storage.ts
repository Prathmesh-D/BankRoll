import { createMMKV } from 'react-native-mmkv';
import type { GameSession, SessionSummary } from '../types/session';
import type { AppSettings } from '../types/settings';
import type { CalculatorHistoryEntry } from '../types/settings';

// ─── MMKV Instance ────────────────────────────────────────────────────────────
export const storage = createMMKV();

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const KEYS = {
  SCHEMA_VERSION: 'schema_version',
  ACTIVE_SESSION_ID: 'active_session_id',
  SESSION_IDS: 'session_ids',
  SESSION_CODES: 'session_codes',
  APP_SETTINGS: 'app_settings',
  CALCULATOR_HISTORY: 'calculator_history',
  sessionKey: (id: string) => `session:${id}`,
} as const;

// ─── Generic Helpers ──────────────────────────────────────────────────────────
function getJSON<T>(key: string): T | null {
  const raw = storage.getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setJSON<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

// ─── Session Operations ───────────────────────────────────────────────────────
export function getSession(id: string): GameSession | null {
  return getJSON<GameSession>(KEYS.sessionKey(id));
}

export function saveSession(session: GameSession): void {
  setJSON(KEYS.sessionKey(session.id), session);
  // Update session IDs index
  const ids = getSessionIds();
  if (!ids.includes(session.id)) {
    ids.push(session.id);
    setJSON(KEYS.SESSION_IDS, ids);
  }
}

export function deleteSession(id: string): void {
  storage.remove(KEYS.sessionKey(id));
  const ids = getSessionIds().filter(sid => sid !== id);
  setJSON(KEYS.SESSION_IDS, ids);
  // Remove from code map
  const codes = getSessionCodes();
  const entry = Object.entries(codes).find(([, sid]) => sid === id);
  if (entry) {
    delete codes[entry[0]];
    setJSON(KEYS.SESSION_CODES, codes);
  }
}

export function getSessionIds(): string[] {
  return getJSON<string[]>(KEYS.SESSION_IDS) ?? [];
}

export function getAllSessions(): GameSession[] {
  const ids = getSessionIds();
  return ids
    .map(id => getSession(id))
    .filter((s): s is GameSession => s !== null);
}

export function getSessionSummaries(): SessionSummary[] {
  return getAllSessions().map(session => ({
    id: session.id,
    sessionCode: session.sessionCode,
    edition: session.edition as any,
    playerNames: session.entities
      .filter(e => e.type === 'player')
      .map(e => e.name),
    transactionCount: session.transactions.filter(t => !t.isReversed).length,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    status: session.status,
  }));
}

// ─── Session Code Operations ──────────────────────────────────────────────────
export function getSessionCodes(): Record<string, string> {
  return getJSON<Record<string, string>>(KEYS.SESSION_CODES) ?? {};
}

export function setSessionCode(code: string, sessionId: string): void {
  const codes = getSessionCodes();
  codes[code] = sessionId;
  setJSON(KEYS.SESSION_CODES, codes);
}

export function lookupSessionByCode(code: string): GameSession | null {
  const codes = getSessionCodes();
  const id = codes[code.toUpperCase()];
  if (!id) return null;
  return getSession(id);
}

// ─── Active Session Operations ────────────────────────────────────────────────
export function getActiveSessionId(): string | null {
  return storage.getString(KEYS.ACTIVE_SESSION_ID) ?? null;
}

export function setActiveSessionId(id: string | null): void {
  if (id === null) {
    storage.remove(KEYS.ACTIVE_SESSION_ID);
  } else {
    storage.set(KEYS.ACTIVE_SESSION_ID, id);
  }
}

// ─── App Settings Operations ──────────────────────────────────────────────────
export function getAppSettings(): AppSettings | null {
  return getJSON<AppSettings>(KEYS.APP_SETTINGS);
}

export function saveAppSettings(settings: AppSettings): void {
  setJSON(KEYS.APP_SETTINGS, settings);
}

// ─── Calculator History Operations ────────────────────────────────────────────
export function getCalculatorHistory(): CalculatorHistoryEntry[] {
  return getJSON<CalculatorHistoryEntry[]>(KEYS.CALCULATOR_HISTORY) ?? [];
}

export function saveCalculatorHistory(history: CalculatorHistoryEntry[]): void {
  // Keep only last 10 entries
  setJSON(KEYS.CALCULATOR_HISTORY, history.slice(-10));
}

// ─── Schema Version ───────────────────────────────────────────────────────────
export function getSchemaVersion(): number {
  const v = storage.getString(KEYS.SCHEMA_VERSION);
  return v ? parseInt(v, 10) : 1;
}

export function setSchemaVersion(version: number): void {
  storage.set(KEYS.SCHEMA_VERSION, String(version));
}

// ─── Clear All (for testing/reset) ───────────────────────────────────────────
export function clearAll(): void {
  storage.clearAll();
}
