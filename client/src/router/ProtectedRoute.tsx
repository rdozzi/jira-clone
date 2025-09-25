import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../ui/Loading';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireRole?: 'ADMIN' | 'USER' | 'GUEST';
};

function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { authState, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }
  if (!isAuthenticated) {
    // If not logged in, redirect to the login page
    return <Navigate to='/login' replace />;
  }

  if (requireRole && authState?.organizationRole !== requireRole) {
    return <Navigate to='/unauthorized' replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
