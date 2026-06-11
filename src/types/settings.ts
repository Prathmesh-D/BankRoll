import type { SessionId } from './primitives';

export interface AppSettings {
  theme: 'system' | 'light' | 'dark';
  hapticsEnabled: boolean;
  animationsEnabled: boolean;
  reduceMotion: boolean;        // Overrides animationsEnabled for accessibility
  gesturelessMode: boolean;     // All gestures replaced by button equivalents
  lastOpenedSessionId?: SessionId;
}

export interface CalculatorHistoryEntry {
  result: number;
  expression: string;           // e.g. "1500 + 200"
  timestamp: number;
}
