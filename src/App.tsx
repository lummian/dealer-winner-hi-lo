import { useEffect, useMemo, useState } from 'react';
import { CardButton } from './components/CardButton';
import { StatTile } from './components/StatTile';
import { Settings } from './components/Settings';
import { HandScreen } from './components/HandScreen';
import {
  COUNT_VALUES,
  RANKS,
  SYSTEM_LABELS,
  applyCard,
  decksRemaining,
  newShoe,
  penetrationReached,
  playerEdgePct,
  trueCount,
  trueCountRaw,
  undoLast
} from './lib/counting';
import { recommendBet } from './lib/betting';
import { loadConfig, loadShoe, saveConfig, saveShoe } from './lib/storage';
import type { AppConfig, Rank, ShoeState } from './lib/types';

export function App() {
  const [config, setConfig] = useState<AppConfig>(() => loadConfig());
  const [shoe, setShoe] = useState<ShoeState>(() => loadShoe(loadConfig().rules.decks));
  const [showSettings, setShowSettings] = useState(false);
  const [showHand, setShowHand] = useState(false);

  useEffect(() => { saveConfig(config); }, [config]);
  useEffect(() => { saveShoe(shoe); }, [shoe]);

  const decksLeft = decksRemaining(shoe);
  const decksBurned = config.rules.decks - decksLeft;
  const dealtPct = (shoe.dealtCount / shoe.totalCards) * 100;
  const tc = trueCount(shoe.runningCount, decksLeft);
  const tcRaw = trueCountRaw(shoe.runningCount, decksLeft);
  const edge = playerEdgePct(tc);
  const bet = useMemo(() => recommendBet(tc, config.betting), [tc, config.betting]);
  const penetrated = penetrationReached(shoe, config.rules);

  const handleCard = (rank: Rank) => {
    setShoe((s) => applyCard(s, rank, config.system));
    if ('vibrate' in navigator) navigator.vibrate?.(10);
  };

  const handleUndo = () => {
    setShoe((s) => undoLast(s));
    if ('vibrate' in navigator) navigator.vibrate?.(20);
  };

  const handleReshuffle = () => {
    if (confirm('¿Barajar de nuevo? Se reinicia el conteo.')) {
      setShoe(newShoe(config.rules.decks));
    }
  };

  const handleSaveConfig = (next: AppConfig) => {
    const decksChanged = next.rules.decks !== config.rules.decks;
    setConfig(next);
    if (decksChanged) setShoe(newShoe(next.rules.decks));
  };

  const tcTone = tc >= 4 ? 'hot' : tc >= 2 ? 'good' : tc <= -1 ? 'bad' : 'neutral';
  const edgeTone = edge >= 1 ? 'hot' : edge > 0 ? 'good' : edge < 0 ? 'bad' : 'neutral';

  return (
    <div className="min-h-full bg-slate-950 text-white flex flex-col">
      <header className="px-3 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-bold">Dealer Winner</h1>
          <span className="text-xs text-slate-400">{SYSTEM_LABELS[config.system]}</span>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="bg-slate-800 px-3 py-1.5 rounded-lg text-sm"
        >
          ⚙ Config
        </button>
      </header>

      <section className="px-3 grid grid-cols-4 gap-1.5">
        <StatTile
          label="RC"
          value={`${shoe.runningCount > 0 ? '+' : ''}${shoe.runningCount}`}
          tone={shoe.runningCount > 0 ? 'good' : shoe.runningCount < 0 ? 'bad' : 'neutral'}
        />
        <StatTile
          label="TC"
          value={`${tc > 0 ? '+' : ''}${tc}`}
          sublabel={`raw ${tcRaw.toFixed(1)}`}
          tone={tcTone}
        />
        <StatTile
          label="Mazos"
          value={decksLeft.toFixed(1)}
          sublabel={`${decksBurned.toFixed(1)} usados`}
          tone="neutral"
        />
        <StatTile
          label="Edge"
          value={`${edge >= 0 ? '+' : ''}${edge.toFixed(1)}%`}
          tone={edgeTone}
        />
      </section>

      <section className="px-3 mt-2">
        <div className="bg-slate-900 rounded-lg p-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span>Penetración: {dealtPct.toFixed(0)}% ({shoe.dealtCount}/{shoe.totalCards} cartas)</span>
            <span>corte @ {config.rules.penetrationPct}%</span>
          </div>
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 ${penetrated ? 'bg-amber-500' : 'bg-emerald-600'}`}
              style={{ width: `${Math.min(100, dealtPct)}%` }}
            />
            <div
              className="absolute inset-y-0 w-0.5 bg-rose-400"
              style={{ left: `${config.rules.penetrationPct}%` }}
            />
          </div>
        </div>
      </section>

      <section className="px-3 mt-2">
        <div className={`rounded-xl p-3 ${bet.shouldWongOut ? 'bg-rose-900' : bet.units >= 8 ? 'bg-amber-500 text-slate-950' : bet.units >= 2 ? 'bg-emerald-700' : 'bg-slate-800'}`}>
          <div className="text-[10px] uppercase tracking-wider opacity-80">Apuesta sugerida</div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tabular-nums">{bet.units}u</span>
            <span className="text-2xl font-bold tabular-nums">${bet.amount.toLocaleString()}</span>
          </div>
          <div className="text-xs opacity-80 mt-0.5">{bet.reason}</div>
        </div>
      </section>

      {penetrated && (
        <div className="mx-3 mt-2 px-3 py-2 rounded-lg bg-amber-600/20 border border-amber-500 text-amber-200 text-xs">
          ⚠ Penetración alcanzada ({config.rules.penetrationPct}%) — el dealer debería barajar pronto.
        </div>
      )}

      <section className="px-3 mt-3 grid grid-cols-5 gap-1.5 flex-1 content-start">
        {RANKS.map((rank) => (
          <CardButton
            key={rank}
            rank={rank}
            countDelta={COUNT_VALUES[config.system][rank]}
            onPress={() => handleCard(rank)}
          />
        ))}
      </section>

      <footer className="px-3 pt-3 pb-3 grid grid-cols-3 gap-2 sticky bottom-0 bg-slate-950 border-t border-slate-800 safe-bottom">
        <button
          onClick={handleUndo}
          disabled={shoe.history.length === 0}
          className="py-3 rounded-lg bg-slate-700 disabled:bg-slate-800 disabled:text-slate-600 font-semibold active:bg-slate-600"
        >
          ↶ Undo
        </button>
        <button
          onClick={() => setShowHand(true)}
          className="py-3 rounded-lg bg-emerald-600 font-bold active:bg-emerald-500"
        >
          ¿Qué hago?
        </button>
        <button
          onClick={handleReshuffle}
          className="py-3 rounded-lg bg-rose-700 font-semibold active:bg-rose-600"
        >
          ⟳ Barajar
        </button>
      </footer>

      {showSettings && (
        <Settings
          config={config}
          onSave={handleSaveConfig}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showHand && (
        <HandScreen
          tc={tc}
          rules={config.rules}
          onClose={() => setShowHand(false)}
        />
      )}
    </div>
  );
}
