import { useState } from 'react';
import { Modal, Form, Input, Radio, DatePicker, Select } from 'antd';
import type { FormProps } from 'antd';
import { useGetUsers } from '../features/users/useGetUsers';
import { useCreateTickets } from '../features/tickets/useCreateTickets';

function CreateTicketModal({ open, onClose }) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { isLoading, users } = useGetUsers();
  const { createNewTicket, isCreating } = useCreateTickets();

  function handleOk() {
    form.submit(); // Triggers form submission
    // setConfirmLoading(true);
    // onClose();
    // setConfirmLoading(false);
  }

  function handleCancel() {
    onClose();
    form.resetFields();
  }

  function onFinish(values) {
    setConfirmLoading(true);
    console.log(values);
    form.resetFields();
    onClose();
    setConfirmLoading(false);
  }

  function getOptions() {
    const userList: [] = [];

    users?.map((user) => {
      const selectObject = {
        value: `${user.first_name}_${user.last_name}`,
        label: `${user.first_name} ${user.last_name}`,
      };
      userList.push(selectObject);
    });

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
      getContainer={false}
    >
      <Form
        form={form}
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
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
          initialValue='BACKLOG'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group>
            <Radio value='BACKLOG'>BACKLOG</Radio>
            <Radio value='IN_PROGRESS'>IN_PROGRESS</Radio>
            <Radio value='DONE'>DONE</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label='Priority'
          name='priority'
          initialValue='LOW'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group>
            <Radio value='LOW'>LOW</Radio>
            <Radio value='MEDIUM'>MEDIUM</Radio>
            <Radio value='HIGH'>HIGH</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label='Type'
          name='type'
          initialValue='BUG'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group>
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
