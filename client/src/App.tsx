import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProviderContext } from './contexts/ThemeProviderContext';
import { DropdownProvider } from './contexts/DropdownContext';
import { ModalProviderContext } from './contexts/ModalProviderContext';
import { TicketProviderContext } from './contexts/TicketProviderContext';
import { AuthProviderContext } from './contexts/AuthProviderContext';

import PublicHomepage from './ui/PublicHomepage';
import LoginPage from './ui/LoginPage';
import ProtectedRoute from './ui/ProtectedRoute';
import UserHome from './ui/UserHome';
import NotFoundPage from './ui/NotFoundPage';
import AppLayout from './ui/AppLayout';
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

      <ThemeProviderContext>
        <BrowserRouter>
          <AuthProviderContext>
            <DropdownProvider>
              <ModalProviderContext>
                <TicketProviderContext>
                  <Routes>
                    {/* Public Routes */}
                    <Route path='/' element={<PublicHomepage />} />
                    <Route path='/login' element={<LoginPage />} />

                    {/* Protected Routes */}
                    <Route
                      element={
                        <ProtectedRoute> {<AppLayout />} </ProtectedRoute>
                      }
                    >
                      {/* User Homepage; Renders depending on User Profile */}
                      <Route path='/user-homepage' element={<UserHome />} />

                      {/* Tickets Section */}
                      <Route path='/tickets'>
                        <Route path='ticketlist' element={<TicketList />} />
                        <Route path='taskboard' element={<TaskBoard />} />
                        <Route path='calendar' element={<TaskCalendar />} />
                      </Route>
                    </Route>

                    {/* 404 Not Found */}
                    <Route path='*' element={<NotFoundPage />} />
                  </Routes>
                </TicketProviderContext>
              </ModalProviderContext>
            </DropdownProvider>
          </AuthProviderContext>
        </BrowserRouter>
      </ThemeProviderContext>
    </QueryClientProvider>
  );
}

export default App;
