import type { Equipment, Ticket, TeamMember, Inspection, Activity } from './types';

export const initialEquipment: Equipment[] = [
  { id: 'EQ-001', name: 'CNC Machine Unit 1', type: 'CNC Machine', status: 'active', lastInspection: '2026-02-15', nextMaintenance: '2026-03-15', location: 'Building A, Bay 1', notes: 'Operating at 95% efficiency' },
  { id: 'EQ-002', name: 'CNC Machine Unit 2', type: 'CNC Machine', status: 'active', lastInspection: '2026-02-20', nextMaintenance: '2026-03-20', location: 'Building A, Bay 2', notes: 'Recently calibrated' },
  { id: 'EQ-003', name: 'CNC Machine Unit 3', type: 'CNC Machine', status: 'maintenance', lastInspection: '2026-01-30', nextMaintenance: '2026-03-05', location: 'Building A, Bay 3', notes: 'Spindle replacement in progress' },
  { id: 'EQ-004', name: 'CNC Machine Unit 4', type: 'CNC Machine', status: 'idle', lastInspection: '2026-02-10', nextMaintenance: '2026-04-10', location: 'Building A, Bay 4', notes: 'Awaiting job assignment' },
  { id: 'EQ-005', name: 'CNC Machine Unit 5', type: 'CNC Machine', status: 'critical', lastInspection: '2026-01-15', nextMaintenance: '2026-03-01', location: 'Building A, Bay 5', notes: 'Overheating detected — immediate attention required' },
  { id: 'EQ-006', name: 'Assembly Line Alpha', type: 'Assembly Line', status: 'active', lastInspection: '2026-02-25', nextMaintenance: '2026-03-25', location: 'Building B, Line 1', notes: 'Running at full capacity' },
  { id: 'EQ-007', name: 'Assembly Line Beta', type: 'Assembly Line', status: 'active', lastInspection: '2026-02-18', nextMaintenance: '2026-03-18', location: 'Building B, Line 2', notes: 'Minor belt wear noted' },
  { id: 'EQ-008', name: 'Assembly Line Gamma', type: 'Assembly Line', status: 'idle', lastInspection: '2026-02-05', nextMaintenance: '2026-04-05', location: 'Building B, Line 3', notes: 'Scheduled for Q2 product run' },
  { id: 'EQ-009', name: 'QC Station Primary', type: 'Quality Control', status: 'active', lastInspection: '2026-02-28', nextMaintenance: '2026-03-28', location: 'Building C, Station 1', notes: 'Calibration verified' },
  { id: 'EQ-010', name: 'QC Station Secondary', type: 'Quality Control', status: 'maintenance', lastInspection: '2026-01-20', nextMaintenance: '2026-03-10', location: 'Building C, Station 2', notes: 'Sensor array replacement' },
];

export const initialTickets: Ticket[] = [
  { id: 'TK-001', title: 'CNC Unit 5 Overheating', unit: 'EQ-005', priority: 'critical', status: 'open', assignee: 'Marcus Chen', createdDate: '2026-03-01', description: 'Unit 5 temperature exceeding safe operating range. Coolant system may be failing.' },
  { id: 'TK-002', title: 'Assembly Line Alpha Conveyor Jam', unit: 'EQ-006', priority: 'critical', status: 'in-progress', assignee: 'Sarah Mitchell', createdDate: '2026-02-28', description: 'Intermittent conveyor jamming causing production delays on Line Alpha.' },
  { id: 'TK-003', title: 'QC Station Sensor Calibration', unit: 'EQ-010', priority: 'critical', status: 'open', assignee: 'James Rodriguez', createdDate: '2026-03-02', description: 'Sensor array producing inconsistent readings. Full replacement required.' },
  { id: 'TK-004', title: 'CNC Unit 3 Spindle Replacement', unit: 'EQ-003', priority: 'high', status: 'in-progress', assignee: 'Marcus Chen', createdDate: '2026-02-25', description: 'Spindle showing excessive wear. Replacement parts ordered and received.' },
  { id: 'TK-005', title: 'Assembly Line Beta Belt Inspection', unit: 'EQ-007', priority: 'high', status: 'review', assignee: 'Elena Vasquez', createdDate: '2026-02-27', description: 'Routine inspection revealed minor belt wear. Needs assessment for replacement timeline.' },
  { id: 'TK-006', title: 'CNC Unit 1 Lubrication Service', unit: 'EQ-001', priority: 'medium', status: 'open', assignee: 'David Park', createdDate: '2026-02-20', description: 'Scheduled lubrication service for all moving components.' },
  { id: 'TK-007', title: 'QC Primary Software Update', unit: 'EQ-009', priority: 'medium', status: 'resolved', assignee: 'Sarah Mitchell', createdDate: '2026-02-15', description: 'Install latest firmware update for measurement software.' },
  { id: 'TK-008', title: 'Assembly Line Gamma Pre-run Check', unit: 'EQ-008', priority: 'low', status: 'open', assignee: 'Elena Vasquez', createdDate: '2026-02-22', description: 'Complete pre-production checklist before Q2 product run begins.' },
];

export const initialTeam: TeamMember[] = [
  { id: 'TM-001', name: 'Marcus Chen', role: 'Engineer', status: 'on-site', initials: 'MC', currentAssignment: 'CNC Unit 3 Spindle Replacement' },
  { id: 'TM-002', name: 'Sarah Mitchell', role: 'Technician', status: 'on-site', initials: 'SM', currentAssignment: 'Assembly Line Alpha Conveyor' },
  { id: 'TM-003', name: 'James Rodriguez', role: 'Technician', status: 'on-site', initials: 'JR', currentAssignment: 'QC Station Sensor Calibration' },
  { id: 'TM-004', name: 'Elena Vasquez', role: 'Engineer', status: 'off-site', initials: 'EV', currentAssignment: 'Assembly Line Beta Belt Review' },
  { id: 'TM-005', name: 'David Park', role: 'Supervisor', status: 'on-site', initials: 'DP', currentAssignment: 'Floor Operations Management' },
  { id: 'TM-006', name: 'Rachel Kim', role: 'Supervisor', status: 'unavailable', initials: 'RK', currentAssignment: 'On Leave' },
];

export const initialInspections: Inspection[] = [
  { id: 'INS-001', unit: 'EQ-001', inspector: 'David Park', date: '2026-02-15', status: 'passed', findings: 'All components within specification. No issues found.', photosCount: 4 },
  { id: 'INS-002', unit: 'EQ-002', inspector: 'Elena Vasquez', date: '2026-02-20', status: 'passed', findings: 'Machine recently calibrated. Performance optimal.', photosCount: 3 },
  { id: 'INS-003', unit: 'EQ-003', inspector: 'Marcus Chen', date: '2026-01-30', status: 'failed', findings: 'Spindle wear exceeds tolerance. Replacement recommended.', photosCount: 6 },
  { id: 'INS-004', unit: 'EQ-005', inspector: 'James Rodriguez', date: '2026-01-15', status: 'failed', findings: 'Temperature anomalies detected. Coolant system compromised.', photosCount: 5 },
  { id: 'INS-005', unit: 'EQ-006', inspector: 'Sarah Mitchell', date: '2026-02-25', status: 'passed', findings: 'Line operating normally. Minor conveyor tracking adjustment made.', photosCount: 2 },
  { id: 'INS-006', unit: 'EQ-007', inspector: 'Elena Vasquez', date: '2026-02-18', status: 'passed', findings: 'Belt wear within acceptable range. Monitor at next inspection.', photosCount: 3 },
  { id: 'INS-007', unit: 'EQ-008', inspector: 'David Park', date: '2026-02-05', status: 'pending', findings: 'Pre-production inspection pending completion.', photosCount: 0 },
  { id: 'INS-008', unit: 'EQ-009', inspector: 'James Rodriguez', date: '2026-02-28', status: 'passed', findings: 'All sensors calibrated. Measurement accuracy verified.', photosCount: 4 },
  { id: 'INS-009', unit: 'EQ-010', inspector: 'Marcus Chen', date: '2026-01-20', status: 'failed', findings: 'Multiple sensor failures detected. Array replacement needed.', photosCount: 7 },
  { id: 'INS-010', unit: 'EQ-004', inspector: 'Sarah Mitchell', date: '2026-02-10', status: 'passed', findings: 'Machine in standby condition. Ready for deployment.', photosCount: 2 },
  { id: 'INS-011', unit: 'EQ-001', inspector: 'David Park', date: '2026-03-01', status: 'pending', findings: 'Scheduled monthly inspection.', photosCount: 0 },
  { id: 'INS-012', unit: 'EQ-006', inspector: 'Elena Vasquez', date: '2026-03-02', status: 'pending', findings: 'Follow-up inspection for conveyor tracking.', photosCount: 0 },
];

export const initialActivities: Activity[] = [
  { id: 'ACT-001', action: 'Ticket TK-003 created: QC Station Sensor Calibration', timestamp: '2026-03-02T14:30:00', type: 'ticket' },
  { id: 'ACT-002', action: 'Inspection INS-012 scheduled for Assembly Line Alpha', timestamp: '2026-03-02T11:15:00', type: 'inspection' },
  { id: 'ACT-003', action: 'CNC Unit 5 status changed to Critical', timestamp: '2026-03-01T16:45:00', type: 'equipment' },
  { id: 'ACT-004', action: 'Ticket TK-001 created: CNC Unit 5 Overheating', timestamp: '2026-03-01T16:50:00', type: 'ticket' },
  { id: 'ACT-005', action: 'Marcus Chen assigned to TK-004 Spindle Replacement', timestamp: '2026-02-28T09:00:00', type: 'team' },
  { id: 'ACT-006', action: 'Inspection INS-011 scheduled for CNC Machine Unit 1', timestamp: '2026-03-01T08:30:00', type: 'inspection' },
  { id: 'ACT-007', action: 'Ticket TK-007 resolved: QC Primary Software Update', timestamp: '2026-02-27T15:20:00', type: 'ticket' },
  { id: 'ACT-008', action: 'Elena Vasquez status changed to Off-site', timestamp: '2026-02-27T07:00:00', type: 'team' },
];
