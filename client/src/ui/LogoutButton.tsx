import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    // Perform any additional logout logic here if needed
    console.log('Logging out...');
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <Button
      type='text'
      icon={<LogoutOutlined />}
      onClick={handleLogout}
      style={{
        fontSize: '20px',
        transition: 'transform 0.3s ease-in-out',
      }}
    />
  );
}

export default LogoutButton;
