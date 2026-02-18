import { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, message, Select, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useUser } from '../contexts/useUser';
import { useUpdateUser } from '../features/users/useUpdateUser';
import { getUpdatedUserFields } from '../utilities/getUpdatedFields';
import { passwordValidation } from '../lib/validation/passwordValidation';
import { useUpdatePasswordSelf } from '../features/users/useUpdatePasswordSelf';

import BackButton from './BackButton';
import Loading from './Loading';

import { organizationRole } from '../types/OrganizationRole';

// Convert input strings to proper case; SUPERADMIN -> SuperAdmin
function convertRole(input: string) {
  if (input === 'SUPERADMIN') return 'SuperAdmin';
  const firstLetter = input[0];
  const remainingString = input.slice(1, input.length).toLowerCase();

  const properCaseString = firstLetter + remainingString;
  return properCaseString;
}

const orgRoleObject = organizationRole.map((role) => {
  return { value: role, label: convertRole(role) };
});

interface Value {
  firstName: string;
  lastName: string;
  organizationRole: string;
  email: string;
}

interface Password {
  newPassword: string;
  confirmPassword: string;
}

export function UserProfile() {
  const [profileCheckboxChecked, setProfileCheckboxChecked] = useState(false);
  const [passwordCheckBoxChecked, setPasswordCheckBoxChecked] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const { userSelf, isLoadingUser, error: userSelfError } = useUser();
  const { updateUser, isUpdatingUser } = useUpdateUser();
  const { updateUserPasswordSelf, isUpdatingPassword, passwordUpdateError } =
    useUpdatePasswordSelf();

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  interface CheckboxChangeEvent {
    target: {
      checked: boolean;
    };
  }

  function onProfileCheckboxChange(e: CheckboxChangeEvent): void {
    setProfileCheckboxChecked(e.target.checked);
    if (!editProfile) {
      setEditProfile(true);
    } else {
      setEditProfile(false);
    }
  }

  function onPasswordCheckboxChange(e: CheckboxChangeEvent): void {
    setPasswordCheckBoxChecked(e.target.checked);
    if (!editPassword) {
      setEditPassword(true);
    } else {
      setEditPassword(false);
      passwordForm.resetFields();
    }
  }

  useEffect(() => {
    if (!userSelf) return;
    profileForm.setFieldsValue({
      firstName: userSelf?.firstName,
      lastName: userSelf?.lastName,
      email: userSelf?.email,
      organizationRole: userSelf?.organizationRole
        ? convertRole(userSelf?.organizationRole)
        : '',
    });
  }, [
    profileForm,
    userSelf,
    userSelf?.firstName,
    userSelf?.lastName,
    userSelf?.email,
    userSelf?.organizationRole,
  ]);

  if (isLoadingUser) return <Loading />;
  if (userSelfError) return <div>Error loading user info...</div>;

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  function onFinishProfileEdit(values: Value) {
    const { organizationRole, ...rest } = values;
    const updatedOrgRole = organizationRole.toUpperCase();
    const updatedValues = { organizationRole: updatedOrgRole, ...rest };
    const updatedFields = getUpdatedUserFields(userSelf, updatedValues);
    if (Object.keys(updatedFields).length === 0) {
      setEditProfile(false);
      setProfileCheckboxChecked(false);
      return;
    }
    if (userSelf?.id !== undefined) {
      const userId = userSelf.id;

      const input = { userId, values: { ...updatedFields } };
      updateUser(input);
    }
    setEditProfile(false);
    setProfileCheckboxChecked(false);
    return;
  }

  function onFinishPasswordEdit(value: Password) {
    const { newPassword, confirmPassword } = value;
    if (newPassword !== confirmPassword) {
      message.error('Passwords do not match.');
      return;
    }
    updateUserPasswordSelf({ newPassword, confirmPassword });

    passwordForm.resetFields();
    setEditPassword(false);
    setPasswordCheckBoxChecked(false);
  }

  return (
    <>
      {/* Profile edit section */}

      <section>
        <div
          style={{
            maxWidth: 600,
            margin: '20px 0px 0px 20px',
            fontWeight: 'bold',
            fontSize: '24px',
          }}
        >
          User Profile Information
        </div>
        <Form
          name='userSelfForm'
          {...formItemLayout}
          style={{ maxWidth: 600, margin: '20px 50px 10px 20px' }}
          form={profileForm}
          disabled={!editProfile || isUpdatingUser}
          onFinish={onFinishProfileEdit}
        >
          <Form.Item
            name='firstName'
            label='First Name'
            rules={[{ required: true, min: 2, max: 150 }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='lastName'
            label='Last Name'
            rules={[{ required: true, min: 2, max: 150 }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            rules={[{ required: true, min: 5, max: 255 }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Organization Role'
            name='organizationRole'
            rules={[{ required: true }]}
          >
            <Select options={orgRoleObject}></Select>
          </Form.Item>
        </Form>
        <div style={{ maxWidth: 600, margin: '0px 20px 10px 20px' }}>
          <Space>
            <Button
              disabled={!editProfile}
              onClick={() => profileForm.submit()}
            >
              Update
            </Button>
            <Checkbox
              checked={profileCheckboxChecked}
              onChange={onProfileCheckboxChange}
            >
              Edit Profile
            </Checkbox>
          </Space>
        </div>
      </section>

      {/* Password edit section */}

      <section>
        <div
          style={{
            maxWidth: 600,
            margin: '20px 0px 0px 20px',
            fontWeight: 'bold',
            fontSize: '24px',
          }}
        >
          Update Password
        </div>
        <div>
          <Form
            name='userPasswordForm'
            {...formItemLayout}
            style={{ maxWidth: 600, margin: '20px 50px 10px 20px' }}
            form={passwordForm}
            disabled={!editPassword || isUpdatingPassword}
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
            <Checkbox
              checked={passwordCheckBoxChecked}
              onChange={onPasswordCheckboxChange}
            >
              Edit Password
            </Checkbox>
          </Space>
        </div>
      </section>
      <div>
        <BackButton>Back</BackButton>
      </div>
    </>
  );
}

export default UserProfile;
