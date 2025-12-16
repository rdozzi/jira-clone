import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from './contexts/ThemeProvider';
import { DropdownProvider } from './contexts/DropdownContext';
import { ModalProvider } from './contexts/ModalProvider';
import { TicketProvider } from './contexts/TicketProvider';
import { AuthProvider } from './contexts/AuthProvider';
import { ProjectBoardProvider } from './contexts/ProjectBoardProvider';
import { UserProvider } from './contexts/UserProvider';
import { ProjectMemberProvider } from './contexts/ProjectMemberProvider';
import { ProjectInfoProvider } from './contexts/ProjectInfoProvider';
import { AttachmentModalProvider } from './contexts/AttachmentModalProvider';
import { UserHomeTicketProvider } from './contexts/UserHomeTicketProvider';

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

      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <DropdownProvider>
              <ModalProvider>
                <Routes>
                  {/* -- Public Routes -- */}
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
                        <UserProvider>
                          <ProjectBoardProvider>
                            <TicketProvider>
                              <UserHomeTicketProvider>
                                <ProjectInfoProvider>
                                  <ProjectMemberProvider>
                                    <AttachmentModalProvider>
                                      <AppLayout>{<></>}</AppLayout>
                                      <ModalLayer />
                                    </AttachmentModalProvider>
                                  </ProjectMemberProvider>
                                </ProjectInfoProvider>
                              </UserHomeTicketProvider>
                            </TicketProvider>
                          </ProjectBoardProvider>
                        </UserProvider>
                      </ProtectedRoute>
                    }
                  >
                    {/* User Homepage; Renders depending on User Profile */}
                    <Route path='/user-homepage' element={<UserHome />} />
                    <Route path='user-profile' element={<UserProfile />} />

                    {/* Tickets Section */}
                    <Route path='/tickets'>
                      <Route path='ticketlist' element={<TicketList />} />
                      <Route path='taskboard' element={<TaskBoard />} />
                      <Route path='calendar' element={<TaskCalendar />} />
                    </Route>

                    <Route
                      path='/projects/:projectId/*'
                      element={<ProjectInfoLayout />}
                    >
                      <Route path='overview' element={<ProjectOverview />} />
                      <Route path='boards' element={<ProjectBoards />} />
                      <Route path='members' element={<ProjectMembers />} />
                    </Route>
                    <Route
                      path='/projects/view-all'
                      element={<ProjectViewAll />}
                    />
                  </Route>

                  {/* 404 Not Found */}
                  <Route path='*' element={<NotFoundPage />} />
                </Routes>
              </ModalProvider>
            </DropdownProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
