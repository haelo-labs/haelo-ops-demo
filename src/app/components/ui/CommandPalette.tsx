import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { LayoutDashboard, HardDrive, TicketCheck, ClipboardList, Users, Search } from 'lucide-react';
import { motion } from 'motion/react';

const pages = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, description: 'Overview & KPIs' },
  { name: 'Equipment', path: '/equipment', icon: HardDrive, description: 'Manage equipment units' },
  { name: 'Tickets', path: '/tickets', icon: TicketCheck, description: 'Kanban ticket board' },
  { name: 'Inspections', path: '/inspections', icon: ClipboardList, description: 'Inspection reports' },
  { name: 'Team', path: '/team', icon: Users, description: 'Team members & assignments' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const toggle = useCallback(() => setOpen(o => !o), []);

  // Filter pages based on search
  const filteredPages = useMemo(() => {
    if (!search.trim()) return pages;
    const query = search.toLowerCase();
    return pages.filter(page =>
      page.name.toLowerCase().includes(query) ||
      page.description.toLowerCase().includes(query)
    );
  }, [search]);

  // Reset selected index when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredPages]);

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
      
      if (!open) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        setSearch('');
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredPages.length - 1));
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      }

      if (e.key === 'Enter' && filteredPages[selectedIndex]) {
        e.preventDefault();
        navigate(filteredPages[selectedIndex].path);
        setOpen(false);
        setSearch('');
      }
    };
    
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggle, open, filteredPages, selectedIndex, navigate]);

  // Close on backdrop click
  const handleBackdropClick = () => {
    setOpen(false);
    setSearch('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-lg mx-4"
      >
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl shadow-black/40 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 border-b border-zinc-800">
            <Search className="w-4 h-4 text-zinc-500 shrink-0" strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search pages, actions..."
              className="w-full py-4 bg-transparent text-[14px] text-zinc-100 placeholder-zinc-500 focus:outline-none"
              autoFocus
            />
            <kbd className="shrink-0 text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded" style={{ fontWeight: 500 }}>ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[300px] overflow-auto p-2">
            {filteredPages.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-zinc-400">No results found.</div>
            ) : (
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest px-2 py-1.5 block" style={{ fontWeight: 500 }}>Pages</span>
                {filteredPages.map((page, index) => (
                  <button
                    key={page.path}
                    onClick={() => {
                      navigate(page.path);
                      setOpen(false);
                      setSearch('');
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-300 cursor-pointer transition-all ${
                      index === selectedIndex ? 'bg-zinc-900 text-zinc-100' : 'hover:bg-zinc-900/70'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-md bg-zinc-900 flex items-center justify-center shrink-0">
                      <page.icon className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
                    </div>
                    <div className="text-left">
                      <div className="text-[13px]" style={{ fontWeight: 500 }}>{page.name}</div>
                      <div className="text-[11px] text-zinc-500">{page.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
