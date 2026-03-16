import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import type { TeamMember } from '../types';

export function TeamPage() {
  const { team, tickets, activities } = useApp();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const getMemberTickets = (name: string) => tickets.filter(t => t.assignee === name);
  const getMemberActivities = (name: string) => activities.filter(a => a.action.toLowerCase().includes(name.toLowerCase().split(' ')[0])).slice(0, 5);

  return (
    <>
      <Header title="Team" />
      <div className="flex-1 overflow-auto bg-gray-50 p-8">
        <div className="text-[13px] text-gray-500 mb-6">{team.length} team members</div>

        <div className="grid grid-cols-3 gap-4">
          {team.map(member => {
            const memberTickets = getMemberTickets(member.name);
            return (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-400 hover:shadow-sm transition-all cursor-pointer group text-left w-full"
                aria-label={`View ${member.name}'s details - ${member.role}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center text-[15px] shrink-0 ${
                    member.status === 'on-site' ? 'bg-blue-600 text-white' : member.status === 'off-site' ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400'
                  }`} style={{ fontWeight: 600 }}>
                    {member.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] text-gray-900" style={{ fontWeight: 600 }}>{member.name}</div>
                    <div className="text-[12px] text-gray-500 mt-0.5">{member.role}</div>
                    <div className="mt-2.5">
                      <StatusBadge status={member.status} />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1" style={{ fontWeight: 500 }}>Current Assignment</div>
                  <div className="text-[12px] text-gray-600 group-hover:text-gray-900 transition-colors">{member.currentAssignment}</div>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="text-[11px] text-gray-500">
                    <span className="text-gray-900 tabular-nums" style={{ fontWeight: 600 }}>{memberTickets.length}</span> tickets
                  </div>
                  <div className="text-[11px] text-gray-500">
                    <span className="text-gray-900 tabular-nums" style={{ fontWeight: 600 }}>{memberTickets.filter(t => t.status !== 'resolved').length}</span> active
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Member Detail Modal */}
        <Modal isOpen={!!selectedMember} onClose={() => setSelectedMember(null)} title="Team Member" maxWidth="max-w-2xl">
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-md flex items-center justify-center text-[20px] ${
                  selectedMember.status === 'on-site' ? 'bg-blue-600 text-white' : selectedMember.status === 'off-site' ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400'
                }`} style={{ fontWeight: 600 }}>
                  {selectedMember.initials}
                </div>
                <div>
                  <div className="text-[18px] text-gray-900" style={{ fontWeight: 600 }}>{selectedMember.name}</div>
                  <div className="text-[13px] text-gray-500">{selectedMember.role}</div>
                  <div className="mt-1.5"><StatusBadge status={selectedMember.status} /></div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1" style={{ fontWeight: 500 }}>Current Assignment</div>
                <div className="text-[13px] text-gray-700">{selectedMember.currentAssignment}</div>
              </div>

              {/* Assigned Tickets */}
              <div>
                <div className="text-[13px] text-gray-900 mb-3" style={{ fontWeight: 600 }}>Assigned Tickets</div>
                {getMemberTickets(selectedMember.name).length === 0 ? (
                  <div className="text-[12px] text-gray-500 py-4 text-center">No tickets assigned</div>
                ) : (
                  <div className="space-y-2">
                    {getMemberTickets(selectedMember.name).map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 rounded-md border border-gray-100 hover:border-gray-400 hover:bg-gray-50 transition-all">
                        <div>
                          <div className="text-[12px] text-gray-900" style={{ fontWeight: 500 }}>{t.title}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{t.id} &middot; {t.unit}</div>
                        </div>
                        <div className="flex gap-2">
                          <StatusBadge status={t.priority} />
                          <StatusBadge status={t.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div>
                <div className="text-[13px] text-gray-900 mb-3" style={{ fontWeight: 600 }}>Recent Activity</div>
                {getMemberActivities(selectedMember.name).length === 0 ? (
                  <div className="text-[12px] text-gray-500 py-4 text-center">No recent activity</div>
                ) : (
                  <div className="space-y-2.5">
                    {getMemberActivities(selectedMember.name).map(act => (
                      <div key={act.id} className="text-[12px] text-gray-600 flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <div>{act.action}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}