import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { AppProvider } from './app/context/AppContext';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <App />
  </AppProvider>
);
