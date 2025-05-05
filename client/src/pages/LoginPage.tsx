import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

import { UserRole } from '../types/UserRole';

import type { FormProps } from 'antd';
import { Layout, Card, Button, Checkbox, Form, Input, Space } from 'antd';

const { Content } = Layout;

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

interface OnFinishFailedErrorInfo {
  errorFields: Array<{ name: (string | number)[]; errors: string[] }>;
  outOfDate: boolean;
}

function LoginPage() {
  const [form] = Form.useForm();
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

  function onFinish(values: LoginFormValues): void {
    console.log('Received values of form: ', values);
  }

  function onFinishFailed(errorInfo: OnFinishFailedErrorInfo): void {
    console.log('Failed:', errorInfo);
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
          background: '#f0f2f5',
        }}
      >
        <Card title='Login' style={{ width: 400 }} bordered={false}>
          <Form
            name='login'
            layout='vertical'
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
            form={form}
          >
            {/* Email Input */}
            <Form.Item<FieldType>
              label='Email'
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Please enter a valid email!',
                  type: 'email',
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Password Input */}
            <Form.Item<FieldType>
              label='Password'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please enter your password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            {/* Remember Me CheckBox */}
            <Form.Item<FieldType>
              name='remember'
              valuePropName='checked'
              label={null}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Space>
              {/* Submit Button */}
              <Form.Item label={null}>
                <Button type='primary' htmlType='submit'>
                  Submit
                </Button>
              </Form.Item>

              {/* Reset */}
              <Form.Item label={null}>
                <Button
                  htmlType='button'
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  Reset
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}

export default LoginPage;
