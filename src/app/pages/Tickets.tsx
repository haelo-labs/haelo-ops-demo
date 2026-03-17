import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { Plus, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import type { Ticket } from '../types';

const columns = [
  { key: 'open', label: 'Open', color: 'border-t-blue-500' },
  { key: 'in-progress', label: 'In Progress', color: 'border-t-amber-500' },
  { key: 'review', label: 'Review', color: 'border-t-violet-500' },
  { key: 'resolved', label: 'Resolved', color: 'border-t-emerald-500' },
] as const;

export function TicketsPage() {
  const { tickets, setTickets, equipment, team, addActivity } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [dragTicketId, setDragTicketId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<typeof tickets[number] | null>(null);

  const handleDrop = (newStatus: typeof columns[number]['key']) => {
    if (!dragTicketId) return;
    setTickets(prev => prev.map(t => t.id === dragTicketId ? { ...t, status: newStatus } : t));
    const ticket = tickets.find(t => t.id === dragTicketId);
    if (ticket) {
      addActivity(`Ticket ${ticket.id} moved to ${newStatus.replace('-', ' ')}`, 'ticket');
      toast.success(`Ticket moved to ${newStatus.replace('-', ' ')}`);
    }
    setDragTicketId(null);
    setDragOverCol(null);
  };

  return (
    <>
      <Header title="Tickets" />
      <div className="flex-1 overflow-auto bg-zinc-900 p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-[13px] text-zinc-500">{tickets.length} total tickets</div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-[12px] text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all"
            style={{ fontWeight: 500 }}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> New Ticket
          </button>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-2">
          <div className="flex w-max min-w-full gap-4">
            {columns.map(col => {
              const colTickets = tickets.filter(t => t.status === col.key);
              const isDragOver = dragOverCol === col.key;
              return (
                <div
                  key={col.key}
                  className={`w-[320px] min-w-[320px] shrink-0 bg-zinc-950 rounded-lg p-3.5 border-t-2 ${col.color} border border-zinc-800 min-h-[400px] transition-all ${
                    isDragOver ? 'border-zinc-600 bg-zinc-900 shadow-lg shadow-black/20' : ''
                  }`}
                  onDragOver={e => { e.preventDefault(); setDragOverCol(col.key); }}
                  onDragLeave={() => setDragOverCol(null)}
                  onDrop={() => handleDrop(col.key)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[12px] text-zinc-300" style={{ fontWeight: 600 }}>{col.label}</span>
                    <span className="text-[11px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 tabular-nums" style={{ fontWeight: 500 }}>{colTickets.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {colTickets.map(ticket => (
                      <button
                        key={ticket.id}
                        draggable
                        onDragStart={() => setDragTicketId(ticket.id)}
                        onClick={() => setSelectedTicket(ticket)}
                        className="bg-zinc-900 rounded-md p-3.5 border border-zinc-800 cursor-pointer active:cursor-grabbing hover:border-zinc-600 hover:bg-zinc-800 transition-all group w-full text-left"
                        aria-label={`${ticket.title} - ${ticket.priority} priority`}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 mt-0.5 shrink-0 transition-colors" strokeWidth={1.5} />
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] text-zinc-100 group-hover:text-zinc-100 mb-2 transition-colors" style={{ fontWeight: 500 }}>{ticket.title}</div>
                            <div className="text-[10px] text-zinc-500 mb-3">{ticket.unit} &middot; {ticket.createdDate}</div>
                            <div className="flex items-center justify-between">
                              <StatusBadge status={ticket.priority} />
                              <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-[9px]" style={{ fontWeight: 600 }} title={ticket.assignee}>
                                {ticket.assignee.split(' ').map(n => n[0]).join('')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                    {colTickets.length === 0 && (
                      <div className="text-center py-8 text-[12px] text-zinc-600">No tickets</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Ticket Modal */}
        <CreateTicketModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          equipment={equipment}
          team={team}
          setTickets={setTickets}
          addActivity={addActivity}
        />

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <TicketDetailsModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            equipment={equipment}
            team={team}
            setTickets={setTickets}
            addActivity={addActivity}
          />
        )}
      </div>
    </>
  );
}

function CreateTicketModal({ isOpen, onClose, equipment, team, setTickets, addActivity }: {
  isOpen: boolean;
  onClose: () => void;
  equipment: ReturnType<typeof useApp>['equipment'];
  team: ReturnType<typeof useApp>['team'];
  setTickets: ReturnType<typeof useApp>['setTickets'];
  addActivity: ReturnType<typeof useApp>['addActivity'];
}) {
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState(equipment[0]?.id || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [assignee, setAssignee] = useState(team[0]?.name || '');
  const [desc, setDesc] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    const newTicket: Ticket = {
      id: `TK-${Date.now().toString().slice(-4)}`,
      title,
      unit,
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

  const inputClass = "w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-[13px] text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-zinc-500 hover:border-zinc-600 transition-colors";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Ticket">
      <div className="space-y-4">
        <div>
          <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter ticket title" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Unit</label>
            <select value={unit} onChange={e => setUnit(e.target.value)} className={inputClass}>
              {equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.id} — {eq.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value as typeof priority)} className={inputClass}>
              {['low', 'medium', 'high', 'critical'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Assignee</label>
          <select value={assignee} onChange={e => setAssignee(e.target.value)} className={inputClass}>
            {team.map(m => <option key={m.id} value={m.name}>{m.name} — {m.role}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} placeholder="Describe the issue..." className={`${inputClass} resize-none`} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-[12px] text-zinc-300 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-100 hover:bg-zinc-900 transition-all" style={{ fontWeight: 500 }}>Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-md text-[12px] text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all" style={{ fontWeight: 500 }}>Create Ticket</button>
        </div>
      </div>
    </Modal>
  );
}

function TicketDetailsModal({ ticket, onClose, equipment, team, setTickets, addActivity }: {
  ticket: Ticket;
  onClose: () => void;
  equipment: ReturnType<typeof useApp>['equipment'];
  team: ReturnType<typeof useApp>['team'];
  setTickets: ReturnType<typeof useApp>['setTickets'];
  addActivity: ReturnType<typeof useApp>['addActivity'];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(ticket.title);
  const [unit, setUnit] = useState(ticket.unit);
  const [priority, setPriority] = useState(ticket.priority);
  const [assignee, setAssignee] = useState(ticket.assignee);
  const [desc, setDesc] = useState(ticket.description);

  const handleSubmit = () => {
    if (!title.trim()) return;
    const updatedTicket: Ticket = {
      ...ticket,
      title,
      unit,
      priority,
      assignee,
      description: desc,
    };
    setTickets(prev => prev.map(t => t.id === ticket.id ? updatedTicket : t));
    addActivity(`Ticket ${ticket.id} updated: ${title}`, 'ticket');
    toast.success('Ticket updated successfully');
    setIsEditing(false);
  };

  const inputClass = "w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-[13px] text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-zinc-500 hover:border-zinc-600 transition-colors";

  return (
    <Modal isOpen={true} onClose={onClose} title={`Ticket ${ticket.id}`}>
      {!isEditing ? (
        <div className="space-y-4">
          {/* Read-only view */}
          <div className="pb-4 border-b border-zinc-800">
            <h3 className="text-[15px] text-zinc-100 mb-3" style={{ fontWeight: 600 }}>{ticket.title}</h3>
            <div className="flex items-center gap-3">
              <StatusBadge status={ticket.status} />
              <StatusBadge status={ticket.priority} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Unit</label>
              <div className="text-[13px] text-zinc-100">{ticket.unit}</div>
            </div>
            <div>
              <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Assignee</label>
              <div className="text-[13px] text-zinc-100">{ticket.assignee}</div>
            </div>
            <div>
              <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Created Date</label>
              <div className="text-[13px] text-zinc-100">{ticket.createdDate}</div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Description</label>
            <div className="text-[13px] text-zinc-300 whitespace-pre-wrap">{ticket.description || 'No description provided'}</div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-4 py-2 rounded-md text-[12px] text-zinc-300 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-100 hover:bg-zinc-900 transition-all" style={{ fontWeight: 500 }}>Close</button>
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-md text-[12px] text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all" style={{ fontWeight: 500 }}>Edit Ticket</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Edit mode */}
          <div>
            <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter ticket title" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Unit</label>
              <select value={unit} onChange={e => setUnit(e.target.value)} className={inputClass}>
                {equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.id} — {eq.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as typeof priority)} className={inputClass}>
                {['low', 'medium', 'high', 'critical'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Assignee</label>
            <select value={assignee} onChange={e => setAssignee(e.target.value)} className={inputClass}>
              {team.map(m => <option key={m.id} value={m.name}>{m.name} — {m.role}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} placeholder="Describe the issue..." className={`${inputClass} resize-none`} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-md text-[12px] text-zinc-300 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-100 hover:bg-zinc-900 transition-all" style={{ fontWeight: 500 }}>Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded-md text-[12px] text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all" style={{ fontWeight: 500 }}>Update Ticket</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
