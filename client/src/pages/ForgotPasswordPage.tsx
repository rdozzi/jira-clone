import { Card, Form, Input, Button, message, Typography } from 'antd';
import { PublicBackButton } from '../ui/PublicBackButton';

const { Title, Text } = Typography;

function ForgotPasswordPage() {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    message.success('A reset email has been sent to this account');
    form.resetFields();
    console.log(values);
    // call mutation here
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
