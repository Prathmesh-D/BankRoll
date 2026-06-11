import type { GameSession } from '../types/session';
import { generateCode } from '../domain/sessionCode';
import { defaultHouseRules } from '../domain/defaults';

const CURRENT_SCHEMA_VERSION = 2;

type MigrationFn = (session: Record<string, unknown>) => Record<string, unknown>;

const migrations: Record<number, MigrationFn> = {
  // v1 → v2: Add sessionCode, houseRules, ruleChangeLog, schemaVersion, status
  2: (session) => ({
    ...session,
    schemaVersion: 2,
    sessionCode: (session['sessionCode'] as string) ?? generateCode(),
    houseRules: session['houseRules'] ?? defaultHouseRules(),
    ruleChangeLog: (session['ruleChangeLog'] as unknown[]) ?? [],
    status: (session['status'] as string) ?? 'active',
  }),
};

/**
 * Runs forward-only migrations on a raw session object read from storage.
 * Ensures backward compatibility when app is updated.
 */
export function migrateSession(raw: Record<string, unknown>): GameSession {
  let data = raw;
  const version = (data['schemaVersion'] as number) ?? 1;

  for (let v = version + 1; v <= CURRENT_SCHEMA_VERSION; v++) {
    const migration = migrations[v];
    if (migration) {
      data = migration(data);
    }
  }

  return data as unknown as GameSession;
}

export { CURRENT_SCHEMA_VERSION };
