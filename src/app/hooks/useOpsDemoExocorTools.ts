import { useMemo } from 'react';
import type { ExocorToolDefinition } from 'exocor';
import { useApp } from '../context/AppContext';
import { router } from '../routes';
import type {
  Equipment,
  EquipmentStatusFilter,
  InspectionStatusFilter,
  TeamMember,
  Ticket
} from '../types';

function normalizeMatchValue(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function resolveEquipmentReference(equipment: Equipment[], value: string): Equipment | null {
  const query = normalizeMatchValue(value);
  if (!query) {
    return null;
  }

  return (
    equipment.find((entry) => normalizeMatchValue(entry.id) === query) ||
    equipment.find((entry) => normalizeMatchValue(entry.name) === query) ||
    equipment.find((entry) => normalizeMatchValue(entry.id).includes(query)) ||
    equipment.find((entry) => normalizeMatchValue(entry.name).includes(query)) ||
    null
  );
}

function resolveTicketReference(tickets: Ticket[], value: string): Ticket | null {
  const query = normalizeMatchValue(value);
  if (!query) {
    return null;
  }

  return (
    tickets.find((entry) => normalizeMatchValue(entry.id) === query) ||
    tickets.find((entry) => normalizeMatchValue(entry.title) === query) ||
    tickets.find((entry) => normalizeMatchValue(entry.id).includes(query)) ||
    tickets.find((entry) => normalizeMatchValue(entry.title).includes(query)) ||
    null
  );
}

function resolveTeamMemberReference(team: TeamMember[], value: string): TeamMember | null {
  const query = normalizeMatchValue(value);
  if (!query) {
    return null;
  }

  const exactMatch =
    team.find((entry) => normalizeMatchValue(entry.name) === query) ||
    team.find((entry) => normalizeMatchValue(entry.id) === query);
  if (exactMatch) {
    return exactMatch;
  }

  const partialMatches = team.filter((entry) => normalizeMatchValue(entry.name).includes(query));
  if (partialMatches.length === 1) {
    return partialMatches[0];
  }

  return null;
}

function resolveEquipmentStatus(value: unknown): EquipmentStatusFilter {
  const normalized = normalizeMatchValue(String(value || ''));
  if (normalized === 'all' || normalized === 'active' || normalized === 'maintenance' || normalized === 'critical' || normalized === 'idle') {
    return normalized;
  }

  throw new Error(`Unsupported equipment status "${String(value)}".`);
}

function resolveInspectionStatus(value: unknown): InspectionStatusFilter {
  const normalized = normalizeMatchValue(String(value || ''));
  if (normalized === 'all' || normalized === 'passed' || normalized === 'failed' || normalized === 'pending') {
    return normalized;
  }

  throw new Error(`Unsupported inspection status "${String(value)}".`);
}

export function useOpsDemoExocorTools(): ExocorToolDefinition[] {
  const {
    equipment,
    tickets,
    team,
    createEquipmentTicket,
    createInspection,
    createTicket,
    filterEquipmentByStatus,
    filterInspections,
    moveTicket,
    openEquipmentDetails,
    openTeamMemberDetails,
    openTicketDetails,
    updateTicket
  } = useApp();

  return useMemo<ExocorToolDefinition[]>(
    () => [
      {
        id: 'goToDashboard',
        description: 'Go to dashboard',
        safety: 'read',
        handler: async () => {
          await router.navigate('/');
        }
      },
      {
        id: 'goToEquipment',
        description: 'Go to equipment',
        safety: 'read',
        handler: async () => {
          await router.navigate('/equipment');
        }
      },
      {
        id: 'goToTickets',
        description: 'Go to tickets',
        safety: 'read',
        handler: async () => {
          await router.navigate('/tickets');
        }
      },
      {
        id: 'goToInspections',
        description: 'Go to inspections',
        safety: 'read',
        handler: async () => {
          await router.navigate('/inspections');
        }
      },
      {
        id: 'goToTeam',
        description: 'Go to team',
        safety: 'read',
        handler: async () => {
          await router.navigate('/team');
        }
      },
      {
        id: 'filterEquipmentByStatus',
        description: 'Filter equipment by status',
        routes: ['/equipment'],
        safety: 'read',
        parameters: [
          {
            name: 'status',
            description: 'Equipment status filter to apply',
            type: 'enum',
            required: true,
            options: ['all', 'active', 'maintenance', 'critical', 'idle']
          }
        ],
        handler: async ({ status }) => {
          filterEquipmentByStatus(resolveEquipmentStatus(status));
        }
      },
      {
        id: 'openEquipmentDetails',
        description: 'Open equipment details',
        routes: ['/equipment'],
        safety: 'read',
        parameters: [
          {
            name: 'equipmentId',
            description: 'Equipment unit ID to open',
            type: 'string',
            required: true
          }
        ],
        handler: async ({ equipmentId }) => {
          const match = resolveEquipmentReference(equipment, String(equipmentId));
          if (!match) {
            throw new Error(`Equipment "${String(equipmentId)}" was not found.`);
          }
          openEquipmentDetails(match.id);
        }
      },
      {
        id: 'createEquipmentTicket',
        description: 'Create ticket for equipment',
        routes: ['/equipment'],
        safety: 'write',
        parameters: [
          {
            name: 'unitId',
            description: 'Equipment unit ID for the ticket',
            type: 'string',
            required: true
          },
          {
            name: 'title',
            description: 'Ticket title',
            type: 'string',
            required: true
          },
          {
            name: 'priority',
            description: 'Ticket priority',
            type: 'enum',
            options: ['low', 'medium', 'high', 'critical']
          },
          {
            name: 'assignee',
            description: 'Team member assigned to the ticket',
            type: 'string'
          },
          {
            name: 'description',
            description: 'Ticket description',
            type: 'string'
          }
        ],
        handler: async ({ unitId, title, priority, assignee, description }) => {
          const match = resolveEquipmentReference(equipment, String(unitId));
          if (!match) {
            throw new Error(`Equipment "${String(unitId)}" was not found.`);
          }

          createEquipmentTicket({
            unitId: match.id,
            title: String(title),
            priority: priority == null ? undefined : String(priority),
            assignee: assignee == null ? undefined : String(assignee),
            description: description == null ? undefined : String(description)
          });
        }
      },
      {
        id: 'createTicket',
        description: 'Create ticket',
        routes: ['/tickets'],
        safety: 'write',
        parameters: [
          {
            name: 'title',
            description: 'Ticket title',
            type: 'string',
            required: true
          },
          {
            name: 'unit',
            description: 'Equipment unit ID for the ticket',
            type: 'string',
            required: true
          },
          {
            name: 'priority',
            description: 'Ticket priority',
            type: 'enum',
            options: ['low', 'medium', 'high', 'critical']
          },
          {
            name: 'assignee',
            description: 'Team member assigned to the ticket',
            type: 'string'
          },
          {
            name: 'description',
            description: 'Ticket description',
            type: 'string'
          }
        ],
        handler: async ({ title, unit, priority, assignee, description }) => {
          const match = resolveEquipmentReference(equipment, String(unit));
          if (!match) {
            throw new Error(`Equipment "${String(unit)}" was not found.`);
          }

          createTicket({
            title: String(title),
            unit: match.id,
            priority: priority == null ? undefined : String(priority),
            assignee: assignee == null ? undefined : String(assignee),
            description: description == null ? undefined : String(description)
          });
        }
      },
      {
        id: 'openTicketDetails',
        description: 'Open ticket details',
        routes: ['/tickets'],
        safety: 'read',
        parameters: [
          {
            name: 'ticketId',
            description: 'Ticket ID to open',
            type: 'string',
            required: true
          }
        ],
        handler: async ({ ticketId }) => {
          const match = resolveTicketReference(tickets, String(ticketId));
          if (!match) {
            throw new Error(`Ticket "${String(ticketId)}" was not found.`);
          }
          openTicketDetails(match.id);
        }
      },
      {
        id: 'moveTicket',
        description: 'Move ticket',
        routes: ['/tickets'],
        safety: 'write',
        parameters: [
          {
            name: 'ticketId',
            description: 'Ticket ID to move',
            type: 'string',
            required: true
          },
          {
            name: 'status',
            description: 'Destination ticket status',
            type: 'enum',
            required: true,
            options: ['open', 'in-progress', 'review', 'resolved']
          }
        ],
        handler: async ({ ticketId, status }) => {
          const match = resolveTicketReference(tickets, String(ticketId));
          if (!match) {
            throw new Error(`Ticket "${String(ticketId)}" was not found.`);
          }
          moveTicket(match.id, String(status) as Ticket['status']);
        }
      },
      {
        id: 'updateTicket',
        description: 'Update ticket',
        routes: ['/tickets'],
        safety: 'write',
        parameters: [
          {
            name: 'ticketId',
            description: 'Ticket ID to update',
            type: 'string',
            required: true
          },
          {
            name: 'title',
            description: 'Updated ticket title',
            type: 'string'
          },
          {
            name: 'unit',
            description: 'Updated equipment unit ID',
            type: 'string'
          },
          {
            name: 'priority',
            description: 'Updated ticket priority',
            type: 'enum',
            options: ['low', 'medium', 'high', 'critical']
          },
          {
            name: 'assignee',
            description: 'Updated assignee name',
            type: 'string'
          },
          {
            name: 'description',
            description: 'Updated ticket description',
            type: 'string'
          },
          {
            name: 'status',
            description: 'Updated ticket status',
            type: 'enum',
            options: ['open', 'in-progress', 'review', 'resolved']
          }
        ],
        handler: async ({ ticketId, title, unit, priority, assignee, description, status }) => {
          const match = resolveTicketReference(tickets, String(ticketId));
          if (!match) {
            throw new Error(`Ticket "${String(ticketId)}" was not found.`);
          }

          updateTicket({
            ticketId: match.id,
            title: title == null ? undefined : String(title),
            unit: unit == null ? undefined : String(unit),
            priority: priority == null ? undefined : String(priority),
            assignee: assignee == null ? undefined : String(assignee),
            description: description == null ? undefined : String(description),
            status: status == null ? undefined : (String(status) as Ticket['status'])
          });
        }
      },
      {
        id: 'filterInspections',
        description: 'Filter inspections',
        routes: ['/inspections'],
        safety: 'read',
        parameters: [
          {
            name: 'status',
            description: 'Inspection status filter',
            type: 'enum',
            options: ['all', 'passed', 'failed', 'pending']
          },
          {
            name: 'unit',
            description: 'Equipment unit ID for the inspection filter',
            type: 'string'
          }
        ],
        handler: async ({ status, unit }) => {
          filterInspections({
            status: status == null ? undefined : resolveInspectionStatus(status),
            unit:
              unit == null
                ? undefined
                : resolveEquipmentReference(equipment, String(unit))?.id || String(unit)
          });
        }
      },
      {
        id: 'createInspection',
        description: 'Create inspection',
        routes: ['/inspections'],
        safety: 'write',
        parameters: [
          {
            name: 'unit',
            description: 'Equipment unit ID for the inspection',
            type: 'string',
            required: true
          },
          {
            name: 'inspector',
            description: 'Team member performing the inspection',
            type: 'string'
          },
          {
            name: 'findings',
            description: 'Inspection findings',
            type: 'string'
          },
          {
            name: 'status',
            description: 'Inspection status',
            type: 'enum',
            options: ['passed', 'failed', 'pending']
          }
        ],
        handler: async ({ unit, inspector, findings, status }) => {
          const match = resolveEquipmentReference(equipment, String(unit));
          if (!match) {
            throw new Error(`Equipment "${String(unit)}" was not found.`);
          }

          createInspection({
            unit: match.id,
            inspector: inspector == null ? undefined : String(inspector),
            findings: findings == null ? undefined : String(findings),
            status: status == null ? undefined : (String(status) as Exclude<InspectionStatusFilter, 'all'>)
          });
        }
      },
      {
        id: 'openTeamMemberDetails',
        description: 'Open team member details',
        routes: ['/team'],
        safety: 'read',
        parameters: [
          {
            name: 'memberName',
            description: 'Team member name to open',
            type: 'string',
            required: true
          }
        ],
        handler: async ({ memberName }) => {
          const match = resolveTeamMemberReference(team, String(memberName));
          if (!match) {
            throw new Error(`Team member "${String(memberName)}" was not found.`);
          }
          openTeamMemberDetails(match.name);
        }
      }
    ],
    [
      createEquipmentTicket,
      createInspection,
      createTicket,
      equipment,
      filterEquipmentByStatus,
      filterInspections,
      moveTicket,
      openEquipmentDetails,
      openTeamMemberDetails,
      openTicketDetails,
      team,
      tickets,
      updateTicket
    ]
  );
}
