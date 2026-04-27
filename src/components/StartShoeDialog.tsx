import { useState } from 'react';

interface StartShoeDialogProps {
  unitSize: number;
  onConfirm: (balance: number) => void;
  onCancel: () => void;
}

export function StartShoeDialog({ unitSize, onConfirm, onCancel }: StartShoeDialogProps) {
  const [balanceStr, setBalanceStr] = useState('');
  const balance = parseFloat(balanceStr);
  const valid = Number.isFinite(balance) && balance >= 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur safe-fixed flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div>
          <h2 className="text-lg font-bold">Balance inicial</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Anotalo ahora antes de jugar la primera mano. Al cerrar el zapato solo te voy a pedir el final.
          </p>
        </div>

        <label className="block">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">
            ¿Con cuánto arrancás este zapato?
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={balanceStr}
            onChange={(e) => setBalanceStr(e.target.value)}
            placeholder="0"
            autoFocus
            className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 text-white text-lg tabular-nums border border-slate-700 focus:outline-none focus:border-emerald-500"
          />
        </label>

        <div className="text-[10px] text-slate-500 text-center">
          unidad = ${unitSize.toLocaleString()}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onCancel}
            className="py-2.5 rounded-lg bg-slate-700 text-sm font-semibold active:bg-slate-600"
          >
            Cancelar
          </button>
          <button
            onClick={() => { if (valid) onConfirm(balance); }}
            disabled={!valid}
            className="py-2.5 rounded-lg bg-emerald-600 text-sm font-bold active:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
