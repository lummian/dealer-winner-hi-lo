import { useEffect, useState } from 'react';
import type { AppConfig, BettingMode, CountingSystem } from '../lib/types';
import { SYSTEM_LABELS } from '../lib/counting';
import { clearHistory, loadHistory, saveOpenBalance } from '../lib/history';

interface SettingsProps {
  config: AppConfig;
  onSave: (cfg: AppConfig) => void;
  onClose: () => void;
  onSessionCleared: () => void;
}

export function Settings({ config, onSave, onClose, onSessionCleared }: SettingsProps) {
  const [draft, setDraft] = useState<AppConfig>(config);
  const [recordCount, setRecordCount] = useState<number>(() => loadHistory().length);

  const handleClearSession = () => {
    if (recordCount === 0) return;
    if (!confirm(`¿Borrar ${recordCount} ${recordCount === 1 ? 'zapato' : 'zapatos'} de la sesión actual? El balance de cierre también se reinicia.`)) return;
    clearHistory();
    saveOpenBalance(null);
    setRecordCount(0);
    onSessionCleared();
  };

  const updateBetting = <K extends keyof AppConfig['betting']>(key: K, value: AppConfig['betting'][K]) => {
    setDraft({ ...draft, betting: { ...draft.betting, [key]: value } });
  };
  const updateRules = <K extends keyof AppConfig['rules']>(key: K, value: AppConfig['rules'][K]) => {
    setDraft({ ...draft, rules: { ...draft.rules, [key]: value } });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto safe-fixed">
      <div className="max-w-md mx-auto p-4 space-y-6 pb-24">
        <div className="flex items-center justify-between sticky top-0 bg-slate-950 py-2 -mx-4 px-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Configuración</h2>
          <button onClick={onClose} className="text-slate-400 px-3 py-1 rounded-lg bg-slate-800">Cerrar</button>
        </div>

        <Section title="Sistema de conteo">
          <select
            value={draft.system}
            onChange={(e) => setDraft({ ...draft, system: e.target.value as CountingSystem })}
            className="w-full bg-slate-800 text-white rounded-lg p-3 text-base"
          >
            {(Object.keys(SYSTEM_LABELS) as CountingSystem[]).map((s) => (
              <option key={s} value={s}>{SYSTEM_LABELS[s]}</option>
            ))}
          </select>
        </Section>

        <Section title="Reglas de mesa">
          <NumberField
            label="Mazos"
            value={draft.rules.decks}
            min={1} max={8} step={1}
            onChange={(v) => updateRules('decks', v)}
          />
          <NumberField
            label="Penetración (%)"
            value={draft.rules.penetrationPct}
            min={50} max={95} step={5}
            onChange={(v) => updateRules('penetrationPct', v)}
          />
          <Toggle label="Dealer pide en soft 17 (H17)" value={draft.rules.hitsSoft17} onChange={(v) => updateRules('hitsSoft17', v)} />
          <Toggle label="Doble después de split (DAS)" value={draft.rules.doubleAfterSplit} onChange={(v) => updateRules('doubleAfterSplit', v)} />
          <Toggle label="Late surrender" value={draft.rules.lateSurrender} onChange={(v) => updateRules('lateSurrender', v)} />
          <div>
            <label className="text-sm text-slate-300 block mb-1">BJ paga</label>
            <select
              value={draft.rules.blackjackPays}
              onChange={(e) => updateRules('blackjackPays', Number(e.target.value) as 1.5 | 1.2)}
              className="w-full bg-slate-800 text-white rounded-lg p-3"
            >
              <option value={1.5}>3:2 (1.5x)</option>
              <option value={1.2}>6:5 (1.2x)</option>
            </select>
          </div>
        </Section>

        <Section title="Banca y apuesta">
          <NumberField
            label="Bankroll ($)"
            value={draft.betting.bankroll}
            min={0} step={50}
            onChange={(v) => updateBetting('bankroll', v)}
          />
          <NumberField
            label="Unidad de apuesta ($)"
            value={draft.betting.unitSize}
            min={1} step={5}
            onChange={(v) => updateBetting('unitSize', v)}
          />
          <NumberField
            label="Tope de unidades por mano"
            value={draft.betting.maxUnits}
            min={1} max={100} step={1}
            onChange={(v) => updateBetting('maxUnits', v)}
          />
          <NumberField
            label="Wong out: TC mínimo para apostar"
            value={draft.betting.wongOutTC}
            min={-5} max={5} step={1}
            onChange={(v) => updateBetting('wongOutTC', v)}
          />
        </Section>

        <Section title="Sesión / historial">
          <div className="text-xs text-slate-400">
            {recordCount === 0
              ? 'No hay zapatos registrados todavía.'
              : `${recordCount} ${recordCount === 1 ? 'zapato registrado' : 'zapatos registrados'} en la sesión actual.`}
          </div>
          <button
            type="button"
            onClick={handleClearSession}
            disabled={recordCount === 0}
            className="w-full py-2.5 rounded-lg bg-rose-700 text-white font-semibold disabled:bg-slate-800 disabled:text-slate-600 active:bg-rose-600"
          >
            Limpiar historial
          </button>
        </Section>

        <Section title="Modo de bet sizing">
          <div className="grid grid-cols-2 gap-2">
            {(['spread', 'kelly'] as BettingMode[]).map((m) => (
              <button
                key={m}
                onClick={() => updateBetting('mode', m)}
                className={`py-3 rounded-lg font-semibold ${draft.betting.mode === m ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                {m === 'spread' ? 'Bet Spread' : 'Kelly'}
              </button>
            ))}
          </div>
          {draft.betting.mode === 'kelly' && (
            <NumberField
              label="Fracción Kelly (0.25 = ¼ Kelly)"
              value={draft.betting.kellyFraction}
              min={0.05} max={1} step={0.05}
              onChange={(v) => updateBetting('kellyFraction', v)}
            />
          )}
          {draft.betting.mode === 'spread' && (
            <div className="space-y-2">
              <div className="text-xs text-slate-400">Spread: TC ≥ → unidades</div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 px-1">
                <span>TC ≥</span>
                <span>Unidades</span>
              </div>
              {draft.betting.spread.map((tier, i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <NumberField
                    label=""
                    value={tier.tcMin}
                    onChange={(v) => {
                      const next = [...draft.betting.spread];
                      next[i] = { ...next[i], tcMin: v };
                      updateBetting('spread', next);
                    }}
                  />
                  <NumberField
                    label=""
                    value={tier.units}
                    min={0}
                    onChange={(v) => {
                      const next = [...draft.betting.spread];
                      next[i] = { ...next[i], units: v };
                      updateBetting('spread', next);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </Section>

        <div className="sticky bottom-0 bg-slate-950 -mx-4 px-4 py-3 border-t border-slate-800 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-slate-800 text-slate-200 font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={() => { onSave(draft); onClose(); }}
            className="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-semibold"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm uppercase tracking-wider text-slate-400">{title}</h3>
      <div className="space-y-3 bg-slate-900 rounded-xl p-4">{children}</div>
    </div>
  );
}

function NumberField({
  label, value, onChange, min, max
}: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  const [text, setText] = useState<string>(String(value));

  useEffect(() => {
    if (Number(text) !== value) setText(String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = () => {
    if (text === '' || text === '-') {
      const fallback = min ?? 0;
      setText(String(fallback));
      onChange(fallback);
      return;
    }
    let n = Number(text);
    if (Number.isNaN(n)) {
      setText(String(value));
      return;
    }
    if (min !== undefined && n < min) n = min;
    if (max !== undefined && n > max) n = max;
    setText(String(n));
    onChange(n);
  };

  return (
    <div>
      {label && <label className="text-sm text-slate-300 block mb-1">{label}</label>}
      <input
        type="text"
        inputMode="decimal"
        pattern="-?[0-9]*\.?[0-9]*"
        value={text}
        onChange={(e) => {
          const v = e.target.value;
          if (v === '' || v === '-' || /^-?\d*\.?\d*$/.test(v)) {
            setText(v);
            const n = Number(v);
            if (v !== '' && v !== '-' && !Number.isNaN(n)) {
              onChange(n);
            }
          }
        }}
        onBlur={commit}
        className="w-full bg-slate-800 text-white rounded-lg p-3 text-base tabular-nums"
      />
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between bg-slate-800 rounded-lg p-3 text-left"
    >
      <span className="text-slate-200 text-sm">{label}</span>
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${value ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
        {value ? 'SÍ' : 'NO'}
      </span>
    </button>
  );
}
