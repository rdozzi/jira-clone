import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthBoundaryProviders } from './AuthBoundaryProviders';

import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../router/ProtectedRoute';
import UserHome from '../pages/UserHome';
import NotFoundPage from '../ui/NotFoundPage';
import AppLayout from '../ui/AppLayout';
import TicketList from '../pages/TicketList';
import TaskCalendar from '../pages/TaskCalendar';
import TaskBoard from '../pages/TaskBoard';
import ProjectOverview from '../ui/ProjectOverview';
import ProjectMembers from '../ui/ProjectMembers';
import ProjectBoards from '../ui/ProjectBoards';
import ProjectViewAll from '../ui/ProjectViewAll';
import ProjectInfoLayout from '../ui/ProjectInfoLayout';
import UserProfile from '../ui/UserProfile';
import PublicRoute from '../utilities/PublicRoute';
import ChangePassword from '../pages/ChangePassword';

export function AppRoutes() {
  return (
    <Routes>
      {/* -- Public Routes -- */}
      <Route path='/' element={<Navigate to='/login' replace />} />
      <Route
        path='/login'
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AuthBoundaryProviders>
              <AppLayout />
            </AuthBoundaryProviders>
          </ProtectedRoute>
        }
      >
        {/* User Homepage; Renders depending on User Profile */}
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/user-homepage' element={<UserHome />} />
        <Route path='user-profile' element={<UserProfile />} />

        {/* Tickets Section */}
        <Route path='/tickets'>
          <Route path='ticketlist' element={<TicketList />} />
          <Route path='taskboard' element={<TaskBoard />} />
          <Route path='calendar' element={<TaskCalendar />} />
        </Route>

        <Route path='/projects/:projectId/*' element={<ProjectInfoLayout />}>
          <Route path='overview' element={<ProjectOverview />} />
          <Route path='boards' element={<ProjectBoards />} />
          <Route path='members' element={<ProjectMembers />} />
        </Route>
        <Route path='/projects/view-all' element={<ProjectViewAll />} />
      </Route>

      {/* 404 Not Found */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}
