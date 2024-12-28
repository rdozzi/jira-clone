import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppLayout from './ui/AppLayout';
import TicketList from './pages/TicketList';
import Calender from './pages/Calender';
import TaskBoard from './pages/TaskBoard';

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
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path='tickets/ticketlist' element={<TicketList />} />
            <Route path='tickets/taskboard' element={<TaskBoard />} />
            <Route path='tickets/calendar' element={<Calender />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
