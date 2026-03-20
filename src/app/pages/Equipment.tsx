import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';

const statusTabs = ['all', 'active', 'maintenance', 'critical', 'idle'] as const;

export function EquipmentPage() {
  const {
    equipment,
    tickets,
    team,
    equipmentStatusFilter,
    selectedEquipmentId,
    equipmentTicketUnitId,
    closeEquipmentDetails,
    closeEquipmentTicketModal,
    createEquipmentTicket,
    filterEquipmentByStatus,
    openEquipmentDetails,
    openEquipmentTicketModal
  } = useApp();

  const filtered =
    equipmentStatusFilter === 'all'
      ? equipment
      : equipment.filter((entry) => entry.status === equipmentStatusFilter);
  const selectedEquipment =
    selectedEquipmentId == null ? null : equipment.find((entry) => entry.id === selectedEquipmentId) || null;
  const unitTickets = selectedEquipment ? tickets.filter((entry) => entry.unit === selectedEquipment.id) : [];

  return (
    <>
      <Header title="Equipment" />
      <div className="flex-1 overflow-auto bg-zinc-900 p-8">
        <div className="mb-6 flex w-fit gap-1 rounded-md border border-zinc-800 bg-zinc-950 p-1">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => filterEquipmentByStatus(tab)}
              className={`rounded px-3.5 py-1.5 text-[12px] capitalize transition-all border ${
                equipmentStatusFilter === tab
                  ? 'border-blue-500/30 bg-blue-500/15 text-blue-300'
                  : 'border-transparent text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100'
              }`}
              style={{ fontWeight: 500 }}
            >
              {tab} {tab !== 'all' && `(${equipment.filter((entry) => entry.status === tab).length})`}
              {tab === 'all' && ` (${equipment.length})`}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                {['Unit ID', 'Name', 'Type', 'Status', 'Last Inspection', 'Next Maintenance', 'Actions'].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3.5 text-left text-[11px] uppercase tracking-wider text-zinc-500"
                    style={{ fontWeight: 500 }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[13px] text-zinc-500">
                    No equipment found with this status.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    className="group cursor-pointer border-b border-zinc-800/80 transition-all last:border-0 hover:bg-zinc-900"
                    onClick={(event) => {
                      if ((event.target as HTMLElement).closest('button')) {
                        return;
                      }
                      openEquipmentDetails(entry.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') {
                        return;
                      }
                      if ((event.target as HTMLElement).tagName === 'BUTTON') {
                        return;
                      }
                      event.preventDefault();
                      openEquipmentDetails(entry.id);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View equipment ${entry.id}: ${entry.name}`}
                  >
                    <td
                      className="px-5 py-3.5 text-[12px] tabular-nums text-zinc-500 transition-colors group-hover:text-zinc-300"
                      style={{ fontWeight: 500 }}
                    >
                      {entry.id}
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-zinc-100" style={{ fontWeight: 500 }}>
                      {entry.name}
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-zinc-500 transition-colors group-hover:text-zinc-300">
                      {entry.type}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="px-5 py-3.5 text-[12px] tabular-nums text-zinc-500">{entry.lastInspection}</td>
                    <td className="px-5 py-3.5 text-[12px] tabular-nums text-zinc-500">{entry.nextMaintenance}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          openEquipmentTicketModal(entry.id);
                        }}
                        className="flex items-center gap-1.5 rounded border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] text-blue-300 transition-all hover:border-blue-500/40 hover:bg-blue-500/15"
                        style={{ fontWeight: 500 }}
                      >
                        <Plus className="h-3 w-3" strokeWidth={1.5} /> Ticket
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={selectedEquipment != null}
          onClose={closeEquipmentDetails}
          title="Equipment Details"
          maxWidth="max-w-2xl"
        >
          {selectedEquipment && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Unit ID', selectedEquipment.id],
                  ['Name', selectedEquipment.name],
                  ['Type', selectedEquipment.type],
                  ['Location', selectedEquipment.location],
                  ['Last Inspection', selectedEquipment.lastInspection],
                  ['Next Maintenance', selectedEquipment.nextMaintenance]
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
                      {label}
                    </div>
                    <div className="text-[13px] text-zinc-100">{value}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
                  Status
                </div>
                <StatusBadge status={selectedEquipment.status} />
              </div>
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
                  Notes
                </div>
                <div className="text-[13px] text-zinc-300">{selectedEquipment.notes}</div>
              </div>
              {unitTickets.length > 0 && (
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
                    Assigned Tickets ({unitTickets.length})
                  </div>
                  <div className="space-y-2">
                    {unitTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-center justify-between rounded-md border border-zinc-800 p-3 transition-all hover:border-zinc-600 hover:bg-zinc-900"
                      >
                        <div>
                          <div className="text-[12px] text-zinc-100" style={{ fontWeight: 500 }}>
                            {ticket.title}
                          </div>
                          <div className="mt-0.5 text-[10px] text-zinc-500">
                            {ticket.id} &middot; {ticket.assignee}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <StatusBadge status={ticket.priority} />
                          <StatusBadge status={ticket.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

        <QuickTicketModal
          isOpen={equipmentTicketUnitId != null}
          onClose={closeEquipmentTicketModal}
          unitId={equipmentTicketUnitId || ''}
          team={team}
          createEquipmentTicket={createEquipmentTicket}
        />
      </div>
    </>
  );
}

function QuickTicketModal({
  isOpen,
  onClose,
  unitId,
  team,
  createEquipmentTicket
}: {
  isOpen: boolean;
  onClose: () => void;
  unitId: string;
  team: ReturnType<typeof useApp>['team'];
  createEquipmentTicket: ReturnType<typeof useApp>['createEquipmentTicket'];
}) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [assignee, setAssignee] = useState(team[0]?.name || '');
  const [desc, setDesc] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      return;
    }

    createEquipmentTicket({
      unitId,
      title,
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
    <Modal isOpen={isOpen} onClose={onClose} title={`Create Ticket — ${unitId}`}>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
            Title
          </label>
          <input value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
              Assignee
            </label>
            <select value={assignee} onChange={(event) => setAssignee(event.target.value)} className={inputClass}>
              {team.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
            Description
          </label>
          <textarea
            value={desc}
            onChange={(event) => setDesc(event.target.value)}
            rows={3}
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
