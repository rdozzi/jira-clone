import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
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
    const loginCheckPayload = await checkUserLoginInfo(email, password);

    if (!loginCheckPayload) {
      console.error('Login failed');
      form.resetFields();
      error();
      return;
    }

    const { token, userId, organizationRole } = loginCheckPayload;

    login(token, organizationRole, userId);

    // implement conditional logic, if the flag password changed is true then go to other page, else go to user homepage.

    const redirectPath =
      organizationRole === 'SUPERADMIN' ||
      organizationRole === 'ADMIN' ||
      organizationRole === 'USER' ||
      organizationRole === 'GUEST'
        ? '/user-homepage'
        : '*';

    navigate(redirectPath, { replace: true });
  }

  function onFinish(values: LoginFormValues): void {
    const { email, password } = values;
    handleLogin(email, password);
  }

  function onFinishFailed(errorInfo: OnFinishFailedErrorInfo): void {
    console.error('Failed:', errorInfo);
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
            background: 'linear-gradient(135deg, #e7e7e7 0%, #fafafa 100%)',
          }}
        >
          <Card title='Login' style={{ width: 400 }} bordered={false}>
            <div style={{ marginBottom: 16, textAlign: 'center' }}>
              <h2 style={{ margin: 0 }}>Jira Clone</h2>
              <p
                style={{
                  margin: '4px 0',
                  color: 'var(--antd-text-secondary, #666)',
                }}
              >
                A full-stack project management application
              </p>

              <p
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: 'var(--antd-text-secondary, #888)',
                }}
              >
                Built with React, Ant Design, Node.js, PostgreSQL, Prisma, and
                multi-tenant role-based authentication.
              </p>
            </div>

            <div
              style={{
                height: 1,
                background: 'var(--antd-border-color, #d9d9d9)',
                marginBottom: 16,
              }}
            />
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
            <div
              style={{
                marginTop: 16,
                textAlign: 'center',
                fontSize: 12,
                color: 'var(--antd-text-secondary, #999)',
              }}
            >
              <p style={{ marginBottom: 4 }}>
                Demo credentials available in the project README.
              </p>
              <a style={{ fontSize: 12 }}>Forgot password?</a>
            </div>
          </Card>
        </Content>
      </Layout>
    </>
  );
}

export default LoginPage;
