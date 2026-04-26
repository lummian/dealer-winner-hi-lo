interface StatTileProps {
  label: string;
  value: string;
  sublabel?: string;
  tone?: 'neutral' | 'good' | 'bad' | 'hot';
}

const toneClasses: Record<NonNullable<StatTileProps['tone']>, string> = {
  neutral: 'bg-slate-800 text-slate-100',
  good: 'bg-emerald-700 text-white',
  bad: 'bg-rose-800 text-white',
  hot: 'bg-amber-500 text-slate-950'
};

export function StatTile({ label, value, sublabel, tone = 'neutral' }: StatTileProps) {
  return (
    <div
      className={`rounded-xl px-2 py-1.5 ${toneClasses[tone]} flex flex-col items-center text-center min-w-0 h-[64px] justify-between`}
    >
      <div className="text-[9px] uppercase tracking-wider opacity-75 leading-none w-full truncate">
        {label}
      </div>
      <div className="text-xl font-bold leading-none tabular-nums w-full truncate">
        {value}
      </div>
      <div className="text-[9px] opacity-70 leading-none w-full truncate">
        {sublabel ?? ' '}
      </div>
    </div>
  );
}
