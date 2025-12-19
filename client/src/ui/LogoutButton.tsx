import { ReactNode } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useLogout } from '../features/auth/useLogout';

import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

function LogoutButton({ children }: { children?: ReactNode }) {
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
      onClick={handleLogout}
      style={{
        width: '100%',
        textAlign: 'left',
        fontSize: '20px',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          lineHeight: 1, // ensures perfect centering for any font size
          height: '100%', // prevents drift
        }}
      >
        <LogoutOutlined />
        <span style={{ fontSize: '20px' }}>{children ?? 'Logout'}</span>
      </span>
    </Button>
  );
}

export default LogoutButton;
