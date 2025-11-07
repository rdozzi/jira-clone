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
import { AttachmentModalProvider } from './contexts/AttachmentModalProvider';
import { UserHomeTicketProvider } from './contexts/UserHomeTicketProvider';

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
import ProjectBoards from './ui/ProjectBoards';
import ProjectViewAll from './ui/ProjectViewAll';
import ProjectInfoLayout from './ui/ProjectInfoLayout';
import ModalLayer from './ui/ModalLayer';
import UserProfile from './ui/UserProfile';
import PublicRoute from './utilities/PublicRoute';

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
                    <TicketProviderContext>
                      <UserHomeTicketProvider>
                        <ProjectInfoProvider>
                          <ProjectMemberProvider>
                            <AttachmentModalProvider>
                              <Routes>
                                {/* Public Routes */}
                                <Route path='/' element={<PublicHomepage />} />
                                <Route
                                  path='/login'
                                  element={
                                    <PublicRoute>
                                      <LoginPage />
                                    </PublicRoute>
                                  }
                                ></Route>

                                {/* Protected Routes */}
                                <Route
                                  element={
                                    <ProtectedRoute>
                                      {' '}
                                      {<AppLayout />}
                                      <ModalLayer />
                                    </ProtectedRoute>
                                  }
                                >
                                  {/* User Homepage; Renders depending on User Profile */}
                                  <Route
                                    path='/user-homepage'
                                    element={<UserHome />}
                                  />
                                  <Route
                                    path='user-profile'
                                    element={<UserProfile />}
                                  />

                                  {/* Tickets Section */}
                                  <Route path='/tickets'>
                                    <Route
                                      path='ticketlist'
                                      element={<TicketList />}
                                    />
                                    <Route
                                      path='taskboard'
                                      element={<TaskBoard />}
                                    />
                                    <Route
                                      path='calendar'
                                      element={<TaskCalendar />}
                                    />
                                  </Route>

                                  <Route
                                    path='/projects/:projectId/*'
                                    element={<ProjectInfoLayout />}
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
                                  </Route>
                                  <Route
                                    path='/projects/view-all'
                                    element={<ProjectViewAll />}
                                  />
                                </Route>

                                {/* 404 Not Found */}
                                <Route path='*' element={<NotFoundPage />} />
                              </Routes>
                            </AttachmentModalProvider>
                          </ProjectMemberProvider>
                        </ProjectInfoProvider>
                      </UserHomeTicketProvider>
                    </TicketProviderContext>
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
