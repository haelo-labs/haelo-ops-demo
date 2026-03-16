import { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { Plus, Camera, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export function InspectionsPage() {
  const { inspections, setInspections, equipment, team, addActivity } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [unitFilter, setUnitFilter] = useState('all');

  const filtered = useMemo(() => {
    return inspections.filter(i => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      if (unitFilter !== 'all' && i.unit !== unitFilter) return false;
      return true;
    });
  }, [inspections, statusFilter, unitFilter]);

  const selectClass = "px-3 py-1.5 pr-8 rounded-md bg-white border border-gray-200 text-[12px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 transition-colors";

  return (
    <>
      <Header title="Inspections" />
      <div className="flex-1 overflow-auto bg-gray-50 p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={selectClass}>
              <option value="all">All Statuses</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
            <select value={unitFilter} onChange={e => setUnitFilter(e.target.value)} className={selectClass}>
              <option value="all">All Units</option>
              {equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.id} — {eq.name}</option>)}
            </select>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-[12px] text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all"
            style={{ fontWeight: 500 }}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> New Inspection
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {['ID', 'Unit', 'Inspector', 'Date', 'Status', 'Findings', 'Photos'].map(h => (
                  <th key={h} className="text-left text-[11px] text-gray-500 uppercase tracking-wider px-5 py-3.5" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-[13px] text-gray-500">No inspections found matching filters.</td></tr>
              ) : (
                filtered.map(ins => {
                  const eq = equipment.find(e => e.id === ins.unit);
                  return (
                    <tr key={ins.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all group cursor-default">
                      <td className="px-5 py-3.5 text-[12px] text-gray-500 tabular-nums group-hover:text-gray-700 transition-colors" style={{ fontWeight: 500 }}>{ins.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-[12px] text-gray-900" style={{ fontWeight: 500 }}>{eq?.name || ins.unit}</div>
                        <div className="text-[10px] text-gray-400">{ins.unit}</div>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-gray-600 group-hover:text-gray-900 transition-colors">{ins.inspector}</td>
                      <td className="px-5 py-3.5 text-[12px] text-gray-500 tabular-nums">{ins.date}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={ins.status} /></td>
                      <td className="px-5 py-3.5 text-[12px] text-gray-600 max-w-[250px] truncate">{ins.findings}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                          <Camera className="w-3 h-3" strokeWidth={1.5} /> {ins.photosCount}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Create Inspection Modal */}
        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Inspection">
          <CreateInspectionForm
            equipment={equipment}
            team={team}
            onSubmit={(ins) => {
              setInspections(prev => [...prev, ins]);
              addActivity(`Inspection ${ins.id} created for ${ins.unit}`, 'inspection');
              toast.success('Inspection created');
              setShowCreate(false);
            }}
            onCancel={() => setShowCreate(false)}
          />
        </Modal>
      </div>
    </>
  );
}

function CreateInspectionForm({ equipment, team, onSubmit, onCancel }: {
  equipment: ReturnType<typeof useApp>['equipment'];
  team: ReturnType<typeof useApp>['team'];
  onSubmit: (ins: ReturnType<typeof useApp>['inspections'][0]) => void;
  onCancel: () => void;
}) {
  const [unit, setUnit] = useState(equipment[0]?.id || '');
  const [inspector, setInspector] = useState(team[0]?.name || '');
  const [findings, setFindings] = useState('');
  const [status, setStatus] = useState<'passed' | 'failed' | 'pending'>('pending');

  const handleSubmit = () => {
    onSubmit({
      id: `INS-${Date.now().toString().slice(-4)}`,
      unit,
      inspector,
      date: new Date().toISOString().split('T')[0],
      status,
      findings: findings || 'Inspection pending review.',
      photosCount: 0,
    });
    setFindings('');
  };

  const inputClass = "w-full px-3 py-2 rounded-md bg-white border border-gray-200 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 hover:border-gray-400 transition-colors";

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Unit</label>
        <select value={unit} onChange={e => setUnit(e.target.value)} className={inputClass}>
          {equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.id} — {eq.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Inspector</label>
        <select value={inspector} onChange={e => setInspector(e.target.value)} className={inputClass}>
          {team.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontWeight: 500 }}>Findings</label>
        <textarea value={findings} onChange={e => setFindings(e.target.value)} rows={3} placeholder="Enter inspection findings..." className={`${inputClass} resize-none`} />
      </div>
      <div>
        <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-2" style={{ fontWeight: 500 }}>Status</label>
        <div className="flex gap-4">
          {(['passed', 'failed', 'pending'] as const).map(s => (
            <label key={s} className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border-2 ${status === s ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'} flex items-center justify-center transition-colors group-hover:border-gray-400`}>
                {status === s && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <input type="radio" name="inspStatus" checked={status === s} onChange={() => setStatus(s)} className="sr-only" />
              <span className="text-[12px] text-gray-700 capitalize group-hover:text-gray-900 transition-colors">{s}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-md text-[12px] text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all" style={{ fontWeight: 500 }}>Cancel</button>
        <button onClick={handleSubmit} className="px-4 py-2 rounded-md text-[12px] text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all" style={{ fontWeight: 500 }}>Create Inspection</button>
      </div>
    </div>
  );
}