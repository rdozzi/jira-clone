import { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, Select, Space } from 'antd';
import { useUser } from '../contexts/useUser';
import { useUpdateUser } from '../features/users/useUpdateUser';
import { getUpdatedUserFields } from '../utilities/getUpdatedFields';

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

function UserProfile() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const { userSelf, isLoadingUser, error: userSelfError } = useUser();
  const { updateUser, isUpdatingUser } = useUpdateUser();

  const [form] = Form.useForm();

  interface CheckboxChangeEvent {
    target: {
      checked: boolean;
    };
  }

  function onCheckboxChange(e: CheckboxChangeEvent): void {
    setCheckboxChecked(e.target.checked);
    if (!editProfile) {
      setEditProfile(true);
    } else {
      setEditProfile(false);
    }
  }

  useEffect(() => {
    if (!userSelf) return;
    form.setFieldsValue({
      firstName: userSelf?.firstName,
      lastName: userSelf?.lastName,
      email: userSelf?.email,
      organizationRole: userSelf?.organizationRole
        ? convertRole(userSelf?.organizationRole)
        : '',
    });
  }, [
    form,
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

  function onFinishEdit(values: Value) {
    const { organizationRole, ...rest } = values;
    const updatedOrgRole = organizationRole.toUpperCase();
    const updatedValues = { organizationRole: updatedOrgRole, ...rest };
    const updatedFields = getUpdatedUserFields(userSelf, updatedValues);
    if (Object.keys(updatedFields).length === 0) {
      setEditProfile(false);
      setCheckboxChecked(false);
      return;
    }
    if (userSelf?.id !== undefined) {
      const userId = userSelf.id;

      const input = { userId, values: { ...updatedFields } };
      updateUser(input);
    }
    setEditProfile(false);
    setCheckboxChecked(false);
    return;
  }

  return (
    <>
      <Form
        name='userSelfForm'
        {...formItemLayout}
        style={{ maxWidth: 600 }}
        form={form}
        disabled={!editProfile || isUpdatingUser}
        onFinish={onFinishEdit}
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
      <Space>
        <Button disabled={!editProfile} onClick={() => form.submit()}>
          Update
        </Button>
        <Checkbox checked={checkboxChecked} onChange={onCheckboxChange}>
          Edit Profile
        </Checkbox>
      </Space>
      <div>
        <BackButton>Back</BackButton>
      </div>
    </>
  );
}

export default UserProfile;
