export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'maintenance' | 'idle' | 'critical';
  lastInspection: string;
  nextMaintenance: string;
  location: string;
  notes: string;
}

export interface Ticket {
  id: string;
  title: string;
  unit: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'review' | 'resolved';
  assignee: string;
  createdDate: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Technician' | 'Engineer' | 'Supervisor';
  status: 'on-site' | 'off-site' | 'unavailable';
  initials: string;
  currentAssignment: string;
}

export interface Inspection {
  id: string;
  unit: string;
  inspector: string;
  date: string;
  status: 'passed' | 'failed' | 'pending';
  findings: string;
  photosCount: number;
}

export interface Activity {
  id: string;
  action: string;
  timestamp: string;
  type: 'ticket' | 'equipment' | 'inspection' | 'team';
}

export type EquipmentStatusFilter = 'all' | Equipment['status'];
export type InspectionStatusFilter = 'all' | Inspection['status'];
