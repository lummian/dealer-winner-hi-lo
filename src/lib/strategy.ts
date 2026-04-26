import type { Rank, TableRules } from './types';

export type Action = 'H' | 'S' | 'D' | 'P' | 'R' | 'Ds' | 'Rh' | 'Rs' | 'Rp';

export const ACTION_LABEL: Record<Action, string> = {
  H: 'Pedir (Hit)',
  S: 'Plantarse (Stand)',
  D: 'Doblar (Double)',
  P: 'Dividir (Split)',
  R: 'Rendirse (Surrender)',
  Ds: 'Doblar / Plantarse',
  Rh: 'Rendirse / Pedir',
  Rs: 'Rendirse / Plantarse',
  Rp: 'Rendirse / Dividir'
};

export const ACTION_SHORT: Record<Action, string> = {
  H: 'HIT', S: 'STAND', D: 'DOUBLE', P: 'SPLIT',
  R: 'SURRENDER', Ds: 'DOUBLE/STAND', Rh: 'SURR/HIT', Rs: 'SURR/STAND', Rp: 'SURR/SPLIT'
};

export type DealerUpcard = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'A';

export const DEALER_UPCARDS: DealerUpcard[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'A'];

export type HandKind = 'hard' | 'soft' | 'pair';

export interface HandInput {
  kind: HandKind;
  total: number;
  pairRank?: Rank;
  upcard: DealerUpcard;
  canDouble: boolean;
  canSurrender: boolean;
  canSplit: boolean;
}

const HARD: Record<number, Record<DealerUpcard, Action>> = {
  5:  { '2':'H','3':'H','4':'H','5':'H','6':'H','7':'H','8':'H','9':'H','T':'H','A':'H' },
  6:  { '2':'H','3':'H','4':'H','5':'H','6':'H','7':'H','8':'H','9':'H','T':'H','A':'H' },
  7:  { '2':'H','3':'H','4':'H','5':'H','6':'H','7':'H','8':'H','9':'H','T':'H','A':'H' },
  8:  { '2':'H','3':'H','4':'H','5':'H','6':'H','7':'H','8':'H','9':'H','T':'H','A':'H' },
  9:  { '2':'H','3':'D','4':'D','5':'D','6':'D','7':'H','8':'H','9':'H','T':'H','A':'H' },
  10: { '2':'D','3':'D','4':'D','5':'D','6':'D','7':'D','8':'D','9':'D','T':'H','A':'H' },
  11: { '2':'D','3':'D','4':'D','5':'D','6':'D','7':'D','8':'D','9':'D','T':'D','A':'H' },
  12: { '2':'H','3':'H','4':'S','5':'S','6':'S','7':'H','8':'H','9':'H','T':'H','A':'H' },
  13: { '2':'S','3':'S','4':'S','5':'S','6':'S','7':'H','8':'H','9':'H','T':'H','A':'H' },
  14: { '2':'S','3':'S','4':'S','5':'S','6':'S','7':'H','8':'H','9':'H','T':'H','A':'H' },
  15: { '2':'S','3':'S','4':'S','5':'S','6':'S','7':'H','8':'H','9':'H','T':'Rh','A':'H' },
  16: { '2':'S','3':'S','4':'S','5':'S','6':'S','7':'H','8':'H','9':'Rh','T':'Rh','A':'Rh' },
  17: { '2':'S','3':'S','4':'S','5':'S','6':'S','7':'S','8':'S','9':'S','T':'S','A':'Rs' },
  18: { '2':'S','3':'S','4':'S','5':'S','6':'S','7':'S','8':'S','9':'S','T':'S','A':'S' },
  19: { '2':'S','3':'S','4':'S','5':'S','6':'S','7':'S','8':'S','9':'S','T':'S','A':'S' },
  20: { '2':'S','3':'S','4':'S','5':'S','6':'S','7':'S','8':'S','9':'S','T':'S','A':'S' },
  21: { '2':'S','3':'S','4':'S','5':'S','6':'S','7':'S','8':'S','9':'S','T':'S','A':'S' }
};

const SOFT: Record<number, Record<DealerUpcard, Action>> = {
  13: { '2':'H','3':'H','4':'H','5':'D','6':'D','7':'H','8':'H','9':'H','T':'H','A':'H' },
  14: { '2':'H','3':'H','4':'D','5':'D','6':'D','7':'H','8':'H','9':'H','T':'H','A':'H' },
  15: { '2':'H','3':'H','4':'D','5':'D','6':'D','7':'H','8':'H','9':'H','T':'H','A':'H' },
  16: { '2':'H','3':'H','4':'D','5':'D','6':'D','7':'H','8':'H','9':'H','T':'H','A':'H' },
  17: { '2':'H','3':'D','4':'D','5':'D','6':'D','7':'H','8':'H','9':'H','T':'H','A':'H' },
  18: { '2':'Ds','3':'Ds','4':'Ds','5':'Ds','6':'Ds','7':'S','8':'S','9':'H','T':'H','A':'H' },
  19: { '2':'S','3':'S','4':'S','5':'S','6':'S','7':'S','8':'S','9':'S','T':'S','A':'S' },
  20: { '2':'S','3':'S','4':'S','5':'S','6':'S','7':'S','8':'S','9':'S','T':'S','A':'S' },
  21: { '2':'S','3':'S','4':'S','5':'S','6':'S','7':'S','8':'S','9':'S','T':'S','A':'S' }
};

const PAIR: Record<string, Record<DealerUpcard, Action>> = {
  '2': { '2':'P','3':'P','4':'P','5':'P','6':'P','7':'P','8':'H','9':'H','T':'H','A':'H' },
  '3': { '2':'P','3':'P','4':'P','5':'P','6':'P','7':'P','8':'H','9':'H','T':'H','A':'H' },
  '4': { '2':'H','3':'H','4':'H','5':'P','6':'P','7':'H','8':'H','9':'H','T':'H','A':'H' },
  '5': { '2':'D','3':'D','4':'D','5':'D','6':'D','7':'D','8':'D','9':'D','T':'H','A':'H' },
  '6': { '2':'P','3':'P','4':'P','5':'P','6':'P','7':'H','8':'H','9':'H','T':'H','A':'H' },
  '7': { '2':'P','3':'P','4':'P','5':'P','6':'P','7':'P','8':'H','9':'H','T':'H','A':'H' },
  '8': { '2':'P','3':'P','4':'P','5':'P','6':'P','7':'P','8':'P','9':'P','T':'P','A':'Rp' },
  '9': { '2':'P','3':'P','4':'P','5':'P','6':'P','7':'S','8':'P','9':'P','T':'S','A':'S' },
  'T': { '2':'S','3':'S','4':'S','5':'S','6':'S','7':'S','8':'S','9':'S','T':'S','A':'S' },
  'A': { '2':'P','3':'P','4':'P','5':'P','6':'P','7':'P','8':'P','9':'P','T':'P','A':'P' }
};

export interface Deviation {
  id: string;
  description: string;
  appliesAt: (tc: number) => boolean;
  newAction: Action;
  threshold: number;
  direction: 'gte' | 'lte';
}

const DEVIATIONS: Array<{
  match: (h: HandInput) => boolean;
  threshold: number;
  direction: 'gte' | 'lte';
  newAction: Action;
  description: string;
}> = [
  { match: (h) => h.kind === 'hard' && h.total === 16 && h.upcard === 'T', threshold: 0, direction: 'gte', newAction: 'S', description: '16 vs 10 → STAND si TC ≥ 0 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 16 && h.upcard === '9', threshold: 5, direction: 'gte', newAction: 'S', description: '16 vs 9 → STAND si TC ≥ +5 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 15 && h.upcard === 'T', threshold: 4, direction: 'gte', newAction: 'S', description: '15 vs 10 → STAND si TC ≥ +4 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 13 && h.upcard === '2', threshold: -1, direction: 'lte', newAction: 'H', description: '13 vs 2 → HIT si TC ≤ -1 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 13 && h.upcard === '3', threshold: -2, direction: 'lte', newAction: 'H', description: '13 vs 3 → HIT si TC ≤ -2 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 12 && h.upcard === '2', threshold: 3, direction: 'gte', newAction: 'S', description: '12 vs 2 → STAND si TC ≥ +3 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 12 && h.upcard === '3', threshold: 2, direction: 'gte', newAction: 'S', description: '12 vs 3 → STAND si TC ≥ +2 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 12 && h.upcard === '4', threshold: 0, direction: 'lte', newAction: 'H', description: '12 vs 4 → HIT si TC ≤ 0 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 12 && h.upcard === '5', threshold: -2, direction: 'lte', newAction: 'H', description: '12 vs 5 → HIT si TC ≤ -2 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 12 && h.upcard === '6', threshold: -1, direction: 'lte', newAction: 'H', description: '12 vs 6 → HIT si TC ≤ -1 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 11 && h.upcard === 'A' && h.canDouble, threshold: 1, direction: 'gte', newAction: 'D', description: '11 vs A → DOUBLE si TC ≥ +1 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 10 && h.upcard === 'T' && h.canDouble, threshold: 4, direction: 'gte', newAction: 'D', description: '10 vs 10 → DOUBLE si TC ≥ +4 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 10 && h.upcard === 'A' && h.canDouble, threshold: 4, direction: 'gte', newAction: 'D', description: '10 vs A → DOUBLE si TC ≥ +4 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 9 && h.upcard === '2' && h.canDouble, threshold: 1, direction: 'gte', newAction: 'D', description: '9 vs 2 → DOUBLE si TC ≥ +1 (I18)' },
  { match: (h) => h.kind === 'hard' && h.total === 9 && h.upcard === '7' && h.canDouble, threshold: 3, direction: 'gte', newAction: 'D', description: '9 vs 7 → DOUBLE si TC ≥ +3 (I18)' },
  { match: (h) => h.kind === 'pair' && h.pairRank === 'T' && h.upcard === '5' && h.canSplit, threshold: 5, direction: 'gte', newAction: 'P', description: '10-10 vs 5 → SPLIT si TC ≥ +5 (I18)' },
  { match: (h) => h.kind === 'pair' && h.pairRank === 'T' && h.upcard === '6' && h.canSplit, threshold: 4, direction: 'gte', newAction: 'P', description: '10-10 vs 6 → SPLIT si TC ≥ +4 (I18)' },

  { match: (h) => h.canSurrender && h.kind === 'hard' && h.total === 14 && h.upcard === 'T', threshold: 3, direction: 'gte', newAction: 'R', description: '14 vs 10 → SURRENDER si TC ≥ +3 (Fab 4)' },
  { match: (h) => h.canSurrender && h.kind === 'hard' && h.total === 15 && h.upcard === '9', threshold: 2, direction: 'gte', newAction: 'R', description: '15 vs 9 → SURRENDER si TC ≥ +2 (Fab 4)' },
  { match: (h) => h.canSurrender && h.kind === 'hard' && h.total === 15 && h.upcard === 'T', threshold: 0, direction: 'gte', newAction: 'R', description: '15 vs 10 → SURRENDER si TC ≥ 0 (Fab 4)' },
  { match: (h) => h.canSurrender && h.kind === 'hard' && h.total === 15 && h.upcard === 'A', threshold: 1, direction: 'gte', newAction: 'R', description: '15 vs A → SURRENDER si TC ≥ +1 (Fab 4)' }
];

function dedupeMatch(h: HandInput): typeof DEVIATIONS {
  return DEVIATIONS.filter((d) => {
    try { return d.match(h); } catch { return false; }
  });
}

export interface StrategyResult {
  baseAction: Action;
  finalAction: Action;
  deviationApplied?: string;
  insurance?: { take: boolean; reason: string };
}

function resolveBase(hand: HandInput, rules: TableRules): Action {
  let table: Action;
  if (hand.kind === 'pair' && hand.pairRank) {
    table = PAIR[hand.pairRank][hand.upcard];
  } else if (hand.kind === 'soft') {
    const total = Math.min(21, Math.max(13, hand.total));
    table = SOFT[total][hand.upcard];
  } else {
    const total = Math.min(21, Math.max(5, hand.total));
    table = HARD[total][hand.upcard];
  }

  if (!hand.canSurrender && (table === 'R' || table === 'Rh' || table === 'Rs' || table === 'Rp')) {
    if (table === 'Rh') return 'H';
    if (table === 'Rs') return 'S';
    if (table === 'Rp') return 'P';
    return 'H';
  }
  if (table === 'Rh') return 'R';
  if (table === 'Rs') return 'R';
  if (table === 'Rp') return 'R';

  if (!hand.canDouble && (table === 'D' || table === 'Ds')) {
    return table === 'Ds' ? 'S' : 'H';
  }
  if (table === 'Ds') return 'D';

  if (hand.kind === 'hard' && hand.total === 11 && hand.upcard === 'A' && !rules.hitsSoft17) {
    return hand.canDouble ? 'H' : 'H';
  }

  return table;
}

export function recommendPlay(hand: HandInput, tc: number, rules: TableRules): StrategyResult {
  const base = resolveBase(hand, rules);
  let final = base;
  let deviationApplied: string | undefined;

  for (const dev of dedupeMatch(hand)) {
    const triggered = dev.direction === 'gte' ? tc >= dev.threshold : tc <= dev.threshold;
    if (triggered) {
      final = dev.newAction;
      deviationApplied = dev.description;
      break;
    }
  }

  const insurance =
    hand.upcard === 'A'
      ? tc >= 3
        ? { take: true, reason: 'TC ≥ +3 → tomar seguro tiene EV positivo' }
        : { take: false, reason: 'TC < +3 → NO tomes seguro' }
      : undefined;

  return { baseAction: base, finalAction: final, deviationApplied, insurance };
}

export function totalForCards(cards: Rank[]): { total: number; soft: boolean } {
  let total = 0;
  let aces = 0;
  for (const c of cards) {
    if (c === 'A') { aces++; total += 11; }
    else if (c === 'T') total += 10;
    else total += parseInt(c, 10);
  }
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return { total, soft: aces > 0 };
}
