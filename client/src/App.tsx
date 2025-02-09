import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider } from 'antd';

import AppLayout from './ui/AppLayout';
import { ModalProvider } from './ui/ModalContext';
import TicketList from './pages/TicketList';
import TaskCalendar from './pages/TaskCalendar';
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

      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              itemColor: '#ffffff',
              inkBarColor: '#1677ff',
            },
          },
        }}
      >
        <BrowserRouter>
          <ModalProvider>
            <Routes>
              <Route path='tickets' element={<AppLayout />}>
                <Route path='ticketlist' element={<TicketList />} />
                <Route path='taskboard' element={<TaskBoard />} />
                <Route path='calendar' element={<TaskCalendar />} />
              </Route>
            </Routes>
          </ModalProvider>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
