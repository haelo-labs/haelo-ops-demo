import { createBrowserRouter } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { EquipmentPage } from './pages/Equipment';
import { TicketsPage } from './pages/Tickets';
import { InspectionsPage } from './pages/Inspections';
import { TeamPage } from './pages/Team';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'equipment', Component: EquipmentPage },
      { path: 'tickets', Component: TicketsPage },
      { path: 'inspections', Component: InspectionsPage },
      { path: 'team', Component: TeamPage },
    ],
  },
]);
