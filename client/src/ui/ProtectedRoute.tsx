import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authState } = useAuth();

  // Check if the user is logged in and has the required role
  if (authState.isAuthenticated === false) {
    // If not logged in, redirect to the login page
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
