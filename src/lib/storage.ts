import type { AppConfig, ShoeState } from './types';
import { DEFAULT_CONFIG } from './defaults';
import { newShoe } from './counting';

const CONFIG_KEY = 'dw.config.v1';
const SHOE_KEY = 'dw.shoe.v1';

export function loadConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as Partial<AppConfig>;
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      rules: { ...DEFAULT_CONFIG.rules, ...(parsed.rules ?? {}) },
      betting: { ...DEFAULT_CONFIG.betting, ...(parsed.betting ?? {}) }
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(cfg: AppConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  } catch {
    // ignore
  }
}

export function loadShoe(decks: number): ShoeState {
  try {
    const raw = localStorage.getItem(SHOE_KEY);
    if (!raw) return newShoe(decks);
    const parsed = JSON.parse(raw) as ShoeState;
    if (parsed.totalCards !== decks * 52) return newShoe(decks);
    return parsed;
  } catch {
    return newShoe(decks);
  }
}

export function saveShoe(shoe: ShoeState): void {
  try {
    localStorage.setItem(SHOE_KEY, JSON.stringify(shoe));
  } catch {
    // ignore
  }
}
