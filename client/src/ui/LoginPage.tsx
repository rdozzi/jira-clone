import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

import { UserRole } from '../types/UserRole';

import { Button } from 'antd';

function LoginPage() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();

  function toHome() {
    navigate('/');
  }

  function handleRoleChange(role: UserRole) {
    loginAs(role);
    console.log(`Logged in as ${role}`);

    const redirectPath =
      role === 'ADMIN' || role === 'USER' || role === 'GUEST'
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
