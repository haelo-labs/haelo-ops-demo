import React, { createContext, useContext, useCallback } from 'react';
import type { Equipment, Ticket, TeamMember, Inspection, Activity } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialEquipment, initialTickets, initialTeam, initialInspections, initialActivities } from '../data';

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
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [equipment, setEquipment] = useLocalStorage<Equipment[]>('haelo-ops-equipment', initialEquipment);
  const [tickets, setTickets] = useLocalStorage<Ticket[]>('haelo-ops-tickets', initialTickets);
  const [team, setTeam] = useLocalStorage<TeamMember[]>('haelo-ops-team', initialTeam);
  const [inspections, setInspections] = useLocalStorage<Inspection[]>('haelo-ops-inspections', initialInspections);
  const [activities, setActivities] = useLocalStorage<Activity[]>('haelo-ops-activities', initialActivities);

  const addActivity = useCallback((action: string, type: Activity['type']) => {
    const newActivity: Activity = {
      id: `ACT-${Date.now()}`,
      action,
      timestamp: new Date().toISOString(),
      type,
    };
    setActivities(prev => [newActivity, ...prev]);
  }, [setActivities]);

  return (
    <AppContext.Provider value={{ equipment, setEquipment, tickets, setTickets, team, setTeam, inspections, setInspections, activities, addActivity }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
