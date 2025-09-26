import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLogin } from '../features/auth/useLogin';

import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Layout,
  message,
  Space,
} from 'antd';
// import { UserRole } from '../types/UserRole';
// import type { FormProps } from 'antd';

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
  const [messageApi, contextHolder] = message.useMessage();

  const { login } = useAuth();
  const { newLoginInfo, loginInfoLoading } = useLogin();

  function toHome() {
    navigate('/');
  }

  function error() {
    messageApi.open({
      type: 'error',
      content: 'Login failed. Please check your credentials.',
    });
  }

  async function checkUserLoginInfo(email: string, password: string) {
    try {
      const authPayload = await newLoginInfo({
        email,
        password,
      });
      return authPayload;
    } catch (error) {
      console.error('Login:', error);
      return null;
    }
  }

  async function handleLogin(email: string, password: string) {
    console.log(email, password);
    const loginCheckPayload = await checkUserLoginInfo(email, password);

    console.log('Login Check Payload:', loginCheckPayload);

    if (!loginCheckPayload) {
      console.error('Login failed');
      form.resetFields();
      error();
      return;
    }

    const { token, userId, organizationRole } = loginCheckPayload;

    login(token, organizationRole, userId);
    console.log(`Logged in as ${organizationRole}`);
    console.log(`token: ${token}`);
    console.log(`userId: ${userId}`);

    const redirectPath =
      organizationRole === 'SUPERADMIN' ||
      organizationRole === 'ADMIN' ||
      organizationRole === 'USER' ||
      organizationRole === 'GUEST'
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
    const { email, password } = values;
    handleLogin(email, password);
  }

  function onFinishFailed(errorInfo: OnFinishFailedErrorInfo): void {
    console.log('Failed:', errorInfo);
  }

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        {contextHolder} {/* Message API for error messages */}
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
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={loginInfoLoading}
                  >
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
      <div>
        <Button onClick={toHome}>Go To Homepage</Button>
      </div>
    </>
  );
}

export default LoginPage;
