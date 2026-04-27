import type { ShoeState, TableRules } from './types';

export type ShoeQualityLabel = 'excelente' | 'buena' | 'regular' | 'mala' | 'sin datos';

export interface ShoeAnalyticsResult {
  heatRatio: { above1: number; above2: number; above3: number };
  maxTC: number;
  avgTC: number;
  cardsPerMin: number | null;
  estimatedHandsPerHour: number | null;
  penetrationActual: number;
  penetrationTarget: number;
  shoeQualityScore: number;
  shoeQualityLabel: ShoeQualityLabel;
  recommendation: string;
  rulesScore: number;
  penScore: number;
  heatScore: number;
  enoughData: boolean;
}

const MIN_CARDS_FOR_HEAT = 20;
const MAX_INTER_CARD_MS = 60_000;
const AVG_CARDS_PER_HAND = 2.7;

export function analyzeShoe(state: ShoeState, rules: TableRules): ShoeAnalyticsResult {
  const dealt = state.dealtCount;
  const total = state.totalCards;

  let rc = 0;
  let cardsAbove1 = 0;
  let cardsAbove2 = 0;
  let cardsAbove3 = 0;
  let tcSum = 0;
  let maxTC = 0;

  for (let i = 0; i < state.history.length; i++) {
    rc += state.history[i].countDelta;
    const decksLeft = Math.max((total - (i + 1)) / 52, 0.5);
    const tcRaw = rc / decksLeft;
    if (tcRaw >= 1) cardsAbove1++;
    if (tcRaw >= 2) cardsAbove2++;
    if (tcRaw >= 3) cardsAbove3++;
    tcSum += tcRaw;
    if (tcRaw > maxTC) maxTC = tcRaw;
  }

  const heatRatio = {
    above1: dealt ? cardsAbove1 / dealt : 0,
    above2: dealt ? cardsAbove2 / dealt : 0,
    above3: dealt ? cardsAbove3 / dealt : 0
  };
  const avgTC = dealt ? tcSum / dealt : 0;

  let activeMs = 0;
  for (let i = 1; i < state.history.length; i++) {
    const gap = state.history[i].ts - state.history[i - 1].ts;
    if (gap > 0 && gap < MAX_INTER_CARD_MS) activeMs += gap;
  }
  const activeMin = activeMs / 60_000;
  const cardsPerMin = activeMin > 0.5 ? (state.history.length - 1) / activeMin : null;
  const estimatedHandsPerHour = cardsPerMin !== null ? (cardsPerMin * 60) / AVG_CARDS_PER_HAND : null;

  const penetrationActual = total > 0 ? (dealt / total) * 100 : 0;
  const enoughData = dealt >= MIN_CARDS_FOR_HEAT;

  const penScore =
    rules.penetrationPct >= 80 ? 30 :
    rules.penetrationPct >= 70 ? 20 :
    rules.penetrationPct >= 60 ? 10 : 0;

  let heatScore: number;
  if (!enoughData) {
    heatScore = 15;
  } else if (heatRatio.above2 >= 0.15) {
    heatScore = 30;
  } else if (heatRatio.above2 >= 0.08) {
    heatScore = 18;
  } else if (heatRatio.above2 >= 0.04) {
    heatScore = 8;
  } else {
    heatScore = 0;
  }

  let rulesScore = 0;
  if (!rules.hitsSoft17) rulesScore += 10;
  if (rules.blackjackPays === 1.5) rulesScore += 10;
  if (rules.lateSurrender) rulesScore += 5;
  if (rules.doubleAfterSplit) rulesScore += 5;
  if (rules.resplitTo >= 4) rulesScore += 5;
  if (rules.decks <= 6) rulesScore += 5;

  const score = Math.min(100, penScore + heatScore + rulesScore);

  let label: ShoeQualityLabel;
  if (!enoughData && dealt < 5) label = 'sin datos';
  else if (score >= 80) label = 'excelente';
  else if (score >= 60) label = 'buena';
  else if (score >= 40) label = 'regular';
  else label = 'mala';

  let recommendation: string;
  if (rules.blackjackPays !== 1.5) {
    recommendation = 'BJ paga 6:5 — la mesa cuesta ~1.4% de EV. Buscá una 3:2.';
  } else if (rules.penetrationPct < 65) {
    recommendation = `Pen baja (${rules.penetrationPct}%). Buscá mesa con corte más profundo.`;
  } else if (!enoughData) {
    recommendation = 'Datos insuficientes. Seguí jugando para evaluar la mesa.';
  } else if (heatRatio.above2 < 0.04 && dealt > 40) {
    recommendation = 'Heat muy bajo este zapato. Si se repite, cambiá de mesa.';
  } else if (score >= 80) {
    recommendation = 'Mesa óptima. Mantener spread agresivo cuando suba el TC.';
  } else if (score >= 60) {
    recommendation = 'Mesa jugable. Seguí con tu plan de spread.';
  } else if (score >= 40) {
    recommendation = 'Mesa regular. Considerá bajar spread o cambiar de mesa.';
  } else {
    recommendation = 'Reglas o pen pobres. Buscá otra mesa.';
  }

  return {
    heatRatio,
    maxTC,
    avgTC,
    cardsPerMin,
    estimatedHandsPerHour,
    penetrationActual,
    penetrationTarget: rules.penetrationPct,
    shoeQualityScore: score,
    shoeQualityLabel: label,
    recommendation,
    rulesScore,
    penScore,
    heatScore,
    enoughData
  };
}
