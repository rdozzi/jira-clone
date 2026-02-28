import { useState } from 'react';
import { createPortal } from 'react-dom';
import { OrganizationUser } from '../types/Users';
import { organizationRole } from '../types/OrganizationRole';
import { Modal, Form, Select, Input } from 'antd';
import { useCreateUser } from '../features/users/useCreateUser';
import { Users } from '../types/Users';

export interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  record?: OrganizationUser;
}

export interface Value {
  projectId: number;
  userId: number;
  projectRole: string;
}

export function OrganizationMembersModal({ isOpen, closeModal }: ModalProps) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { createUser, isCreating } = useCreateUser();

  const [form] = Form.useForm();

  function handleOk() {
    form.submit();
  }

  function handleCancel() {
    closeModal();
    form.resetFields();
  }

  async function onFinishCreate(values: Partial<Users>) {
    try {
      createUser(values);
      setConfirmLoading(isCreating);
      form.resetFields();
      closeModal();
    } catch (error) {
      console.error('Error adding member: ', error);
    } finally {
      setConfirmLoading(false);
    }
  }

  return createPortal(
    <Modal
      title={'Enter User Information'}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      open={isOpen}
      onClose={closeModal}
      getContainer={false}
      destroyOnClose={true}
      mask={false}
      okText={'create'}
    >
      <Form
        form={form}
        name='projectModalForm'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinishCreate}
        autoComplete='off'
      >
        {/* First Name */}
        <Form.Item
          label='First Name'
          name='firstName'
          rules={[
            {
              required: true,
              message: "Please provide the user's first name!",
            },
          ]}
        >
          <Input placeholder='Please enter a name' />
        </Form.Item>
        {/* Last Name */}
        <Form.Item
          label='Last Name'
          name='lastName'
          rules={[
            {
              required: true,
              message: "Please provide the user's last name!",
            },
          ]}
        >
          <Input placeholder='Please enter a name' />
        </Form.Item>
        {/* Email */}
        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              message: "Please provide the user's email!",
              type: 'email',
            },
          ]}
        >
          <Input placeholder='Please enter a valid email address' />
        </Form.Item>
        {/* Organization Role */}
        <Form.Item
          label='Organization Role'
          name='organizationRole'
          rules={[
            {
              required: true,
              message: 'Please provide a role!',
            },
          ]}
        >
          <Select
            style={{ textAlign: 'left' }}
            placeholder='Please select a role'
          >
            {organizationRole.map((role, i) => {
              const lowerCase = role.slice(1, role.length).toLowerCase();
              const properCaseRole = role.slice(0, 1) + lowerCase;
              return (
                <Select.Option key={i} value={role}>
                  {properCaseRole}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>,
    document.body,
  );
}
