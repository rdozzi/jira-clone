import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

import { UserRole } from '../types/UserRole';

import { Button } from 'antd';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  function toHome() {
    navigate('/');
  }

  function handleRoleChange(userRole: UserRole) {
    login('sample_token', userRole, 1); // token and userId are stubbed for now
    console.log(`Logged in as ${userRole}`);

    const redirectPath =
      userRole === 'ADMIN' || userRole === 'USER' || userRole === 'GUEST'
        ? '/user-homepage'
        : '*';
    // role === 'ADMIN'
    //   ? '/admin-dashboard'
    //   : role === 'USER'
    //   ? '/user-dashboard'
    //   : '/guest-dashboard';
    // Redirect to the appropriate dashboard based on the role

    navigate(redirectPath, { replace: true });
  }

  return (
    <>
      <h1>Login Page</h1>
      <Button onClick={() => handleRoleChange('USER')}>Login as User</Button>
      <Button onClick={() => handleRoleChange('ADMIN')}>Login as Admin</Button>
      <Button onClick={() => handleRoleChange('GUEST')}>Login as Guest</Button>
      <div>
        <Button onClick={toHome}>Back to Home</Button>
      </div>
    </>
  );
}

export default LoginPage;
