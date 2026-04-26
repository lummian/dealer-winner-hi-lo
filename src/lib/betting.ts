import type { BettingConfig, SpreadTier } from './types';
import { playerEdgePct } from './counting';

export const DEFAULT_SPREAD: SpreadTier[] = [
  { tcMin: -99, units: 1 },
  { tcMin: 2, units: 2 },
  { tcMin: 3, units: 4 },
  { tcMin: 4, units: 8 },
  { tcMin: 5, units: 12 }
];

export function unitsFromSpread(tc: number, spread: SpreadTier[], maxUnits: number): number {
  const sorted = [...spread].sort((a, b) => a.tcMin - b.tcMin);
  let units = sorted[0]?.units ?? 1;
  for (const tier of sorted) {
    if (tc >= tier.tcMin) units = tier.units;
  }
  return Math.min(units, maxUnits);
}

export function unitsFromKelly(
  tc: number,
  bankroll: number,
  unitSize: number,
  kellyFraction: number,
  maxUnits: number
): number {
  const edge = playerEdgePct(tc) / 100;
  if (edge <= 0) return 1;
  const variance = 1.32;
  const kellyBet = (edge / variance) * bankroll * kellyFraction;
  const units = kellyBet / unitSize;
  return Math.max(1, Math.min(maxUnits, Math.round(units)));
}

export interface BetRecommendation {
  units: number;
  amount: number;
  edgePct: number;
  shouldWongOut: boolean;
  reason: string;
}

export function recommendBet(tc: number, cfg: BettingConfig): BetRecommendation {
  const edgePct = playerEdgePct(tc);
  const shouldWongOut = tc <= cfg.wongOutTC;

  let units: number;
  let reason: string;

  if (shouldWongOut) {
    units = 1;
    reason = `Cuenta desfavorable (TC ${tc}). Apuesta mínima o sal de la mesa.`;
  } else if (cfg.mode === 'kelly') {
    units = unitsFromKelly(tc, cfg.bankroll, cfg.unitSize, cfg.kellyFraction, cfg.maxUnits);
    reason = `Kelly ${cfg.kellyFraction.toFixed(2)}x sobre ventaja ${edgePct.toFixed(2)}%`;
  } else {
    units = unitsFromSpread(tc, cfg.spread, cfg.maxUnits);
    reason = `Bet spread (TC ${tc})`;
  }

  return {
    units,
    amount: units * cfg.unitSize,
    edgePct,
    shouldWongOut,
    reason
  };
}
