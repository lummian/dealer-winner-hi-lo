import type { CountingSystem, CountingValues, Rank, ShoeState, TableRules } from './types';

export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'A'];

export const COUNT_VALUES: Record<CountingSystem, CountingValues> = {
  'hi-lo': {
    '2': +1, '3': +1, '4': +1, '5': +1, '6': +1,
    '7': 0, '8': 0, '9': 0, 'T': -1, 'A': -1
  },
  ko: {
    '2': +1, '3': +1, '4': +1, '5': +1, '6': +1,
    '7': +1, '8': 0, '9': 0, 'T': -1, 'A': -1
  },
  'hi-opt-i': {
    '2': 0, '3': +1, '4': +1, '5': +1, '6': +1,
    '7': 0, '8': 0, '9': 0, 'T': -1, 'A': 0
  }
};

export const SYSTEM_LABELS: Record<CountingSystem, string> = {
  'hi-lo': 'Hi-Lo',
  ko: 'KO',
  'hi-opt-i': 'Hi-Opt I'
};

export const SYSTEM_BALANCED: Record<CountingSystem, boolean> = {
  'hi-lo': true,
  ko: false,
  'hi-opt-i': true
};

export function totalCardsForDecks(decks: number): number {
  return decks * 52;
}

export function decksRemaining(state: ShoeState): number {
  const remainingCards = state.totalCards - state.dealtCount;
  return Math.max(remainingCards / 52, 0);
}

export function trueCount(runningCount: number, decksLeft: number): number {
  if (decksLeft <= 0) return 0;
  const tc = runningCount / decksLeft;
  return tc >= 0 ? Math.floor(tc) : Math.ceil(tc);
}

export function trueCountRaw(runningCount: number, decksLeft: number): number {
  if (decksLeft <= 0) return 0;
  return runningCount / decksLeft;
}

export function playerEdgePct(tc: number): number {
  return (tc - 1) * 0.5;
}

export function penetrationReached(state: ShoeState, rules: TableRules): boolean {
  const dealtPct = (state.dealtCount / state.totalCards) * 100;
  return dealtPct >= rules.penetrationPct;
}

export function newShoe(decks: number): ShoeState {
  return {
    totalCards: totalCardsForDecks(decks),
    dealtCount: 0,
    runningCount: 0,
    history: []
  };
}

export function applyCard(
  state: ShoeState,
  rank: Rank,
  system: CountingSystem
): ShoeState {
  const delta = COUNT_VALUES[system][rank];
  return {
    ...state,
    dealtCount: state.dealtCount + 1,
    runningCount: state.runningCount + delta,
    history: [...state.history, { rank, countDelta: delta, ts: Date.now() }]
  };
}

export function undoLast(state: ShoeState): ShoeState {
  if (state.history.length === 0) return state;
  const last = state.history[state.history.length - 1];
  return {
    ...state,
    dealtCount: state.dealtCount - 1,
    runningCount: state.runningCount - last.countDelta,
    history: state.history.slice(0, -1)
  };
}
