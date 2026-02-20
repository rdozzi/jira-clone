import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { useLogin } from '../features/auth/useLogin';
import { passwordValidation } from '../lib/validation/passwordValidation';
import { useUpdatePasswordSelf } from '../features/users/useUpdatePasswordSelf';

import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Layout,
  Modal,
  Space,
} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

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

interface PasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function LoginPage() {
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const { login, logout: frontendLogout } = useAuth();
  const { newLoginInfo, loginInfoLoading } = useLogin();
  const { updateUserPasswordSelf, isUpdatingPassword } =
    useUpdatePasswordSelf();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

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
    // This calls the login function in the backend and will either inform that the password needs to be updated or will permit the use the Jwt information to get the
    const loginCheckPayload = await checkUserLoginInfo(email, password);

    if (!loginCheckPayload) {
      console.error('Login failed');
      form.resetFields();
      return;
    }

    const { token, userId, organizationRole } = loginCheckPayload;

    login(token, organizationRole, userId);

    if (loginCheckPayload.mustChangePassword) {
      setIsUpdatePasswordModalOpen(true);
      return;
    }

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

  // Login Form related functions
  function onFinish(values: LoginFormValues): void {
    const { email, password } = values;
    handleLogin(email, password);
  }

  function onFinishFailed(errorInfo: OnFinishFailedErrorInfo): void {
    console.error('Failed:', errorInfo);
  }

  // New User Password related functions
  function handlePasswordFormOk() {
    passwordForm.submit();
  }

  function handlePasswordForm(values: PasswordFormValues) {
    const { newPassword, confirmPassword } = values;
    updateUserPasswordSelf({ newPassword, confirmPassword });
    frontendLogout();
    setIsUpdatePasswordModalOpen(false);
  }

  function onCancelPasswordForm() {
    setIsUpdatePasswordModalOpen(false);
    passwordForm.resetFields();
    frontendLogout();
    return null;
  }

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
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
      <Modal
        title='Enter New Password Here'
        open={isUpdatePasswordModalOpen}
        onOk={handlePasswordFormOk}
        width={700}
        centered
        onCancel={onCancelPasswordForm}
        destroyOnClose={true}
        okText={'Update'}
      >
        <Form
          name='userPasswordForm'
          {...formItemLayout}
          form={passwordForm}
          disabled={isUpdatingPassword}
          onFinish={handlePasswordForm}
        >
          <Form.Item
            name='newPassword'
            label='New Password'
            rules={passwordValidation}
          >
            <Input.Password
              placeholder='New Password'
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name='confirmPassword'
            label='Confirm Password'
            rules={passwordValidation}
          >
            <Input.Password
              placeholder='Confirm New Password'
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default LoginPage;
