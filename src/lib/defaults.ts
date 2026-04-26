import type { AppConfig } from './types';
import { DEFAULT_SPREAD } from './betting';

export const DEFAULT_CONFIG: AppConfig = {
  system: 'hi-lo',
  rules: {
    decks: 6,
    penetrationPct: 75,
    hitsSoft17: false,
    doubleAfterSplit: true,
    lateSurrender: true,
    blackjackPays: 1.5,
    resplitTo: 4
  },
  betting: {
    mode: 'spread',
    unitSize: 25,
    bankroll: 2000,
    kellyFraction: 0.25,
    spread: DEFAULT_SPREAD,
    maxUnits: 12,
    wongOutTC: 0
  }
};
