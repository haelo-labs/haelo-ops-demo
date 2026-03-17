const statusStyles: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  maintenance: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  idle: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  critical: 'bg-red-500/15 text-red-300 border-red-500/25',
  'on-site': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  'off-site': 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  unavailable: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  open: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  'in-progress': 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  review: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  resolved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  passed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  failed: 'bg-red-500/15 text-red-300 border-red-500/25',
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  low: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  medium: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  high: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
};

export function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || 'bg-zinc-800 text-zinc-300 border-zinc-700';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] border capitalize tracking-wide ${style}`} style={{ fontWeight: 500 }}>
      {status.replace('-', ' ')}
    </span>
  );
}
