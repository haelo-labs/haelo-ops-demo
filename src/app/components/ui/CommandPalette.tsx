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
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-lg mx-4"
      >
        <div className="bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-900/10 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 border-b border-gray-200">
            <Search className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search pages, actions..."
              className="w-full py-4 bg-transparent text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none"
              autoFocus
            />
            <kbd className="shrink-0 text-[10px] text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded" style={{ fontWeight: 500 }}>ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[300px] overflow-auto p-2">
            {filteredPages.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-gray-500">No results found.</div>
            ) : (
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest px-2 py-1.5 block" style={{ fontWeight: 500 }}>Pages</span>
                {filteredPages.map((page, index) => (
                  <button
                    key={page.path}
                    onClick={() => {
                      navigate(page.path);
                      setOpen(false);
                      setSearch('');
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 cursor-pointer transition-all ${
                      index === selectedIndex ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                      <page.icon className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                    </div>
                    <div className="text-left">
                      <div className="text-[13px]" style={{ fontWeight: 500 }}>{page.name}</div>
                      <div className="text-[11px] text-gray-400">{page.description}</div>
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