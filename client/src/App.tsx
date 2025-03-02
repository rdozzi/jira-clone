import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import AppLayout from './ui/AppLayout';
import { ModalProviderContext } from './contexts/ModalProviderContext';
import { DropdownProvider } from './contexts/DropdownContext';
import TicketList from './pages/TicketList';
import TaskCalendar from './pages/TaskCalendar';
import TaskBoard from './pages/TaskBoard';
import { ThemeProviderContext } from './contexts/ThemeProviderContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <ThemeProviderContext>
        <BrowserRouter>
          <DropdownProvider>
            <ModalProviderContext>
              <Routes>
                <Route path='tickets' element={<AppLayout />}>
                  <Route path='ticketlist' element={<TicketList />} />
                  <Route path='taskboard' element={<TaskBoard />} />
                  <Route path='calendar' element={<TaskCalendar />} />
                </Route>
              </Routes>
            </ModalProviderContext>
          </DropdownProvider>
        </BrowserRouter>
      </ThemeProviderContext>
    </QueryClientProvider>
  );
}

export default App;
