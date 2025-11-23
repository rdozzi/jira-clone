import { useNavigate } from 'react-router-dom';
import { Avatar, Flex, Space } from 'antd';
import { useTheme } from '../contexts/useTheme';

import { useGetUserSelf } from '../features/users/useGetUserSelf';

function getInitials(firstName: string, lastName: string) {
  if (!firstName && !lastName) return '?';
  const firstInitial = firstName?.[0] ?? '';
  const lastInitial = lastName?.[0] ?? '';

  const initials = firstInitial + lastInitial;
  return initials || '?';
}

function UserAvatar() {
  const { userSelf } = useGetUserSelf();
  const { modeTheme } = useTheme();
  const navigate = useNavigate();

  function onClick() {
    navigate('/user-profile');
  }

  return (
    <Flex justify='flex-start' align='center'>
      <Space>
        <span>
          <Avatar
            size={'large'}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
          >
            {userSelf
              ? getInitials(userSelf?.firstName, userSelf?.lastName)
              : '?'}
          </Avatar>
        </span>
        <span
          style={{ color: modeTheme === 'dark' ? '#FDFDFD' : '#1F2937' }}
        >{`Hello, ${userSelf?.firstName}!`}</span>
      </Space>
    </Flex>
  );
}

export default UserAvatar;
