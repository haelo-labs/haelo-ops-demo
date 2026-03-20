import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Sidebar } from './Sidebar';
import { CommandPalette } from '../ui/CommandPalette';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../../context/AppContext';

export function Layout() {
  const location = useLocation();
  const { syncUiToRoute } = useApp();

  useEffect(() => {
    syncUiToRoute(location.pathname);
  }, [location.pathname, syncUiToRoute]);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
      <CommandPalette />
    </div>
  );
}
