const statusStyles: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
  idle: 'bg-gray-100 text-gray-600 border-gray-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
  'on-site': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'off-site': 'bg-blue-50 text-blue-700 border-blue-200',
  unavailable: 'bg-gray-100 text-gray-600 border-gray-200',
  open: 'bg-blue-50 text-blue-700 border-blue-200',
  'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
  review: 'bg-violet-50 text-violet-700 border-violet-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  passed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-gray-100 text-gray-600 border-gray-200',
  medium: 'bg-blue-50 text-blue-700 border-blue-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
};

export function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] border capitalize tracking-wide ${style}`} style={{ fontWeight: 500 }}>
      {status.replace('-', ' ')}
    </span>
  );
}
