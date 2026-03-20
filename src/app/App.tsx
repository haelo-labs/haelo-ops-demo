import { SpatialProvider } from 'exocor';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'sonner';
import { useOpsDemoExocorTools } from './hooks/useOpsDemoExocorTools';

export default function App() {
  const tools = useOpsDemoExocorTools();

  return (
    <SpatialProvider tools={tools}>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" theme="dark" richColors />
    </SpatialProvider>
  );
}
