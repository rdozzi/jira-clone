import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to='/user-homepage' replace={true} />;
  }

  return children;
}

export default PublicRoute;
