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

// ─── Safe Expression Evaluator ────────────────────────────────────────────────
// Replaces eval() with a Shunting-Yard + RPN evaluator.
// Only handles: integers/decimals, +, -, *, /
// Returns null on any invalid input instead of throwing.
function safeEvaluate(expression: string): number | null {
  try {
    const tokens = tokenize(expression);
    if (!tokens) return null;
    const rpn = toRPN(tokens);
    if (!rpn) return null;
    return evaluateRPN(rpn);
  } catch {
    return null;
  }
}

type Token = { type: 'number'; value: number } | { type: 'op'; value: string };

const OPERATORS: Record<string, { precedence: number; leftAssoc: boolean }> = {
  '+': { precedence: 1, leftAssoc: true },
  '-': { precedence: 1, leftAssoc: true },
  '*': { precedence: 2, leftAssoc: true },
  '/': { precedence: 2, leftAssoc: true },
};

function tokenize(expr: string): Token[] | null {
  const sanitized = expr.replace(/\s/g, '');
  if (!sanitized) return null;
  const tokens: Token[] = [];
  let i = 0;
  while (i < sanitized.length) {
    const ch = sanitized[i];
    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      let hasDot = false;
      while (i < sanitized.length && /[0-9.]/.test(sanitized[i])) {
        if (sanitized[i] === '.') {
          if (hasDot) return null; // two dots = invalid
          hasDot = true;
        }
        numStr += sanitized[i];
        i++;
      }
      const val = parseFloat(numStr);
      if (isNaN(val)) return null;
      tokens.push({ type: 'number', value: val });
    } else if (ch in OPERATORS) {
      // Handle unary minus at start or after operator
      if (ch === '-' && (tokens.length === 0 || tokens[tokens.length - 1].type === 'op')) {
        tokens.push({ type: 'number', value: 0 }); // treat as 0 - x
      }
      tokens.push({ type: 'op', value: ch });
      i++;
    } else {
      return null; // unexpected character
    }
  }
  return tokens;
}

function toRPN(tokens: Token[]): Token[] | null {
  const output: Token[] = [];
  const opStack: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      output.push(token);
    } else if (token.type === 'op') {
      const op = OPERATORS[token.value];
      if (!op) return null;
      while (opStack.length > 0) {
        const top = opStack[opStack.length - 1];
        if (top.type !== 'op') break;
        const topOp = OPERATORS[top.value];
        if (!topOp) break;
        if ((op.leftAssoc && op.precedence <= topOp.precedence) ||
            (!op.leftAssoc && op.precedence < topOp.precedence)) {
          output.push(opStack.pop()!);
        } else {
          break;
        }
      }
      opStack.push(token);
    }
  }

  while (opStack.length > 0) {
    const top = opStack.pop()!;
    output.push(top);
  }

  return output;
}

function evaluateRPN(rpn: Token[]): number | null {
  const stack: number[] = [];
  for (const token of rpn) {
    if (token.type === 'number') {
      stack.push(token.value);
    } else {
      if (stack.length < 2) return null;
      const b = stack.pop()!;
      const a = stack.pop()!;
      switch (token.value) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/':
          if (b === 0) return null; // division by zero
          stack.push(a / b);
          break;
        default: return null;
      }
    }
  }
  if (stack.length !== 1) return null;
  return stack[0];
}

// ─── Store ────────────────────────────────────────────────────────────────────
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
        // Prevent excessively long numbers
        if (s.display.replace('-', '').replace('.', '').length >= 10) return;
        s.display = s.display + digit;
      }
    }),

    appendDecimal: () => set(s => {
      if (!s.display.includes('.')) {
        s.display = s.display + '.';
      }
    }),

    appendOperator: (op: string) => set(s => {
      if (!(op in OPERATORS)) return; // guard against invalid operators
      // If display is 'Error', reset first
      if (s.display === 'Error') {
        s.display = '0';
        s.expression = '';
        return;
      }
      s.expression = s.expression + s.display + op;
      s.display = '0';
    }),

    calculate: () => {
      const state = get();
      const fullExpression = state.expression + state.display;
      const result = safeEvaluate(fullExpression);

      if (result === null || !isFinite(result)) {
        set(s => { s.display = 'Error'; s.expression = ''; });
        return;
      }

      const rounded = Math.round(result);
      const entry: CalculatorHistoryEntry = {
        result: rounded,
        expression: fullExpression,
        timestamp: Date.now(),
      };
      const newHistory = [...get().history, entry].slice(-10);
      set(s => {
        s.display = String(rounded);
        s.expression = '';
        s.history = newHistory;
      });
      saveCalculatorHistory(newHistory);
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
