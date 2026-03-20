import { useMemo, useState } from 'react';
import { Camera, Plus, SlidersHorizontal } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';

export function InspectionsPage() {
  const {
    inspections,
    equipment,
    team,
    createInspection,
    filterInspections,
    inspectionStatusFilter,
    inspectionUnitFilter
  } = useApp();
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(
    () =>
      inspections.filter((inspection) => {
        if (inspectionStatusFilter !== 'all' && inspection.status !== inspectionStatusFilter) {
          return false;
        }
        if (inspectionUnitFilter !== 'all' && inspection.unit !== inspectionUnitFilter) {
          return false;
        }
        return true;
      }),
    [inspectionStatusFilter, inspectionUnitFilter, inspections]
  );

  const selectClass =
    'rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 pr-8 text-[12px] text-zinc-300 transition-colors hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

  return (
    <>
      <Header title="Inspections" />
      <div className="flex-1 overflow-auto bg-zinc-900 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
            <select
              value={inspectionStatusFilter}
              onChange={(event) =>
                filterInspections({
                  status: event.target.value as ReturnType<typeof useApp>['inspectionStatusFilter']
                })
              }
              className={selectClass}
            >
              <option value="all">All Statuses</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={inspectionUnitFilter}
              onChange={(event) => filterInspections({ unit: event.target.value })}
              className={selectClass}
            >
              <option value="all">All Units</option>
              {equipment.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.id} — {entry.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-[12px] text-white transition-all hover:border-blue-700 hover:bg-blue-700"
            style={{ fontWeight: 500 }}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> New Inspection
          </button>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                {['ID', 'Unit', 'Inspector', 'Date', 'Status', 'Findings', 'Photos'].map((heading) => (
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
                    No inspections found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((inspection) => {
                  const equipmentMatch = equipment.find((entry) => entry.id === inspection.unit);
                  return (
                    <tr
                      key={inspection.id}
                      className="group cursor-default border-b border-zinc-800/80 transition-all last:border-0 hover:bg-zinc-900"
                    >
                      <td
                        className="px-5 py-3.5 text-[12px] tabular-nums text-zinc-500 transition-colors group-hover:text-zinc-300"
                        style={{ fontWeight: 500 }}
                      >
                        {inspection.id}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-[12px] text-zinc-100" style={{ fontWeight: 500 }}>
                          {equipmentMatch?.name || inspection.unit}
                        </div>
                        <div className="text-[10px] text-zinc-500">{inspection.unit}</div>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-zinc-300 transition-colors group-hover:text-zinc-100">
                        {inspection.inspector}
                      </td>
                      <td className="px-5 py-3.5 text-[12px] tabular-nums text-zinc-500">{inspection.date}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={inspection.status} />
                      </td>
                      <td className="max-w-[250px] px-5 py-3.5 text-[12px] text-zinc-300 truncate">
                        {inspection.findings}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-[12px] text-zinc-500">
                          <Camera className="h-3 w-3" strokeWidth={1.5} /> {inspection.photosCount}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Inspection">
          <CreateInspectionForm
            equipment={equipment}
            team={team}
            onSubmit={(input) => {
              createInspection(input);
              setShowCreate(false);
            }}
            onCancel={() => setShowCreate(false)}
          />
        </Modal>
      </div>
    </>
  );
}

function CreateInspectionForm({
  equipment,
  team,
  onSubmit,
  onCancel
}: {
  equipment: ReturnType<typeof useApp>['equipment'];
  team: ReturnType<typeof useApp>['team'];
  onSubmit: (input: Parameters<ReturnType<typeof useApp>['createInspection']>[0]) => void;
  onCancel: () => void;
}) {
  const [unit, setUnit] = useState(equipment[0]?.id || '');
  const [inspector, setInspector] = useState(team[0]?.name || '');
  const [findings, setFindings] = useState('');
  const [status, setStatus] = useState<'passed' | 'failed' | 'pending'>('pending');

  const handleSubmit = () => {
    onSubmit({
      unit,
      inspector,
      status,
      findings: findings || 'Inspection pending review.'
    });
    setFindings('');
  };

  const inputClass =
    'w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 transition-colors placeholder-zinc-500 hover:border-zinc-600 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

  return (
    <div className="space-y-4">
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
          Inspector
        </label>
        <select value={inspector} onChange={(event) => setInspector(event.target.value)} className={inputClass}>
          {team.map((member) => (
            <option key={member.id} value={member.name}>
              {member.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
          Findings
        </label>
        <textarea
          value={findings}
          onChange={(event) => setFindings(event.target.value)}
          rows={3}
          placeholder="Enter inspection findings..."
          className={`${inputClass} resize-none`}
        />
      </div>
      <div>
        <label className="mb-2 block text-[11px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
          Status
        </label>
        <div className="flex gap-4">
          {(['passed', 'failed', 'pending'] as const).map((value) => (
            <label key={value} className="group flex cursor-pointer items-center gap-2">
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors group-hover:border-zinc-500 ${
                  status === value ? 'border-blue-600 bg-blue-600' : 'border-zinc-600 bg-zinc-900'
                }`}
              >
                {status === value && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
              </div>
              <input
                type="radio"
                name="inspStatus"
                checked={status === value}
                onChange={() => setStatus(value)}
                className="sr-only"
              />
              <span className="text-[12px] capitalize text-zinc-300 transition-colors group-hover:text-zinc-100">
                {value}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onCancel}
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
          Create Inspection
        </button>
      </div>
    </div>
  );
}
