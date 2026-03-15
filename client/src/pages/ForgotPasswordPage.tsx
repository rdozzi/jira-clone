import { Card, Form, Input, Button, Typography } from 'antd';
import { PublicBackButton } from '../ui/PublicBackButton';
import { useRequestPasswordChange } from '../features/auth/useRequestPasswordChange';
import { ForgotPasswordPayload } from '../types/AuthPublicPassword';

const { Title, Text } = Typography;

function ForgotPasswordPage() {
  const { requestPasswordChange, isRequestingEmail } =
    useRequestPasswordChange();
  const [form] = Form.useForm();

  const handleSubmit = (values: ForgotPasswordPayload) => {
    if (values.contactFax || values.secondaryEmail) {
      return;
    }
    requestPasswordChange(values);
    form.resetFields();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
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

        <Text type='secondary'>Please enter your email.</Text>

        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          style={{ marginTop: 24 }}
        >
          {/* Honeypot */}
          <Form.Item
            name='contactFax'
            style={{ position: 'absolute', left: '-9999px' }}
          >
            <Input autoComplete='off' tabIndex={-1} />
          </Form.Item>
          <Form.Item
            name='secondaryEmail'
            style={{ position: 'absolute', left: '-9999px' }}
          >
            <Input autoComplete='off' tabIndex={-1} />
          </Form.Item>

          {/* Real Form */}
          <Form.Item
            label='Email'
            name='email'
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Enter a valid email',
              },
            ]}
          >
            <Input size='large' />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              disabled={isRequestingEmail}
              block
              style={{
                background: '#5154F0',
                borderColor: '#5154F0',
              }}
            >
              Send Email
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <PublicBackButton />
    </div>
  );
}

export default ForgotPasswordPage;
