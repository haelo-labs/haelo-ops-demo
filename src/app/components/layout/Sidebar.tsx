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
    <aside className="w-60 min-h-screen bg-white text-gray-900 flex flex-col shrink-0 border-r border-gray-200">
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
          <Radio className="w-4 h-4 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <div className="text-[14px] text-gray-900 tracking-tight" style={{ fontWeight: 600 }}>Haelō Ops</div>
          
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
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300'
              }`
            }
          >
            <item.icon className="w-4 h-4" strokeWidth={1.5} />
            <span style={{ fontWeight: 500 }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 mx-3 mb-4 rounded-md bg-gray-50 border border-gray-200">
        <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2" style={{ fontWeight: 500 }}>System</div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
          <span className="text-[12px] text-gray-600">All Systems Operational</span>
        </div>
      </div>
    </aside>
  );
}
