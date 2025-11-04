import { useNavigate } from 'react-router-dom';
import { Avatar, Flex, Space } from 'antd';

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
        <span>{`Hello, ${userSelf?.firstName}!`}</span>
      </Space>
    </Flex>
  );
}

export default UserAvatar;
