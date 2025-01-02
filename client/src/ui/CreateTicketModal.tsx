import { useState } from 'react';
import { Modal, Form, Input, Radio, DatePicker, Select } from 'antd';
import type { FormProps } from 'antd';
import { useGetUsers } from '../features/users/useGetUsers';

function CreateTicketModal({ open, onClose }) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { isLoading, users } = useGetUsers();

  function handleOk() {
    setConfirmLoading(true);
    setTimeout(() => {
      onClose();
      setConfirmLoading(false);
    }, 2000);
  }

  function handleCancel() {
    onClose();
  }

  function getOptions() {
    const userList = [];

    users?.map((user) => {
      const selectObject = {
        value: `${user.first_name}_${user.last_name}`,
        label: `${user.first_name} ${user.last_name}`,
      };
      userList.push(selectObject);
    });

    console.log(userList);

    return userList;
  }

  return (
    <Modal
      title='Enter Ticket Information Here'
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      open={open}
      onClose={onClose}
    >
      <Form
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete='off'
        disabled={isLoading}
      >
        <Form.Item
          label='Title'
          name='title'
          rules={[
            {
              required: true,
              message: 'Please provide a ticket name',
              max: 50,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Description'
          name='description'
          rules={[
            {
              required: true,
              message: 'Please provide a description',
              max: 255,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Due Date'
          name='dueDate'
          rules={[
            {
              required: true,
              message: 'Please provide a due date!',
            },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label='User'
          name='user'
          rules={[
            {
              required: true,
              message: 'Please provide a user!',
            },
          ]}
        >
          <Select options={getOptions()} />
        </Form.Item>

        <Form.Item
          label='Status'
          name='status'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group defaultValue='BACKLOG'>
            <Radio value='BACKLOG'>BACKLOG</Radio>
            <Radio value='IN_PROGRESS'>IN_PROGRESS</Radio>
            <Radio value='DONE'>DONE</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label='Priority'
          name='priority'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group defaultValue='LOW'>
            <Radio value='LOW'>LOW</Radio>
            <Radio value='MEDIUM'>MEDIUM</Radio>
            <Radio value='HIGH'>HIGH</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label='Type'
          name='type'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group defaultValue='BUG'>
            <Radio value='BUG'>BUG</Radio>
            <Radio value='TASK'>TASK</Radio>
            <Radio value='STORY'>STORY</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateTicketModal;
