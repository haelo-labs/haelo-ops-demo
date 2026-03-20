import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type {
  Activity,
  Equipment,
  EquipmentStatusFilter,
  Inspection,
  InspectionStatusFilter,
  TeamMember,
  Ticket
} from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialEquipment, initialTickets, initialTeam, initialInspections, initialActivities } from '../data';

const DEFAULT_EQUIPMENT_STATUS_FILTER: EquipmentStatusFilter = 'all';
const DEFAULT_INSPECTION_STATUS_FILTER: InspectionStatusFilter = 'all';
const DEFAULT_INSPECTION_UNIT_FILTER = 'all';

interface AppUiState {
  equipmentStatusFilter: EquipmentStatusFilter;
  selectedEquipmentId: string | null;
  equipmentTicketUnitId: string | null;
  selectedTicketId: string | null;
  inspectionStatusFilter: InspectionStatusFilter;
  inspectionUnitFilter: string;
  selectedTeamMemberId: string | null;
}

const INITIAL_UI_STATE: AppUiState = {
  equipmentStatusFilter: DEFAULT_EQUIPMENT_STATUS_FILTER,
  selectedEquipmentId: null,
  equipmentTicketUnitId: null,
  selectedTicketId: null,
  inspectionStatusFilter: DEFAULT_INSPECTION_STATUS_FILTER,
  inspectionUnitFilter: DEFAULT_INSPECTION_UNIT_FILTER,
  selectedTeamMemberId: null
};

export interface CreateTicketInput {
  title: string;
  unit: string;
  priority?: Ticket['priority'] | string;
  assignee?: string;
  description?: string;
}

export interface CreateEquipmentTicketInput {
  unitId: string;
  title: string;
  priority?: Ticket['priority'] | string;
  assignee?: string;
  description?: string;
}

export interface UpdateTicketInput {
  ticketId: string;
  title?: string;
  unit?: string;
  priority?: Ticket['priority'] | string;
  assignee?: string;
  description?: string;
  status?: Ticket['status'];
}

export interface CreateInspectionInput {
  unit: string;
  inspector?: string;
  findings?: string;
  status?: Inspection['status'];
}

interface AppContextType {
  equipment: Equipment[];
  setEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  team: TeamMember[];
  setTeam: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  inspections: Inspection[];
  setInspections: React.Dispatch<React.SetStateAction<Inspection[]>>;
  activities: Activity[];
  addActivity: (action: string, type: Activity['type']) => void;
  equipmentStatusFilter: EquipmentStatusFilter;
  selectedEquipmentId: string | null;
  equipmentTicketUnitId: string | null;
  selectedTicketId: string | null;
  inspectionStatusFilter: InspectionStatusFilter;
  inspectionUnitFilter: string;
  selectedTeamMemberId: string | null;
  filterEquipmentByStatus: (status: EquipmentStatusFilter) => void;
  openEquipmentDetails: (equipmentId: string) => void;
  closeEquipmentDetails: () => void;
  openEquipmentTicketModal: (equipmentId: string) => void;
  closeEquipmentTicketModal: () => void;
  createTicket: (input: CreateTicketInput) => Ticket;
  createEquipmentTicket: (input: CreateEquipmentTicketInput) => Ticket;
  openTicketDetails: (ticketId: string) => void;
  closeTicketDetails: () => void;
  moveTicket: (ticketId: string, status: Ticket['status']) => Ticket;
  updateTicket: (input: UpdateTicketInput) => Ticket;
  filterInspections: (filters: { status?: InspectionStatusFilter; unit?: string }) => void;
  createInspection: (input: CreateInspectionInput) => Inspection;
  openTeamMemberDetails: (memberName: string) => void;
  closeTeamMemberDetails: () => void;
  closeCurrentDetailSurface: () => void;
  syncUiToRoute: (pathname: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function normalizeMatchValue(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function findEquipmentMatch(equipment: Equipment[], value: string): Equipment | null {
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

function findTicketMatch(tickets: Ticket[], value: string): Ticket | null {
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

function findTeamMemberMatch(team: TeamMember[], value: string): TeamMember | null {
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

function buildTicketId(): string {
  return `TK-${Date.now().toString().slice(-4)}`;
}

function buildInspectionId(): string {
  return `INS-${Date.now().toString().slice(-4)}`;
}

function pruneUiStateForRoute(pathname: string, previous: AppUiState): AppUiState {
  const nextState: AppUiState = {
    ...previous,
    ...(pathname !== '/equipment'
      ? {
          equipmentStatusFilter: DEFAULT_EQUIPMENT_STATUS_FILTER,
          selectedEquipmentId: null,
          equipmentTicketUnitId: null
        }
      : {}),
    ...(pathname !== '/tickets'
      ? {
          selectedTicketId: null
        }
      : {}),
    ...(pathname !== '/inspections'
      ? {
          inspectionStatusFilter: DEFAULT_INSPECTION_STATUS_FILTER,
          inspectionUnitFilter: DEFAULT_INSPECTION_UNIT_FILTER
        }
      : {}),
    ...(pathname !== '/team'
      ? {
          selectedTeamMemberId: null
        }
      : {})
  };

  const unchanged =
    nextState.equipmentStatusFilter === previous.equipmentStatusFilter &&
    nextState.selectedEquipmentId === previous.selectedEquipmentId &&
    nextState.equipmentTicketUnitId === previous.equipmentTicketUnitId &&
    nextState.selectedTicketId === previous.selectedTicketId &&
    nextState.inspectionStatusFilter === previous.inspectionStatusFilter &&
    nextState.inspectionUnitFilter === previous.inspectionUnitFilter &&
    nextState.selectedTeamMemberId === previous.selectedTeamMemberId;

  return unchanged ? previous : nextState;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [equipment, setEquipment] = useLocalStorage<Equipment[]>('haelo-ops-equipment', initialEquipment);
  const [tickets, setTickets] = useLocalStorage<Ticket[]>('haelo-ops-tickets', initialTickets);
  const [team, setTeam] = useLocalStorage<TeamMember[]>('haelo-ops-team', initialTeam);
  const [inspections, setInspections] = useLocalStorage<Inspection[]>('haelo-ops-inspections', initialInspections);
  const [activities, setActivities] = useLocalStorage<Activity[]>('haelo-ops-activities', initialActivities);
  const [uiState, setUiState] = useState<AppUiState>(INITIAL_UI_STATE);

  const addActivity = useCallback((action: string, type: Activity['type']) => {
    const newActivity: Activity = {
      id: `ACT-${Date.now()}`,
      action,
      timestamp: new Date().toISOString(),
      type,
    };
    setActivities(prev => [newActivity, ...prev]);
  }, [setActivities]);

  const filterEquipmentByStatus = useCallback((status: EquipmentStatusFilter) => {
    setUiState(prev => (prev.equipmentStatusFilter === status ? prev : { ...prev, equipmentStatusFilter: status }));
  }, []);

  const openEquipmentDetails = useCallback((equipmentId: string) => {
    setUiState(prev => ({
      ...prev,
      selectedEquipmentId: equipmentId,
      equipmentTicketUnitId: null
    }));
  }, []);

  const closeEquipmentDetails = useCallback(() => {
    setUiState(prev => (prev.selectedEquipmentId == null ? prev : { ...prev, selectedEquipmentId: null }));
  }, []);

  const openEquipmentTicketModal = useCallback((equipmentId: string) => {
    setUiState(prev => ({
      ...prev,
      equipmentTicketUnitId: equipmentId,
      selectedEquipmentId: null
    }));
  }, []);

  const closeEquipmentTicketModal = useCallback(() => {
    setUiState(prev => (prev.equipmentTicketUnitId == null ? prev : { ...prev, equipmentTicketUnitId: null }));
  }, []);

  const resolveAssignee = useCallback((value?: string) => {
    if (!value) {
      return team[0]?.name || '';
    }

    const match = findTeamMemberMatch(team, value);
    if (!match) {
      throw new Error(`Team member "${value}" was not found.`);
    }

    return match.name;
  }, [team]);

  const createTicket = useCallback((input: CreateTicketInput) => {
    const title = input.title.trim();
    if (!title) {
      throw new Error('Ticket title is required.');
    }

    const equipmentMatch = findEquipmentMatch(equipment, input.unit);
    if (!equipmentMatch) {
      throw new Error(`Equipment "${input.unit}" was not found.`);
    }

    const assignee = resolveAssignee(input.assignee);
    const priority = (input.priority as Ticket['priority'] | undefined) || 'medium';
    const description = input.description ?? '';
    const newTicket: Ticket = {
      id: buildTicketId(),
      title,
      unit: equipmentMatch.id,
      priority,
      status: 'open',
      assignee,
      createdDate: new Date().toISOString().split('T')[0],
      description
    };

    setTickets(prev => [...prev, newTicket]);
    addActivity(`Ticket ${newTicket.id} created: ${title}`, 'ticket');
    toast.success('Ticket created successfully');
    return newTicket;
  }, [addActivity, equipment, resolveAssignee, setTickets]);

  const createEquipmentTicket = useCallback((input: CreateEquipmentTicketInput) => {
    return createTicket({
      title: input.title,
      unit: input.unitId,
      priority: input.priority,
      assignee: input.assignee,
      description: input.description
    });
  }, [createTicket]);

  const openTicketDetails = useCallback((ticketId: string) => {
    setUiState(prev => (prev.selectedTicketId === ticketId ? prev : { ...prev, selectedTicketId: ticketId }));
  }, []);

  const closeTicketDetails = useCallback(() => {
    setUiState(prev => (prev.selectedTicketId == null ? prev : { ...prev, selectedTicketId: null }));
  }, []);

  const moveTicket = useCallback((ticketId: string, status: Ticket['status']) => {
    const ticket = findTicketMatch(tickets, ticketId);
    if (!ticket) {
      throw new Error(`Ticket "${ticketId}" was not found.`);
    }

    const updatedTicket: Ticket = {
      ...ticket,
      status
    };
    setTickets(prev => prev.map(entry => (entry.id === ticket.id ? updatedTicket : entry)));
    addActivity(`Ticket ${ticket.id} moved to ${status.replace('-', ' ')}`, 'ticket');
    toast.success(`Ticket moved to ${status.replace('-', ' ')}`);
    return updatedTicket;
  }, [addActivity, setTickets, tickets]);

  const updateTicket = useCallback((input: UpdateTicketInput) => {
    const ticket = findTicketMatch(tickets, input.ticketId);
    if (!ticket) {
      throw new Error(`Ticket "${input.ticketId}" was not found.`);
    }

    const updates: Partial<Ticket> = {};
    if (input.title != null) {
      const title = input.title.trim();
      if (!title) {
        throw new Error('Ticket title cannot be empty.');
      }
      updates.title = title;
    }

    if (input.unit != null) {
      const equipmentMatch = findEquipmentMatch(equipment, input.unit);
      if (!equipmentMatch) {
        throw new Error(`Equipment "${input.unit}" was not found.`);
      }
      updates.unit = equipmentMatch.id;
    }

    if (input.priority != null) {
      updates.priority = input.priority as Ticket['priority'];
    }

    if (input.assignee != null) {
      updates.assignee = resolveAssignee(input.assignee);
    }

    if (input.description != null) {
      updates.description = input.description;
    }

    if (input.status != null) {
      updates.status = input.status;
    }

    if (Object.keys(updates).length === 0) {
      throw new Error(`No ticket updates were provided for "${ticket.id}".`);
    }

    const updatedTicket: Ticket = {
      ...ticket,
      ...updates
    };
    setTickets(prev => prev.map(entry => (entry.id === ticket.id ? updatedTicket : entry)));
    addActivity(`Ticket ${ticket.id} updated: ${updatedTicket.title}`, 'ticket');
    toast.success('Ticket updated successfully');
    return updatedTicket;
  }, [addActivity, equipment, resolveAssignee, setTickets, tickets]);

  const filterInspections = useCallback((filters: { status?: InspectionStatusFilter; unit?: string }) => {
    setUiState(prev => {
      const nextStatus = filters.status ?? prev.inspectionStatusFilter;
      const nextUnit =
        filters.unit == null
          ? prev.inspectionUnitFilter
          : filters.unit === DEFAULT_INSPECTION_UNIT_FILTER
            ? DEFAULT_INSPECTION_UNIT_FILTER
            : findEquipmentMatch(equipment, filters.unit)?.id || filters.unit;

      if (nextStatus === prev.inspectionStatusFilter && nextUnit === prev.inspectionUnitFilter) {
        return prev;
      }

      return {
        ...prev,
        inspectionStatusFilter: nextStatus,
        inspectionUnitFilter: nextUnit
      };
    });
  }, [equipment]);

  const createInspection = useCallback((input: CreateInspectionInput) => {
    const equipmentMatch = findEquipmentMatch(equipment, input.unit);
    if (!equipmentMatch) {
      throw new Error(`Equipment "${input.unit}" was not found.`);
    }

    const inspector = resolveAssignee(input.inspector);
    const inspection: Inspection = {
      id: buildInspectionId(),
      unit: equipmentMatch.id,
      inspector,
      date: new Date().toISOString().split('T')[0],
      status: input.status || 'pending',
      findings: input.findings || 'Inspection pending review.',
      photosCount: 0
    };

    setInspections(prev => [...prev, inspection]);
    addActivity(`Inspection ${inspection.id} created for ${inspection.unit}`, 'inspection');
    toast.success('Inspection created');
    return inspection;
  }, [addActivity, equipment, resolveAssignee, setInspections]);

  const openTeamMemberDetails = useCallback((memberName: string) => {
    const member = findTeamMemberMatch(team, memberName);
    if (!member) {
      throw new Error(`Team member "${memberName}" was not found.`);
    }

    setUiState(prev => (prev.selectedTeamMemberId === member.id ? prev : { ...prev, selectedTeamMemberId: member.id }));
  }, [team]);

  const closeTeamMemberDetails = useCallback(() => {
    setUiState(prev => (prev.selectedTeamMemberId == null ? prev : { ...prev, selectedTeamMemberId: null }));
  }, []);

  const closeCurrentDetailSurface = useCallback(() => {
    setUiState(prev => {
      if (
        prev.selectedEquipmentId == null &&
        prev.equipmentTicketUnitId == null &&
        prev.selectedTicketId == null &&
        prev.selectedTeamMemberId == null
      ) {
        return prev;
      }

      return {
        ...prev,
        selectedEquipmentId: null,
        equipmentTicketUnitId: null,
        selectedTicketId: null,
        selectedTeamMemberId: null
      };
    });
  }, []);

  const syncUiToRoute = useCallback((pathname: string) => {
    setUiState(prev => pruneUiStateForRoute(pathname, prev));
  }, []);

  const value = useMemo<AppContextType>(() => ({
    equipment,
    setEquipment,
    tickets,
    setTickets,
    team,
    setTeam,
    inspections,
    setInspections,
    activities,
    addActivity,
    equipmentStatusFilter: uiState.equipmentStatusFilter,
    selectedEquipmentId: uiState.selectedEquipmentId,
    equipmentTicketUnitId: uiState.equipmentTicketUnitId,
    selectedTicketId: uiState.selectedTicketId,
    inspectionStatusFilter: uiState.inspectionStatusFilter,
    inspectionUnitFilter: uiState.inspectionUnitFilter,
    selectedTeamMemberId: uiState.selectedTeamMemberId,
    filterEquipmentByStatus,
    openEquipmentDetails,
    closeEquipmentDetails,
    openEquipmentTicketModal,
    closeEquipmentTicketModal,
    createTicket,
    createEquipmentTicket,
    openTicketDetails,
    closeTicketDetails,
    moveTicket,
    updateTicket,
    filterInspections,
    createInspection,
    openTeamMemberDetails,
    closeTeamMemberDetails,
    closeCurrentDetailSurface,
    syncUiToRoute
  }), [
    activities,
    addActivity,
    closeCurrentDetailSurface,
    closeEquipmentDetails,
    closeEquipmentTicketModal,
    closeTeamMemberDetails,
    closeTicketDetails,
    createEquipmentTicket,
    createInspection,
    createTicket,
    equipment,
    filterEquipmentByStatus,
    filterInspections,
    inspections,
    moveTicket,
    openEquipmentDetails,
    openEquipmentTicketModal,
    openTeamMemberDetails,
    openTicketDetails,
    setEquipment,
    setInspections,
    setTeam,
    setTickets,
    syncUiToRoute,
    team,
    tickets,
    uiState,
    updateTicket
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
