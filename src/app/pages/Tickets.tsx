import { useEffect, useState } from 'react';
import { GripVertical, Plus } from 'lucide-react';
import type { Ticket } from '../types';
import { Header } from '../components/layout/Header';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';

const columns = [
  { key: 'open', label: 'Open', color: 'border-t-blue-500' },
  { key: 'in-progress', label: 'In Progress', color: 'border-t-amber-500' },
  { key: 'review', label: 'Review', color: 'border-t-violet-500' },
  { key: 'resolved', label: 'Resolved', color: 'border-t-emerald-500' }
] as const;

export function TicketsPage() {
  const {
    tickets,
    equipment,
    team,
    createTicket,
    moveTicket,
    openTicketDetails,
    closeTicketDetails,
    selectedTicketId,
    updateTicket
  } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [dragTicketId, setDragTicketId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const selectedTicket =
    selectedTicketId == null ? null : tickets.find((entry) => entry.id === selectedTicketId) || null;

  const handleDrop = (newStatus: (typeof columns)[number]['key']) => {
    if (!dragTicketId) {
      return;
    }

    moveTicket(dragTicketId, newStatus);
    setDragTicketId(null);
    setDragOverCol(null);
  };

  return (
    <>
      <Header title="Tickets" />
      <div className="flex-1 overflow-auto bg-zinc-900 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-[13px] text-zinc-500">{tickets.length} total tickets</div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-[12px] text-white transition-all hover:border-blue-700 hover:bg-blue-700"
            style={{ fontWeight: 500 }}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> New Ticket
          </button>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-full w-max gap-4">
            {columns.map((column) => {
              const columnTickets = tickets.filter((ticket) => ticket.status === column.key);
              const isDragOver = dragOverCol === column.key;

              return (
                <div
                  key={column.key}
                  className={`min-h-[400px] w-[320px] min-w-[320px] shrink-0 rounded-lg border border-zinc-800 border-t-2 ${column.color} bg-zinc-950 p-3.5 transition-all ${
                    isDragOver ? 'border-zinc-600 bg-zinc-900 shadow-lg shadow-black/20' : ''
                  }`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverCol(column.key);
                  }}
                  onDragLeave={() => setDragOverCol(null)}
                  onDrop={() => handleDrop(column.key)}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[12px] text-zinc-300" style={{ fontWeight: 600 }}>
                      {column.label}
                    </span>
                    <span
                      className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[11px] tabular-nums text-zinc-400"
                      style={{ fontWeight: 500 }}
                    >
                      {columnTickets.length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {columnTickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        draggable
                        onDragStart={() => setDragTicketId(ticket.id)}
                        onClick={() => openTicketDetails(ticket.id)}
                        className="group w-full cursor-pointer rounded-md border border-zinc-800 bg-zinc-900 p-3.5 text-left transition-all hover:border-zinc-600 hover:bg-zinc-800 active:cursor-grabbing"
                        aria-label={`${ticket.title} - ${ticket.priority} priority`}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-400"
                            strokeWidth={1.5}
                          />
                          <div className="min-w-0 flex-1">
                            <div
                              className="mb-2 text-[12px] text-zinc-100 transition-colors group-hover:text-zinc-100"
                              style={{ fontWeight: 500 }}
                            >
                              {ticket.title}
                            </div>
                            <div className="mb-3 text-[10px] text-zinc-500">
                              {ticket.unit} &middot; {ticket.createdDate}
                            </div>
                            <div className="flex items-center justify-between">
                              <StatusBadge status={ticket.priority} />
                              <div
                                className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-[9px] text-white"
                                style={{ fontWeight: 600 }}
                                title={ticket.assignee}
                              >
                                {ticket.assignee
                                  .split(' ')
                                  .map((part) => part[0])
                                  .join('')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                    {columnTickets.length === 0 && (
                      <div className="py-8 text-center text-[12px] text-zinc-600">No tickets</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <CreateTicketModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          equipment={equipment}
          team={team}
          createTicket={createTicket}
        />

        {selectedTicket && (
          <TicketDetailsModal
            ticket={selectedTicket}
            onClose={closeTicketDetails}
            equipment={equipment}
            team={team}
            updateTicket={updateTicket}
          />
        )}
      </div>
    </>
  );
}

function CreateTicketModal({
  isOpen,
  onClose,
  equipment,
  team,
  createTicket
}: {
  isOpen: boolean;
  onClose: () => void;
  equipment: ReturnType<typeof useApp>['equipment'];
  team: ReturnType<typeof useApp>['team'];
  createTicket: ReturnType<typeof useApp>['createTicket'];
}) {
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState(equipment[0]?.id || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [assignee, setAssignee] = useState(team[0]?.name || '');
  const [desc, setDesc] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      return;
    }

    createTicket({
      title,
      unit,
      priority,
      assignee,
      description: desc
    });
    setTitle('');
    setDesc('');
    onClose();
  };

  const inputClass =
    'w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 transition-colors placeholder-zinc-500 hover:border-zinc-600 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Ticket">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
            Title
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter ticket title"
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
              Unit
            </label>
            <select value={unit} onChange={(event) => setUnit(event.target.value)} className={inputClass}>
              {equipment.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.id} — {entry.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
              Priority
            </label>
            <select value={priority} onChange={(event) => setPriority(event.target.value as typeof priority)} className={inputClass}>
              {['low', 'medium', 'high', 'critical'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
            Assignee
          </label>
          <select value={assignee} onChange={(event) => setAssignee(event.target.value)} className={inputClass}>
            {team.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name} — {member.role}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
            Description
          </label>
          <textarea
            value={desc}
            onChange={(event) => setDesc(event.target.value)}
            rows={4}
            placeholder="Describe the issue..."
            className={`${inputClass} resize-none`}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-md border border-zinc-800 px-4 py-2 text-[12px] text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-100"
            style={{ fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-[12px] text-white transition-all hover:border-blue-700 hover:bg-blue-700"
            style={{ fontWeight: 500 }}
          >
            Create Ticket
          </button>
        </div>
      </div>
    </Modal>
  );
}

function TicketDetailsModal({
  ticket,
  onClose,
  equipment,
  team,
  updateTicket
}: {
  ticket: Ticket;
  onClose: () => void;
  equipment: ReturnType<typeof useApp>['equipment'];
  team: ReturnType<typeof useApp>['team'];
  updateTicket: ReturnType<typeof useApp>['updateTicket'];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(ticket.title);
  const [unit, setUnit] = useState(ticket.unit);
  const [priority, setPriority] = useState(ticket.priority);
  const [assignee, setAssignee] = useState(ticket.assignee);
  const [desc, setDesc] = useState(ticket.description);

  useEffect(() => {
    setIsEditing(false);
    setTitle(ticket.title);
    setUnit(ticket.unit);
    setPriority(ticket.priority);
    setAssignee(ticket.assignee);
    setDesc(ticket.description);
  }, [ticket]);

  const handleSubmit = () => {
    if (!title.trim()) {
      return;
    }

    updateTicket({
      ticketId: ticket.id,
      title,
      unit,
      priority,
      assignee,
      description: desc
    });
    setIsEditing(false);
  };

  const inputClass =
    'w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 transition-colors placeholder-zinc-500 hover:border-zinc-600 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

  return (
    <Modal isOpen={true} onClose={onClose} title={`Ticket ${ticket.id}`}>
      {!isEditing ? (
        <div className="space-y-4">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="mb-3 text-[15px] text-zinc-100" style={{ fontWeight: 600 }}>
              {ticket.title}
            </h3>
            <div className="flex items-center gap-3">
              <StatusBadge status={ticket.status} />
              <StatusBadge status={ticket.priority} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
                Unit
              </label>
              <div className="text-[13px] text-zinc-100">{ticket.unit}</div>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
                Assignee
              </label>
              <div className="text-[13px] text-zinc-100">{ticket.assignee}</div>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
                Created Date
              </label>
              <div className="text-[13px] text-zinc-100">{ticket.createdDate}</div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
              Description
            </label>
            <div className="whitespace-pre-wrap text-[13px] text-zinc-300">
              {ticket.description || 'No description provided'}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="rounded-md border border-zinc-800 px-4 py-2 text-[12px] text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-100"
              style={{ fontWeight: 500 }}
            >
              Close
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-[12px] text-white transition-all hover:border-blue-700 hover:bg-blue-700"
              style={{ fontWeight: 500 }}
            >
              Edit Ticket
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
              Title
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter ticket title"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
                Unit
              </label>
              <select value={unit} onChange={(event) => setUnit(event.target.value)} className={inputClass}>
                {equipment.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.id} — {entry.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
                Priority
              </label>
              <select value={priority} onChange={(event) => setPriority(event.target.value as typeof priority)} className={inputClass}>
                {['low', 'medium', 'high', 'critical'].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
              Assignee
            </label>
            <select value={assignee} onChange={(event) => setAssignee(event.target.value)} className={inputClass}>
              {team.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name} — {member.role}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
              Description
            </label>
            <textarea
              value={desc}
              onChange={(event) => setDesc(event.target.value)}
              rows={4}
              placeholder="Describe the issue..."
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-zinc-800 px-4 py-2 text-[12px] text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-100"
              style={{ fontWeight: 500 }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-[12px] text-white transition-all hover:border-blue-700 hover:bg-blue-700"
              style={{ fontWeight: 500 }}
            >
              Update Ticket
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
