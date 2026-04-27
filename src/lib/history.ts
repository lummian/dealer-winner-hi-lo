import type { ShoeRecord } from './types';

const HISTORY_KEY = 'dw.history.v1';
const OPEN_BALANCE_KEY = 'dw.openBalance.v1';

export function loadHistory(): ShoeRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendShoeRecord(record: ShoeRecord): ShoeRecord[] {
  const list = loadHistory();
  list.push(record);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
  return list;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
  }
}

export function loadOpenBalance(): number | null {
  try {
    const raw = localStorage.getItem(OPEN_BALANCE_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function saveOpenBalance(balance: number | null): void {
  try {
    if (balance === null) localStorage.removeItem(OPEN_BALANCE_KEY);
    else localStorage.setItem(OPEN_BALANCE_KEY, String(balance));
  } catch {
    // ignore
  }
}

export interface SessionSummary {
  shoeCount: number;
  totalNetUnits: number;
  totalNetMoney: number;
  bestShoeUnits: number;
  worstShoeUnits: number;
  avgUnitsPerShoe: number;
  avgScore: number;
}

export function summarizeSession(records: ShoeRecord[]): SessionSummary {
  if (records.length === 0) {
    return {
      shoeCount: 0,
      totalNetUnits: 0,
      totalNetMoney: 0,
      bestShoeUnits: 0,
      worstShoeUnits: 0,
      avgUnitsPerShoe: 0,
      avgScore: 0
    };
  }
  let totalUnits = 0;
  let totalMoney = 0;
  let totalScore = 0;
  let best = -Infinity;
  let worst = Infinity;
  for (const r of records) {
    totalUnits += r.netUnits;
    totalMoney += r.endBalance - r.startBalance;
    totalScore += r.shoeQualityScore;
    if (r.netUnits > best) best = r.netUnits;
    if (r.netUnits < worst) worst = r.netUnits;
  }
  return {
    shoeCount: records.length,
    totalNetUnits: totalUnits,
    totalNetMoney: totalMoney,
    bestShoeUnits: best,
    worstShoeUnits: worst,
    avgUnitsPerShoe: totalUnits / records.length,
    avgScore: totalScore / records.length
  };
}
