import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();

  function toHome() {
    navigate('/');
  }

  return (
    <>
      <h1>Login Page</h1>
      <Button onClick={() => loginAs('USER')}>Login as User</Button>
      <Button onClick={() => loginAs('ADMIN')}>Login as Admin</Button>
      <Button onClick={() => loginAs('GUEST')}>Login as Guest</Button>
      <div>
        <Button onClick={toHome}>Back to Home</Button>
      </div>
    </>
  );
}

export default LoginPage;
