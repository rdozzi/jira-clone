import { useState } from 'react';
import { Modal, Form, Input, Radio, DatePicker, Select } from 'antd';
import { useGetUsers } from '../features/users/useGetUsers';
import { useCreateTickets } from '../features/tickets/useCreateTickets';
import dayjs from 'dayjs';
import { Record } from './TicketListItemButton';

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

function getOptions(users: User[]): { value: number; label: string }[] {
  return (
    users?.map((user) => ({
      value: user.id,
      label: `${user.first_name} ${user.last_name}`,
    })) || []
  );
}

export interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  record?: Record;
}

function TicketModal({ isOpen, onClose, record }: TicketModalProps) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { isLoading, users } = useGetUsers();
  const { createNewTicket, isCreating } = useCreateTickets();

  const [form] = Form.useForm();
  const userOptions = getOptions(users);

  function handleOk() {
    form.submit();
  }

  function handleCancel() {
    onClose();
    form.resetFields();
  }

  interface Value {
    title: string;
    description: string;
    dueDate: Date;
    user: number;
    status: string;
    priority: string;
    type: string;
  }

  async function onFinish(values: Value) {
    try {
      const { user, ...rest } = values;
      const updatedValues = {
        ...rest,
        boardId: 1,
        reporterId: 1,
        assigneeId: user,
        dueDate: dayjs(values.dueDate).format('YYYY-MM-DDTHH:mm:ssZ'),
      };
      console.log('updatedValues: ', updatedValues);
      await createNewTicket(updatedValues);
      setConfirmLoading(isCreating);
      onClose();
    } catch (error) {
      console.error('Error creating ticket: ', error);
    } finally {
      setConfirmLoading(false);
    }
  }

  return (
    <Modal
      title='Enter Ticket Information Here'
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      open={isOpen}
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
          <Select>
            {userOptions.map((options) => {
              return (
                <Select.Option key={options.value} value={options.value}>
                  {options.label}
                </Select.Option>
              );
            })}
          </Select>
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

export default TicketModal;
