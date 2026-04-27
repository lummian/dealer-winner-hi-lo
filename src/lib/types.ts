export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'A';

export type CountingSystem = 'hi-lo' | 'ko' | 'hi-opt-i';

export type BettingMode = 'spread' | 'kelly';

export interface CountingValues {
  '2': number; '3': number; '4': number; '5': number; '6': number;
  '7': number; '8': number; '9': number; 'T': number; 'A': number;
}

export interface SpreadTier {
  tcMin: number;
  units: number;
}

export interface TableRules {
  decks: number;
  penetrationPct: number;
  hitsSoft17: boolean;
  doubleAfterSplit: boolean;
  lateSurrender: boolean;
  blackjackPays: 1.5 | 1.2;
  resplitTo: number;
}

export interface BettingConfig {
  mode: BettingMode;
  unitSize: number;
  bankroll: number;
  kellyFraction: number;
  spread: SpreadTier[];
  maxUnits: number;
  wongOutTC: number;
}

export interface AppConfig {
  system: CountingSystem;
  rules: TableRules;
  betting: BettingConfig;
}

export interface CardEvent {
  rank: Rank;
  countDelta: number;
  ts: number;
}

export interface ShoeState {
  totalCards: number;
  dealtCount: number;
  runningCount: number;
  history: CardEvent[];
}

export interface ShoeRecord {
  id: string;
  startedAt: number;
  endedAt: number;
  startBalance: number;
  endBalance: number;
  netUnits: number;
  unitSize: number;
  cardsDealt: number;
  totalCards: number;
  rules: TableRules;
  shoeQualityScore: number;
  shoeQualityLabel: string;
  heatAbove2: number;
  maxTC: number;
}
