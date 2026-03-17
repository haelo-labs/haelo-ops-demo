import { NavLink } from 'react-router';
import { LayoutDashboard, HardDrive, ClipboardList, Users, TicketCheck, Radio } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/equipment', icon: HardDrive, label: 'Equipment' },
  { to: '/tickets', icon: TicketCheck, label: 'Tickets' },
  { to: '/inspections', icon: ClipboardList, label: 'Inspections' },
  { to: '/team', icon: Users, label: 'Team' },
];

export function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-zinc-950 text-zinc-100 flex flex-col shrink-0 border-r border-zinc-800">
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
          <Radio className="w-4 h-4 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <div className="text-[14px] text-zinc-100 tracking-tight" style={{ fontWeight: 600 }}>Haelō Ops</div>
          
        </div>
      </div>

      

      <nav className="flex-1 px-3">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md mb-0.5 transition-all text-[13px] border ${
                isActive
                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                  : 'text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-zinc-100 hover:border-zinc-700'
              }`
            }
          >
            <item.icon className="w-4 h-4" strokeWidth={1.5} />
            <span style={{ fontWeight: 500 }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 mx-3 mb-4 rounded-md bg-zinc-900 border border-zinc-800">
        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2" style={{ fontWeight: 500 }}>System</div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
          <span className="text-[12px] text-zinc-300">All Systems Operational</span>
        </div>
      </div>
    </aside>
  );
}
