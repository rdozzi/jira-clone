import { useState } from 'react';
import { Space, Form, Button, Input, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { passwordValidation } from '../lib/validation/passwordValidation';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

interface Password {
  newPassword: string;
  confirmPassword: string;
}

function ChangePassword() {
  const [editPassword, setEditPassword] = useState(false);
  const [passwordForm] = Form.useForm();

  function onFinishPasswordEdit(value: Password) {
    const { newPassword, confirmPassword } = value;
    if (newPassword !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }
    console.log('Password Box Clicked');
    passwordForm.resetFields();
    setEditPassword(false);
  }

  return (
    <>
      <div
        style={{
          maxWidth: 600,
          margin: '20px 0px 0px 20px',
          fontWeight: 'bold',
          fontSize: '24px',
        }}
      >
        Change Password (Required)
      </div>
      <div>
        <Form
          name='userPasswordForm'
          {...formItemLayout}
          style={{ maxWidth: 600, margin: '20px 50px 10px 20px' }}
          form={passwordForm}
          disabled={!editPassword}
          onFinish={onFinishPasswordEdit}
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
      </div>
      <div style={{ maxWidth: 600, margin: '0px 20px 10px 20px' }}>
        <Space>
          <Button
            disabled={!editPassword}
            onClick={() => passwordForm.submit()}
          >
            Update
          </Button>
        </Space>
      </div>
    </>
  );
}

export default ChangePassword;
