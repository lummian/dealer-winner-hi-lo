import type { Rank } from '../lib/types';

interface CardButtonProps {
  rank: Rank;
  countDelta: number;
  onPress: () => void;
}

const PRIMARY: Record<Rank, string> = {
  '2': '2', '3': '3', '4': '4', '5': '5', '6': '6',
  '7': '7', '8': '8', '9': '9', T: '10', A: 'A'
};

const SECONDARY: Partial<Record<Rank, string>> = {
  T: 'J Q K'
};

function colorFor(delta: number): string {
  if (delta > 0) return 'bg-emerald-600 active:bg-emerald-500 border-emerald-400';
  if (delta < 0) return 'bg-rose-700 active:bg-rose-600 border-rose-500';
  return 'bg-slate-700 active:bg-slate-600 border-slate-500';
}

function deltaLabel(delta: number): string {
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `${delta}`;
  return '0';
}

export function CardButton({ rank, countDelta, onPress }: CardButtonProps) {
  const secondary = SECONDARY[rank];
  return (
    <button
      type="button"
      onPointerDown={onPress}
      className={`${colorFor(countDelta)} text-white rounded-2xl border-2 shadow-lg flex flex-col items-center justify-center font-bold transition-transform active:scale-95 select-none aspect-[3/4] overflow-hidden px-1`}
    >
      <span className="text-4xl leading-none">{PRIMARY[rank]}</span>
      {secondary && (
        <span className="text-[10px] tracking-wider opacity-80 mt-0.5 leading-none">{secondary}</span>
      )}
      <span className="text-xs opacity-80 mt-1 leading-none">{deltaLabel(countDelta)}</span>
    </button>
  );
}
