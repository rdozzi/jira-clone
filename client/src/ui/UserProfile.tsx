import { Form, Input } from 'antd';
import BackButton from './BackButton';
import { useUser } from '../contexts/useUser';
import Loading from './Loading';

function UserProfile() {
  const { userSelf, isLoadingUser, error: userSelfError } = useUser();

  if (isLoadingUser) return <Loading />;
  if (userSelfError) return <div>Error loading user info...</div>;

  console.log(userSelf);

  return (
    <>
      <Form name='userSelfForm' wrapperCol={{ span: 16 }}>
        <Form.Item
          label='First Name'
          rules={[{ required: true, min: 2, max: 150 }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Last Name'
          rules={[{ required: true, min: 2, max: 150 }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label='Email' rules={[{ required: true, min: 5, max: 255 }]}>
          <Input />
        </Form.Item>
        <Form.Item label='Organization Role' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>

      <BackButton>Back</BackButton>
    </>
  );
}

export default UserProfile;
