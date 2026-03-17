import { Bell, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Header({ title }: { title: string }) {
  const { tickets } = useApp();
  const criticalCount = tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length;

  const triggerCmdK = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-8 shrink-0">
      <h1 className="text-[16px] text-zinc-100 tracking-tight" style={{ fontWeight: 600 }}>{title}</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={triggerCmdK}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 hover:border-zinc-600 hover:bg-zinc-900 transition-all text-zinc-400 hover:text-zinc-100"
        >
          <Search className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="text-[12px]" style={{ fontWeight: 400 }}>Search</span>
          <kbd className="text-[10px] text-zinc-500 bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded ml-2" style={{ fontWeight: 500 }}>
            <span className="text-[9px]">&#8984;</span>K
          </kbd>
        </button>
        <button className="relative p-2 rounded-md border border-transparent hover:border-zinc-700 hover:bg-zinc-900 transition-all">
          <Bell className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
          {criticalCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center" style={{ fontWeight: 600 }}>
              {criticalCount}
            </span>
          )}
        </button>
        <div className="ml-1 w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white text-[12px] border border-transparent hover:border-zinc-600 transition-all cursor-pointer" style={{ fontWeight: 600 }}>
          DP
        </div>
      </div>
    </header>
  );
}
