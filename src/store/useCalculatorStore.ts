import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { CalculatorHistoryEntry } from '../types/settings';
import { getCalculatorHistory, saveCalculatorHistory } from '../infrastructure/storage';

interface CalculatorState {
  isVisible: boolean;
  display: string;
  expression: string;
  memory: number;
  history: CalculatorHistoryEntry[];
  prefilledAmount: number | null; // Set when "Pay This Amount" is used

  // Actions
  show: () => void;
  hide: () => void;
  toggle: () => void;
  setDisplay: (value: string) => void;
  appendDigit: (digit: string) => void;
  appendDecimal: () => void;
  appendOperator: (op: string) => void;
  calculate: () => void;
  clear: () => void;
  clearAll: () => void;
  prefillBalance: (balance: number) => void;
  payThisAmount: () => number | null;
  memoryStore: () => void;
  memoryRecall: () => void;
  memoryClear: () => void;
  loadHistory: () => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  immer((set, get) => ({
    isVisible: false,
    display: '0',
    expression: '',
    memory: 0,
    history: [],
    prefilledAmount: null,

    show: () => set(s => { s.isVisible = true; }),
    hide: () => set(s => {
      s.isVisible = false;
      s.prefilledAmount = null;
    }),
    toggle: () => set(s => { s.isVisible = !s.isVisible; }),

    setDisplay: (value: string) => set(s => { s.display = value; }),

    appendDigit: (digit: string) => set(s => {
      if (s.display === '0' || s.display === 'Error') {
        s.display = digit;
      } else {
        s.display = s.display + digit;
      }
    }),

    appendDecimal: () => set(s => {
      if (!s.display.includes('.')) {
        s.display = s.display + '.';
      }
    }),

    appendOperator: (op: string) => set(s => {
      s.expression = s.expression + s.display + op;
      s.display = '0';
    }),

    calculate: () => {
      const state = get();
      const fullExpression = state.expression + state.display;
      try {
        // Safe evaluation — only allow digits, operators, decimals, spaces
        const sanitized = fullExpression.replace(/[^0-9+\-*/.()\s]/g, '');
        // eslint-disable-next-line no-eval
        const result = Math.round(eval(sanitized));
        const entry: CalculatorHistoryEntry = {
          result,
          expression: fullExpression,
          timestamp: Date.now(),
        };
        const newHistory = [...get().history, entry].slice(-10);
        set(s => {
          s.display = String(result);
          s.expression = '';
          s.history = newHistory;
        });
        saveCalculatorHistory(newHistory);
      } catch {
        set(s => { s.display = 'Error'; s.expression = ''; });
      }
    },

    clear: () => set(s => { s.display = '0'; }),
    clearAll: () => set(s => { s.display = '0'; s.expression = ''; }),

    prefillBalance: (balance: number) => set(s => {
      s.display = String(balance);
      s.isVisible = true;
    }),

    payThisAmount: (): number | null => {
      const state = get();
      const amount = parseInt(state.display, 10);
      if (isNaN(amount) || amount <= 0) return null;
      set(s => { s.prefilledAmount = amount; s.isVisible = false; });
      return amount;
    },

    memoryStore: () => set(s => {
      s.memory = parseFloat(s.display) || 0;
    }),

    memoryRecall: () => set(s => {
      s.display = String(s.memory);
    }),

    memoryClear: () => set(s => { s.memory = 0; }),

    loadHistory: () => {
      const history = getCalculatorHistory();
      set(s => { s.history = history; });
    },
  }))
);
