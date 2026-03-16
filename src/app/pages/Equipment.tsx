import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import type { Equipment as EquipmentType } from '../types';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const statusTabs = ['all', 'active', 'maintenance', 'critical', 'idle'] as const;

export function EquipmentPage() {
  const { equipment, tickets, addActivity } = useApp();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketUnit, setTicketUnit] = useState('');

  const filtered = activeTab === 'all' ? equipment : equipment.filter(e => e.status === activeTab);
  const unitTickets = selectedEquipment ? tickets.filter(t => t.unit === selectedEquipment.id) : [];

  return (
    <>
      <Header title="Equipment" />
      <div className="flex-1 overflow-auto bg-gray-50 p-8">
        {/* Status Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-md border border-gray-200 p-1 w-fit">
          {statusTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded text-[12px] capitalize transition-all border ${
                activeTab === tab
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'
              }`}
              style={{ fontWeight: 500 }}
            >
              {tab} {tab !== 'all' && `(${equipment.filter(e => e.status === tab).length})`}
              {tab === 'all' && ` (${equipment.length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {['Unit ID', 'Name', 'Type', 'Status', 'Last Inspection', 'Next Maintenance', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[11px] text-gray-500 uppercase tracking-wider px-5 py-3.5" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-[13px] text-gray-500">No equipment found with this status.</td></tr>
              ) : (
                filtered.map(eq => (
                  <tr 
                    key={eq.id} 
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all group cursor-pointer" 
                    onClick={(e) => {
                      // Don't trigger row click if clicking on action buttons
                      if ((e.target as HTMLElement).closest('button')) return;
                      setSelectedEquipment(eq);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        // Don't trigger if focus is on a button inside the row
                        if ((e.target as HTMLElement).tagName === 'BUTTON') return;
                        e.preventDefault();
                        setSelectedEquipment(eq);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View equipment ${eq.id}: ${eq.name}`}
                  >
                    <td className="px-5 py-3.5 text-[12px] text-gray-500 tabular-nums group-hover:text-gray-700 transition-colors" style={{ fontWeight: 500 }}>{eq.id}</td>
                    <td className="px-5 py-3.5 text-[12px] text-gray-900" style={{ fontWeight: 500 }}>{eq.name}</td>
                    <td className="px-5 py-3.5 text-[12px] text-gray-500 group-hover:text-gray-700 transition-colors">{eq.type}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={eq.status} /></td>
                    <td className="px-5 py-3.5 text-[12px] text-gray-500 tabular-nums">{eq.lastInspection}</td>
                    <td className="px-5 py-3.5 text-[12px] text-gray-500 tabular-nums">{eq.nextMaintenance}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setTicketUnit(eq.id); setShowTicketModal(true); }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] text-blue-700 bg-blue-50 border border-blue-200 hover:border-blue-400 hover:bg-blue-100 transition-all"
                        style={{ fontWeight: 500 }}
                      >
                        <Plus className="w-3 h-3" strokeWidth={1.5} /> Ticket
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        <Modal isOpen={!!selectedEquipment} onClose={() => setSelectedEquipment(null)} title="Equipment Details" maxWidth="max-w-2xl">
          {selectedEquipment && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Unit ID', selectedEquipment.id],
                  ['Name', selectedEquipment.name],
                  ['Type', selectedEquipment.type],
                  ['Location', selectedEquipment.location],
                  ['Last Inspection', selectedEquipment.lastInspection],
                  ['Next Maintenance', selectedEquipment.nextMaintenance],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1" style={{ fontWeight: 500 }}>{label}</div>
                    <div className="text-[13px] text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1" style={{ fontWeight: 500 }}>Status</div>
                <StatusBadge status={selectedEquipment.status} />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1" style={{ fontWeight: 500 }}>Notes</div>
                <div className="text-[13px] text-gray-600">{selectedEquipment.notes}</div>
              </div>
              {unitTickets.length > 0 && (
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2" style={{ fontWeight: 500 }}>Assigned Tickets ({unitTickets.length})</div>
                  <div className="space-y-2">
                    {unitTickets.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 rounded-md border border-gray-100 hover:border-gray-400 hover:bg-gray-50 transition-all">
                        <div>
                          <div className="text-[12px] text-gray-900" style={{ fontWeight: 500 }}>{t.title}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{t.id} &middot; {t.assignee}</div>
                        </div>
                        <div className="flex gap-2">
                          <StatusBadge status={t.priority} />
                          <StatusBadge status={t.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Quick Ticket Modal */}
        <QuickTicketModal
          isOpen={showTicketModal}
          onClose={() => setShowTicketModal(false)}
          unitId={ticketUnit}
          addActivity={addActivity}
        />
      </div>
    </>
  );
}

function QuickTicketModal({ isOpen, onClose, unitId, addActivity }: { isOpen: boolean; onClose: () => void; unitId: string; addActivity: (a: string, t: 'ticket') => void }) {
  const { team, setTickets } = useApp();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [assignee, setAssignee] = useState(team[0]?.name || '');
  const [desc, setDesc] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    const newTicket = {
      id: `TK-${Date.now().toString().slice(-4)}`,
      title,
      unit: unitId,
      priority,
      status: 'open' as const,
      assignee,
      createdDate: new Date().toISOString().split('T')[0],
      description: desc,
    };
    setTickets(prev => [...prev, newTicket]);
    addActivity(`Ticket ${newTicket.id} created: ${title}`, 'ticket');
    toast.success('Ticket created successfully');
    setTitle(''); setDesc('');
    onClose();
  };

  const inputClass = "w-full px-3 py-2 rounded-md bg-white border border-gray-200 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 hover:border-gray-400 transition-colors";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Create Ticket — ${unitId}`}>
      <div className="space-y-4">
        <div>
          <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value as typeof priority)} className={inputClass}>
              {['low', 'medium', 'high', 'critical'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Assignee</label>
            <select value={assignee} onChange={e => setAssignee(e.target.value)} className={inputClass}>
              {team.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-[12px] text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all" style={{ fontWeight: 500 }}>Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-md text-[12px] text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all" style={{ fontWeight: 500 }}>Create Ticket</button>
        </div>
      </div>
    </Modal>
  );
}