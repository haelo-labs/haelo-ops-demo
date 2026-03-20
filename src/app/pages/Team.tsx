import { Header } from '../components/layout/Header';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';

export function TeamPage() {
  const { team, tickets, activities, selectedTeamMemberId, openTeamMemberDetails, closeTeamMemberDetails } = useApp();
  const selectedMember =
    selectedTeamMemberId == null ? null : team.find((member) => member.id === selectedTeamMemberId) || null;

  const getMemberTickets = (name: string) => tickets.filter((ticket) => ticket.assignee === name);
  const getMemberActivities = (name: string) =>
    activities.filter((activity) => activity.action.toLowerCase().includes(name.toLowerCase().split(' ')[0])).slice(0, 5);

  return (
    <>
      <Header title="Team" />
      <div className="flex-1 overflow-auto bg-zinc-900 p-8">
        <div className="mb-6 text-[13px] text-zinc-500">{team.length} team members</div>

        <div className="grid grid-cols-3 gap-4">
          {team.map((member) => {
            const memberTickets = getMemberTickets(member.name);

            return (
              <button
                key={member.id}
                onClick={() => openTeamMemberDetails(member.name)}
                className="group w-full cursor-pointer rounded-lg border border-zinc-800 bg-zinc-950 p-5 text-left transition-all hover:border-zinc-600 hover:bg-zinc-900"
                aria-label={`View ${member.name}'s details - ${member.role}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-[15px] ${
                      member.status === 'on-site'
                        ? 'bg-blue-600 text-white'
                        : member.status === 'off-site'
                          ? 'bg-zinc-700 text-zinc-100'
                          : 'bg-zinc-800 text-zinc-500'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {member.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] text-zinc-100" style={{ fontWeight: 600 }}>
                      {member.name}
                    </div>
                    <div className="mt-0.5 text-[12px] text-zinc-500">{member.role}</div>
                    <div className="mt-2.5">
                      <StatusBadge status={member.status} />
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-zinc-800 pt-4 transition-colors group-hover:border-zinc-700">
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
                    Current Assignment
                  </div>
                  <div className="text-[12px] text-zinc-300 transition-colors group-hover:text-zinc-100">
                    {member.currentAssignment}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="text-[11px] text-zinc-500">
                    <span className="tabular-nums text-zinc-100" style={{ fontWeight: 600 }}>
                      {memberTickets.length}
                    </span>{' '}
                    tickets
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    <span className="tabular-nums text-zinc-100" style={{ fontWeight: 600 }}>
                      {memberTickets.filter((ticket) => ticket.status !== 'resolved').length}
                    </span>{' '}
                    active
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <Modal
          isOpen={selectedMember != null}
          onClose={closeTeamMemberDetails}
          title="Team Member"
          maxWidth="max-w-2xl"
        >
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-md text-[20px] ${
                    selectedMember.status === 'on-site'
                      ? 'bg-blue-600 text-white'
                      : selectedMember.status === 'off-site'
                        ? 'bg-zinc-700 text-zinc-100'
                        : 'bg-zinc-800 text-zinc-500'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {selectedMember.initials}
                </div>
                <div>
                  <div className="text-[18px] text-zinc-100" style={{ fontWeight: 600 }}>
                    {selectedMember.name}
                  </div>
                  <div className="text-[13px] text-zinc-500">{selectedMember.role}</div>
                  <div className="mt-1.5">
                    <StatusBadge status={selectedMember.status} />
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500" style={{ fontWeight: 500 }}>
                  Current Assignment
                </div>
                <div className="text-[13px] text-zinc-300">{selectedMember.currentAssignment}</div>
              </div>

              <div>
                <div className="mb-3 text-[13px] text-zinc-100" style={{ fontWeight: 600 }}>
                  Assigned Tickets
                </div>
                {getMemberTickets(selectedMember.name).length === 0 ? (
                  <div className="py-4 text-center text-[12px] text-zinc-500">No tickets assigned</div>
                ) : (
                  <div className="space-y-2">
                    {getMemberTickets(selectedMember.name).map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-center justify-between rounded-md border border-zinc-800 p-3 transition-all hover:border-zinc-600 hover:bg-zinc-900"
                      >
                        <div>
                          <div className="text-[12px] text-zinc-100" style={{ fontWeight: 500 }}>
                            {ticket.title}
                          </div>
                          <div className="mt-0.5 text-[10px] text-zinc-500">
                            {ticket.id} &middot; {ticket.unit}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <StatusBadge status={ticket.priority} />
                          <StatusBadge status={ticket.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="mb-3 text-[13px] text-zinc-100" style={{ fontWeight: 600 }}>
                  Recent Activity
                </div>
                {getMemberActivities(selectedMember.name).length === 0 ? (
                  <div className="py-4 text-center text-[12px] text-zinc-500">No recent activity</div>
                ) : (
                  <div className="space-y-2.5">
                    {getMemberActivities(selectedMember.name).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-2.5 text-[12px] text-zinc-300">
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                        <div>{activity.action}</div>
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
