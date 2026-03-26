import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Card, Checkbox, Typography, Space } from 'antd';
import {
  nameValidationRules,
  organizationNameRules,
} from '../lib/validation/orgRegistrationSchemas';
import { PublicBackButton } from '../ui/PublicBackButton';
import { OrgRegistrationForm } from '../types/OrgRegistration';
import { useCreateOrg } from '../features/setup/useCreateOrg';

const { Title } = Typography;

function RegisterOrganization() {
  const formLoadedAt = useRef(Date.now());
  const [form] = Form.useForm();
  const { createOrg, isCreatingOrg } = useCreateOrg();

  const clickHere = <Link to='/terms-of-service'>Terms of Service</Link>;

  const handleSubmit = async (values: OrgRegistrationForm) => {
    const duration = Date.now() - formLoadedAt.current;

    if (values.contactFax || values.secondaryEmail) {
      return;
    }

    if (duration < 3000) {
      return;
    }

    const createOrgPayload = { duration, ...values };
    console.log(createOrgPayload);

    // createOrg(createOrgPayload);
    form.resetFields();
  };

  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#FAFBFC',
        }}
      >
        <Card
          style={{
            width: 420,
            borderRadius: 8,
            border: '1px solid #DADADA',
          }}
        >
          <Title level={3} style={{ marginBottom: 24 }}>
            Create Organization
          </Title>

          <Form form={form} layout='vertical' onFinish={handleSubmit}>
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
              label='First Name'
              name='firstName'
              rules={nameValidationRules}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Last Name'
              name='lastName'
              rules={nameValidationRules}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Organization Name'
              name='organizationName'
              rules={organizationNameRules}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Email Address'
              name='email'
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Enter a valid email',
                },
                { min: 5, message: 'email should be at least 5 characters' },
                { max: 254, message: 'email cannot exceed 254 characters' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name='acceptTerms'
              valuePropName='checked'
              rules={[
                {
                  validator(_, value) {
                    if (value) return Promise.resolve();
                    return Promise.reject(
                      new Error('You must accept the terms'),
                    );
                  },
                },
              ]}
            >
              <Space>
                <Checkbox />
                <span>I agree to the {clickHere}</span>
              </Space>
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                disabled={isCreatingOrg}
                block
              >
                Create Organization
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <PublicBackButton />
      </div>
    </>
  );
}

export default RegisterOrganization;
