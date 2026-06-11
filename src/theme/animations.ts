import { Easing } from 'react-native-reanimated';

// ─── Spring Configurations ────────────────────────────────────────────────────
export const Springs = {
  /** Crisp, responsive — avatar snap-back, chip press */
  snappy: {
    damping: 18,
    stiffness: 280,
    mass: 1,
  },
  /** Smooth, organic — sheet entrance, balance update */
  gentle: {
    damping: 22,
    stiffness: 180,
    mass: 1,
  },
  /** Playful, celebratory — radial nodes, game start reveal */
  bouncy: {
    damping: 12,
    stiffness: 300,
    mass: 1,
  },
} as const;

// ─── Timing Configurations ────────────────────────────────────────────────────
export const Timings = {
  /** 180ms — hover states, icon state changes */
  fast: { duration: 180 },
  /** 320ms — sheet slides, screen overlays */
  medium: { duration: 320 },
  /** 500ms — screen transitions */
  slow: { duration: 500 },
  /** 400ms ease-out exp — balance counter roll */
  count: { duration: 400 },
} as const;

// ─── Durations (ms) ───────────────────────────────────────────────────────────
export const Durations = {
  fast: 180,
  medium: 320,
  slow: 500,
  count: 400,
  radialStagger: 40,       // Delay between each radial node
  coinArc: 400,            // Transfer animation coin arc
  undoWindow: 15000,       // Undo eligibility window
  snackbarShow: 900,       // Snackbar appear delay after transaction
} as const;

// ─── Transfer Animation Keyframes ─────────────────────────────────────────────
export const TransferAnimation = {
  payerScaleOut: { scale: 0.85, duration: 150 },
  payerScaleIn: { scale: 1.0, duration: 200, delay: 300 },
  receiverScaleIn: { scale: 1.2, duration: 150, delay: 450 },
  receiverScaleOut: { scale: 1.0, duration: 200, delay: 500 },
  coinDelay: 100,
  coinDuration: 400,
  balanceCountDelay: 500,
  snackbarDelay: 900,
} as const;
