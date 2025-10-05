import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProviderContext } from './contexts/ThemeProviderContext';
import { DropdownProvider } from './contexts/DropdownContext';
import { ModalProviderContext } from './contexts/ModalProviderContext';
import { TicketProviderContext } from './contexts/TicketProviderContext';
import { AuthProviderContext } from './contexts/AuthProviderContext';
import { ProjectBoardProviderContext } from './contexts/ProjectBoardProviderContext';
import { UserProviderContext } from './contexts/UserProvider';
import { ProjectMemberProvider } from './contexts/ProjectMemberProvider';
import { ProjectInfoProvider } from './contexts/ProjectInfoProvider';

import PublicHomepage from './pages/PublicHomepage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './router/ProtectedRoute';
import UserHome from './pages/UserHome';
import NotFoundPage from './ui/NotFoundPage';
import AppLayout from './ui/AppLayout';
import TicketList from './pages/TicketList';
import TaskCalendar from './pages/TaskCalendar';
import TaskBoard from './pages/TaskBoard';
import ProjectOverview from './ui/ProjectOverview';
import ProjectMembers from './ui/ProjectMembers';
import ProjectSettings from './ui/ProjectSettings';
import ProjectBoards from './ui/ProjectBoards';
import ProjectActivityLogs from './ui/ProjectActivityLogs';

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
                <UserProviderContext>
                  <ProjectBoardProviderContext>
                    <ProjectMemberProvider>
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
                            <Route
                              path='/user-homepage'
                              element={<UserHome />}
                            />

                            {/* Tickets Section */}
                            <Route path='/tickets'>
                              <Route
                                path='ticketlist'
                                element={<TicketList />}
                              />
                              <Route path='taskboard' element={<TaskBoard />} />
                              <Route
                                path='calendar'
                                element={<TaskCalendar />}
                              />
                            </Route>

                            <Route
                              path='/projects/:projectId/*'
                              element={<ProjectInfoProvider />}
                            >
                              <Route
                                path='overview'
                                element={<ProjectOverview />}
                              />
                              <Route
                                path='boards'
                                element={<ProjectBoards />}
                              />
                              <Route
                                path='members'
                                element={<ProjectMembers />}
                              />
                              <Route
                                path='activityLogs'
                                element={<ProjectActivityLogs />}
                              />
                              <Route
                                path='settings'
                                element={<ProjectSettings />}
                              />
                            </Route>
                          </Route>

                          {/* 404 Not Found */}
                          <Route path='*' element={<NotFoundPage />} />
                        </Routes>
                      </TicketProviderContext>
                    </ProjectMemberProvider>
                  </ProjectBoardProviderContext>
                </UserProviderContext>
              </ModalProviderContext>
            </DropdownProvider>
          </AuthProviderContext>
        </BrowserRouter>
      </ThemeProviderContext>
    </QueryClientProvider>
  );
}

export default App;
