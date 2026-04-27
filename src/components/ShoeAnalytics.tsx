import { useState } from 'react';
import type { ShoeState, TableRules } from '../lib/types';
import { analyzeShoe, type ShoeQualityLabel } from '../lib/analytics';

interface ShoeAnalyticsProps {
  shoe: ShoeState;
  rules: TableRules;
}

const LABEL_COLOR: Record<ShoeQualityLabel, string> = {
  excelente: 'bg-amber-500 text-slate-950',
  buena: 'bg-emerald-700 text-white',
  regular: 'bg-amber-600 text-white',
  mala: 'bg-rose-700 text-white',
  'sin datos': 'bg-slate-700 text-slate-300'
};

export function ShoeAnalytics({ shoe, rules }: ShoeAnalyticsProps) {
  const [expanded, setExpanded] = useState(false);
  const a = analyzeShoe(shoe, rules);

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-3 py-2 text-left active:bg-slate-800"
      >
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Análisis</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${LABEL_COLOR[a.shoeQualityLabel]}`}>
            {a.shoeQualityLabel}
          </span>
          <span className="text-[11px] text-slate-300 tabular-nums">
            {a.shoeQualityScore}/100
          </span>
          <span className="text-[11px] text-slate-400">
            · Heat ≥+2 <span className="text-slate-100 font-bold tabular-nums">{(a.heatRatio.above2 * 100).toFixed(0)}%</span>
          </span>
        </div>
        <span className="text-slate-400 text-xs ml-2">{expanded ? '▲' : '▼'}</span>
      </button>

      {!expanded && (
        <div className="px-3 pb-2 text-[11px] text-slate-400 leading-snug">
          {a.recommendation}
        </div>
      )}

      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-slate-800 pt-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
              Heat — % cartas con TC ≥ X
            </div>
            <HeatBar label="≥+1" pct={a.heatRatio.above1} />
            <HeatBar label="≥+2" pct={a.heatRatio.above2} />
            <HeatBar label="≥+3" pct={a.heatRatio.above3} />
            {!a.enoughData && (
              <div className="text-[10px] text-slate-500 mt-1">
                Muestra chica ({shoe.dealtCount} cartas) — heat poco confiable.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Stat label="TC máx" value={a.maxTC.toFixed(1)} />
            <Stat label="TC promedio" value={a.avgTC.toFixed(2)} />
          </div>

          {a.cardsPerMin !== null && (
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Cartas/min" value={a.cardsPerMin.toFixed(1)} />
              <Stat label="Manos/hr est." value={a.estimatedHandsPerHour?.toFixed(0) ?? '-'} />
            </div>
          )}

          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
              Score breakdown
            </div>
            <ScoreRow label="Penetración" value={a.penScore} max={30} />
            <ScoreRow label="Heat del zapato" value={a.heatScore} max={30} />
            <ScoreRow label="Reglas de mesa" value={a.rulesScore} max={40} />
          </div>

          <div className="text-[11px] text-slate-200 bg-slate-800 rounded p-2 leading-snug">
            <span className="text-amber-400 font-bold">Sugerencia:</span> {a.recommendation}
          </div>
        </div>
      )}
    </div>
  );
}

function HeatBar({ label, pct }: { label: string; pct: number }) {
  const color = pct >= 0.15 ? 'bg-amber-500' : pct >= 0.08 ? 'bg-emerald-600' : pct >= 0.04 ? 'bg-emerald-800' : 'bg-slate-700';
  return (
    <div className="flex items-center gap-2 mb-1 last:mb-0">
      <span className="text-[10px] text-slate-400 w-8 tabular-nums">{label}</span>
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(100, pct * 100)}%` }} />
      </div>
      <span className="text-[10px] text-slate-200 w-10 text-right tabular-nums font-semibold">
        {(pct * 100).toFixed(0)}%
      </span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800 rounded px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-sm font-bold text-white tabular-nums">{value}</div>
    </div>
  );
}

function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2 mb-1 last:mb-0">
      <span className="text-[10px] text-slate-400 flex-1">{label}</span>
      <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-600" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-slate-200 w-10 text-right tabular-nums font-semibold">
        {value}/{max}
      </span>
    </div>
  );
}
