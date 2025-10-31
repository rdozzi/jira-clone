import { useAuth } from '../contexts/AuthContext';
import { useLogout } from '../features/auth/useLogout';

import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

function LogoutButton() {
  const { logout: frontendLogout } = useAuth();
  const { mutate: logoutMutation } = useLogout();

  function handleLogout() {
    console.log('Logging out...');

    logoutMutation(undefined, {
      onSuccess: () => {
        console.log('Logout successful');
        frontendLogout();
      },
      onError: (error) => {
        console.error('Logout failed:', error);
      },
    });
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
