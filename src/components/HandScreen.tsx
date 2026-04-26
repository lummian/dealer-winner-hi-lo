import { useState, useMemo } from 'react';
import type { Rank, TableRules } from '../lib/types';
import {
  ACTION_SHORT,
  DEALER_UPCARDS,
  recommendPlay,
  type DealerUpcard,
  type HandKind
} from '../lib/strategy';

interface HandScreenProps {
  tc: number;
  rules: TableRules;
  onClose: () => void;
}

const PAIR_RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'A'];

const ACTION_COLOR: Record<string, string> = {
  HIT: 'bg-rose-600',
  STAND: 'bg-emerald-600',
  DOUBLE: 'bg-amber-500 text-slate-950',
  SPLIT: 'bg-sky-500',
  SURRENDER: 'bg-purple-600',
  'DOUBLE/STAND': 'bg-amber-500 text-slate-950',
  'SURR/HIT': 'bg-purple-600',
  'SURR/STAND': 'bg-purple-600',
  'SURR/SPLIT': 'bg-purple-600'
};

export function HandScreen({ tc, rules, onClose }: HandScreenProps) {
  const [kind, setKind] = useState<HandKind>('hard');
  const [hardTotal, setHardTotal] = useState<number>(16);
  const [softTotal, setSoftTotal] = useState<number>(18);
  const [pairRank, setPairRank] = useState<Rank>('8');
  const [upcard, setUpcard] = useState<DealerUpcard>('T');

  const result = useMemo(() => {
    const hand = {
      kind,
      total: kind === 'hard' ? hardTotal : kind === 'soft' ? softTotal : 0,
      pairRank: kind === 'pair' ? pairRank : undefined,
      upcard,
      canDouble: true,
      canSurrender: rules.lateSurrender,
      canSplit: true
    };
    return recommendPlay(hand, tc, rules);
  }, [kind, hardTotal, softTotal, pairRank, upcard, tc, rules]);

  const actionShort = ACTION_SHORT[result.finalAction];
  const actionColor = ACTION_COLOR[actionShort] ?? 'bg-slate-700';
  const isDeviation = result.baseAction !== result.finalAction;

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 overflow-y-auto safe-fixed">
      <div className="max-w-md mx-auto p-3 space-y-3 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">¿Qué hago?</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              TC <span className="text-white font-bold">{tc > 0 ? `+${tc}` : tc}</span>
            </span>
            <button onClick={onClose} className="text-slate-300 px-3 py-1 rounded-lg bg-slate-800 text-sm">
              Cerrar
            </button>
          </div>
        </div>

        <div className={`rounded-2xl p-4 text-white ${actionColor} shadow-lg`}>
          <div className="text-xs uppercase tracking-wider opacity-80">Acción recomendada</div>
          <div className="text-4xl font-extrabold leading-tight mt-1">{actionShort}</div>
          {isDeviation && (
            <div className="mt-2 text-xs bg-black/30 rounded-md px-2 py-1">
              ⚡ DESVIACIÓN — base sería <strong>{ACTION_SHORT[result.baseAction]}</strong>
            </div>
          )}
          {result.deviationApplied && (
            <div className="text-xs opacity-90 mt-1">{result.deviationApplied}</div>
          )}
          {!isDeviation && (
            <div className="text-xs opacity-80 mt-1">Estrategia básica</div>
          )}
        </div>

        {result.insurance && (
          <div className={`rounded-xl p-3 ${result.insurance.take ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
            <div className="text-[10px] uppercase tracking-wider font-bold opacity-80">Seguro (Insurance)</div>
            <div className="text-lg font-bold">{result.insurance.take ? '✓ TOMAR seguro' : '✗ NO tomes seguro'}</div>
            <div className="text-xs opacity-80">{result.insurance.reason}</div>
          </div>
        )}

        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Tipo de mano</div>
          <div className="grid grid-cols-3 gap-2">
            {(['hard', 'soft', 'pair'] as HandKind[]).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`py-3 rounded-lg font-semibold text-sm ${kind === k ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                {k === 'hard' ? 'Dura' : k === 'soft' ? 'Suave (con A)' : 'Par'}
              </button>
            ))}
          </div>
        </div>

        {kind === 'hard' && (
          <NumberPicker
            label="Total de tu mano"
            value={hardTotal}
            options={[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
            onChange={setHardTotal}
            cols={4}
          />
        )}

        {kind === 'soft' && (
          <div>
            <div className="text-xs text-slate-400 mb-2">Total con As contando como 11</div>
            <NumberPicker
              label="Total suave"
              value={softTotal}
              options={[13, 14, 15, 16, 17, 18, 19, 20]}
              onChange={setSoftTotal}
              cols={4}
              format={(n) => `A+${n - 11} (${n})`}
            />
          </div>
        )}

        {kind === 'pair' && (
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Par de</div>
            <div className="grid grid-cols-5 gap-2">
              {PAIR_RANKS.map((r) => (
                <button
                  key={r}
                  onClick={() => setPairRank(r)}
                  className={`py-3 rounded-lg font-bold ${pairRank === r ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                >
                  {r === 'T' ? '10' : r}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Carta visible del dealer</div>
          <div className="grid grid-cols-5 gap-2">
            {DEALER_UPCARDS.map((u) => (
              <button
                key={u}
                onClick={() => setUpcard(u)}
                className={`py-3 rounded-lg font-bold ${upcard === u ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                {u === 'T' ? '10' : u}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-900 rounded-lg p-3">
          <strong className="text-slate-400">Leyenda:</strong> HIT = pedir, STAND = plantarse, DOUBLE = doblar, SPLIT = dividir, SURRENDER = rendirse.
          Color ámbar = momento de oro o desviación positiva. Morado = surrender. ⚡ aparece cuando el TC justifica desviarte de la estrategia básica.
        </div>
      </div>
    </div>
  );
}

function NumberPicker({
  label, value, options, onChange, cols = 4, format
}: {
  label: string;
  value: number;
  options: number[];
  onChange: (v: number) => void;
  cols?: number;
  format?: (n: number) => string;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">{label}</div>
      <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {options.map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`py-3 rounded-lg font-bold text-sm ${value === n ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            {format ? format(n) : n}
          </button>
        ))}
      </div>
    </div>
  );
}
