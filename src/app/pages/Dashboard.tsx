import { Header } from '../components/layout/Header';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Sparkline } from '../components/ui/Sparkline';
import { Activity, AlertTriangle, CheckCircle, HardDrive, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Modal } from '../components/ui/Modal';
import type { Ticket, Equipment } from '../types';

const sparklineData = {
  equipment: [8, 8, 9, 9, 9, 10, 10, 10],
  active: [3, 4, 4, 5, 4, 5, 5, 5],
  tickets: [2, 3, 4, 3, 5, 6, 5, 5],
  critical: [1, 1, 2, 2, 3, 2, 3, 3],
};

export function Dashboard() {
  const { equipment, tickets, activities } = useApp();

  const activeUnits = equipment.filter(e => e.status === 'active').length;
  const openTickets = tickets.filter(t => t.status !== 'resolved').length;
  const criticalAlerts = tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length;

  const kpis = [
    { label: 'Total Equipment', value: equipment.length, icon: HardDrive, iconColor: 'text-blue-600', bgColor: 'bg-blue-50', sparkColor: '#2563eb', sparkData: sparklineData.equipment },
    { label: 'Active Units', value: activeUnits, icon: CheckCircle, iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50', sparkColor: '#059669', sparkData: sparklineData.active },
    { label: 'Open Tickets', value: openTickets, icon: Clock, iconColor: 'text-amber-600', bgColor: 'bg-amber-50', sparkColor: '#d97706', sparkData: sparklineData.tickets },
    { label: 'Critical Alerts', value: criticalAlerts, icon: AlertTriangle, iconColor: 'text-red-600', bgColor: 'bg-red-50', sparkColor: '#dc2626', sparkData: sparklineData.critical },
  ];

  const topTickets = [...tickets]
    .filter(t => t.status !== 'resolved')
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return order[a.priority] - order[b.priority];
    })
    .slice(0, 5);

  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleEquipmentClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
  };

  const handleKpiClick = (label: string) => {
    switch (label) {
      case 'Total Equipment':
        navigate('/equipment');
        break;
      case 'Active Units':
        navigate('/equipment');
        break;
      case 'Open Tickets':
        navigate('/tickets');
        break;
      case 'Critical Alerts':
        navigate('/tickets');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 overflow-auto bg-gray-50 p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {kpis.map(kpi => (
            <button key={kpi.label} onClick={() => handleKpiClick(kpi.label)} className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-400 hover:shadow-sm transition-all cursor-pointer group text-left w-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] text-gray-500 uppercase tracking-wider" style={{ fontWeight: 500 }}>{kpi.label}</span>
                <div className={`w-8 h-8 rounded-md ${kpi.bgColor} flex items-center justify-center`}>
                  <kpi.icon className={`w-3.5 h-3.5 ${kpi.iconColor}`} strokeWidth={1.5} />
                </div>
              </div>
              <div className="text-[28px] text-gray-900 tabular-nums" style={{ fontWeight: 700 }}>{kpi.value}</div>
              <Sparkline data={kpi.sparkData} color={kpi.sparkColor} />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Equipment Status Grid */}
          <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-[14px] text-gray-900 mb-4 tracking-tight" style={{ fontWeight: 600 }}>Equipment Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {equipment.map(eq => (
                <button key={eq.id} className="flex items-center justify-between p-3.5 rounded-md border border-gray-100 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer text-left w-full" onClick={() => handleEquipmentClick(eq)}>
                  <div>
                    <div className="text-[13px] text-gray-900" style={{ fontWeight: 500 }}>{eq.name}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{eq.id} &middot; {eq.type}</div>
                  </div>
                  <StatusBadge status={eq.status} />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-[14px] text-gray-900 mb-4 tracking-tight" style={{ fontWeight: 600 }}>Recent Activity</h3>
            <div className="space-y-1">
              {activities.slice(0, 8).map(act => (
                <div key={act.id} className="flex gap-3 p-2 rounded-md hover:bg-gray-50 transition-all group cursor-default">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                    act.type === 'ticket' ? 'bg-blue-50' : act.type === 'equipment' ? 'bg-amber-50' : act.type === 'inspection' ? 'bg-emerald-50' : 'bg-violet-50'
                  }`}>
                    <Activity className={`w-3 h-3 ${
                      act.type === 'ticket' ? 'text-blue-600' : act.type === 'equipment' ? 'text-amber-600' : act.type === 'inspection' ? 'text-emerald-600' : 'text-violet-600'
                    }`} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">{act.action}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {format(new Date(act.timestamp), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Open Tickets Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-[14px] text-gray-900 mb-4 tracking-tight" style={{ fontWeight: 600 }}>Top Priority Tickets</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 pr-4" style={{ fontWeight: 500 }}>ID</th>
                <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 pr-4" style={{ fontWeight: 500 }}>Title</th>
                <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 pr-4" style={{ fontWeight: 500 }}>Unit</th>
                <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 pr-4" style={{ fontWeight: 500 }}>Priority</th>
                <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 pr-4" style={{ fontWeight: 500 }}>Status</th>
                <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3" style={{ fontWeight: 500 }}>Assignee</th>
              </tr>
            </thead>
            <tbody>
              {topTickets.map(t => (
                <tr 
                  key={t.id} 
                  className="border-b border-gray-100 last:border-0 group cursor-pointer hover:bg-gray-50 transition-colors" 
                  onClick={() => handleTicketClick(t)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleTicketClick(t); } }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ticket ${t.id}: ${t.title}`}
                >
                  <td className="py-3 pr-4 text-[12px] text-gray-500 tabular-nums group-hover:text-gray-700 transition-colors" style={{ fontWeight: 500 }}>{t.id}</td>
                  <td className="py-3 pr-4 text-[12px] text-gray-900 group-hover:text-gray-900 transition-colors" style={{ fontWeight: 500 }}>{t.title}</td>
                  <td className="py-3 pr-4 text-[12px] text-gray-500 group-hover:text-gray-700 transition-colors">{t.unit}</td>
                  <td className="py-3 pr-4"><StatusBadge status={t.priority} /></td>
                  <td className="py-3 pr-4"><StatusBadge status={t.status} /></td>
                  <td className="py-3 text-[12px] text-gray-600 group-hover:text-gray-900 transition-colors">{t.assignee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <Modal isOpen={true} onClose={() => setSelectedTicket(null)} title={`Ticket ${selectedTicket.id}`}>
          <div className="space-y-3">
            <div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Title</div>
              <div className="text-[13px] text-gray-900" style={{ fontWeight: 500 }}>{selectedTicket.title}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Unit</div>
                <div className="text-[13px] text-gray-600">{selectedTicket.unit}</div>
              </div>
              <div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Assignee</div>
                <div className="text-[13px] text-gray-600">{selectedTicket.assignee}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Priority</div>
                <StatusBadge status={selectedTicket.priority} />
              </div>
              <div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Status</div>
                <StatusBadge status={selectedTicket.status} />
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Description</div>
              <div className="text-[13px] text-gray-700 whitespace-pre-wrap">{selectedTicket.description || 'No description provided'}</div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => { setSelectedTicket(null); navigate('/tickets'); }}
                className="px-4 py-2 rounded-md text-[12px] text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all" 
                style={{ fontWeight: 500 }}
              >
                Go to Tickets
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Equipment Modal */}
      {selectedEquipment && (
        <Modal isOpen={true} onClose={() => setSelectedEquipment(null)} title={`Equipment ${selectedEquipment.id}`}>
          <div className="space-y-3">
            <div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Name</div>
              <div className="text-[13px] text-gray-900" style={{ fontWeight: 500 }}>{selectedEquipment.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Type</div>
                <div className="text-[13px] text-gray-600">{selectedEquipment.type}</div>
              </div>
              <div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Location</div>
                <div className="text-[13px] text-gray-600">{selectedEquipment.location}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Last Inspection</div>
                <div className="text-[13px] text-gray-600">{selectedEquipment.lastInspection}</div>
              </div>
              <div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Next Maintenance</div>
                <div className="text-[13px] text-gray-600">{selectedEquipment.nextMaintenance}</div>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Status</div>
              <StatusBadge status={selectedEquipment.status} />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Notes</div>
              <div className="text-[13px] text-gray-700">{selectedEquipment.notes}</div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => { setSelectedEquipment(null); navigate('/equipment'); }}
                className="px-4 py-2 rounded-md text-[12px] text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all" 
                style={{ fontWeight: 500 }}
              >
                Go to Equipment
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}