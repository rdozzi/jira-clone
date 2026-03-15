import { Navigate, useSearchParams } from 'react-router-dom';
import { Card, Form, Input, Button, Typography } from 'antd';
import { passwordValidation } from '../lib/validation/passwordValidation';
import { useChangePasswordPublic } from '../features/auth/useChangePasswordPublic';

const { Title, Text } = Typography;

function ChangePasswordPage() {
  const { changePasswordPublic, isChangingPassword } =
    useChangePasswordPublic();
  const [searchParams] = useSearchParams();
  const token = searchParams?.get('token');

  const [form] = Form.useForm();

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  const handleSubmit = (values: any) => {
    const changePasswordPayload = { token, ...values };
    try {
      changePasswordPublic(changePasswordPayload);
      form.resetFields();
      <Navigate to='/login' replace />;
    } catch (error) {
      console.error(`Could not update password: ${error}`);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#FAFBFC',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <Card
        style={{
          width: 420,
          borderRadius: 8,
          border: '1px solid #DADADA',
        }}
        styles={{ body: { padding: 32 } }}
      >
        <Title level={3} style={{ marginBottom: 8 }}>
          Change Password
        </Title>

        <Text type='secondary'>Please choose a new password.</Text>

        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label='New Password'
            name='newPassword'
            rules={passwordValidation}
          >
            <Input.Password size='large' />
          </Form.Item>

          <Form.Item
            label='Confirm New Password'
            name='confirmPassword'
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password size='large' />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              disabled={isChangingPassword}
              block
              style={{
                background: '#5154F0',
                borderColor: '#5154F0',
              }}
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ChangePasswordPage;
