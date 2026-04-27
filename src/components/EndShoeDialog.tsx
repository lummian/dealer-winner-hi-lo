import { useState } from 'react';

interface EndShoeDialogProps {
  unitSize: number;
  startBalance: number | null;
  onConfirm: (endBalance: number) => void;
  onSkip: () => void;
  onCancel: () => void;
}

export function EndShoeDialog({
  unitSize,
  startBalance,
  onConfirm,
  onSkip,
  onCancel
}: EndShoeDialogProps) {
  const [endStr, setEndStr] = useState('');

  const end = parseFloat(endStr);
  const endValid = Number.isFinite(end) && end >= 0;
  const canConfirm = endValid && startBalance !== null && unitSize > 0;

  const netMoney = canConfirm && startBalance !== null ? end - startBalance : 0;
  const netUnits = canConfirm ? netMoney / unitSize : 0;
  const tone =
    netUnits > 0.5 ? 'text-emerald-400' : netUnits < -0.5 ? 'text-rose-400' : 'text-slate-300';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur safe-fixed flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div>
          <h2 className="text-lg font-bold">Cerrar zapato</h2>
          {startBalance !== null ? (
            <p className="text-xs text-slate-400 mt-0.5">
              Arrancaste con <span className="text-slate-200 font-semibold tabular-nums">${startBalance.toLocaleString()}</span>. Anotá el balance actual.
            </p>
          ) : (
            <p className="text-xs text-amber-300 mt-0.5">
              No anotaste el balance inicial. Saltá este zapato y trackeá desde el próximo.
            </p>
          )}
        </div>

        {startBalance !== null && (
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Balance final
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={endStr}
              onChange={(e) => setEndStr(e.target.value)}
              placeholder="0"
              autoFocus
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 text-white text-lg tabular-nums border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
          </label>
        )}

        {startBalance !== null && (
          <div className="bg-slate-800 rounded-lg p-2.5 text-center">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Resultado</div>
            {canConfirm ? (
              <div className={`text-2xl font-extrabold tabular-nums ${tone}`}>
                {netUnits >= 0 ? '+' : ''}
                {netUnits.toFixed(1)}u{' '}
                <span className="text-base font-bold opacity-80">
                  ({netMoney >= 0 ? '+' : ''}${Math.round(netMoney).toLocaleString()})
                </span>
              </div>
            ) : (
              <div className="text-sm text-slate-500">Ingresá el balance final</div>
            )}
            <div className="text-[10px] text-slate-500 mt-0.5">
              unidad = ${unitSize.toLocaleString()}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={onCancel}
            className="py-2.5 rounded-lg bg-slate-700 text-sm font-semibold active:bg-slate-600"
          >
            Cancelar
          </button>
          <button
            onClick={onSkip}
            className="py-2.5 rounded-lg bg-slate-800 text-sm font-semibold text-slate-300 active:bg-slate-700"
          >
            Saltar
          </button>
          <button
            onClick={() => {
              if (canConfirm) onConfirm(end);
            }}
            disabled={!canConfirm}
            className="py-2.5 rounded-lg bg-emerald-600 text-sm font-bold active:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600"
          >
            Guardar
          </button>
        </div>

        <p className="text-[10px] text-slate-500 leading-snug">
          <strong>Saltar</strong>: reinicia el zapato sin registrar.
        </p>
      </div>
    </div>
  );
}
