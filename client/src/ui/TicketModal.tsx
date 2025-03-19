import { useState } from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';

import { Modal, Form, Input, Radio, DatePicker, Select } from 'antd';

import { Record } from './TicketListItemButton';

import { useGetUsers } from '../features/users/useGetUsers';
import { useCreateTickets } from '../features/tickets/useCreateTickets';
import { useGetTicketById } from '../features/tickets/useGetTicketById';
import { useUpdateTicket } from '../features/tickets/useUpdateTicket';
import getUpdatedFields from '../utilities/getUpdatedFields';

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
  closeModal: () => void;
  record?: Record;
  mode: 'create' | 'viewEdit';
}

function TicketModal({ isOpen, closeModal, record, mode }: TicketModalProps) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { isLoading, users } = useGetUsers();
  const { createNewTicket, isCreating } = useCreateTickets();
  const { ticket: ticketDbEntry } = useGetTicketById(record?.id);
  const { updateTicket, isUpdating } = useUpdateTicket();

  const [form] = Form.useForm();
  const userOptions = getOptions(users);

  function handleOk() {
    form.submit();
  }

  function handleCancel() {
    closeModal();
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

  function handleOnFinish(values: Value) {
    if (mode === 'create') {
      onFinishCreate(values);
    } else {
      onFinishEdit(values);
    }
  }

  async function onFinishCreate(values: Value) {
    try {
      const { user, ...rest } = values;
      const updatedValues = {
        ...rest,
        boardId: 1,
        reporterId: 1,
        assigneeId: user,
        dueDate: dayjs(values.dueDate).format('YYYY-MM-DDTHH:mm:ssZ'),
      };
      await createNewTicket(updatedValues);
      setConfirmLoading(isCreating);
      console.log('Creating new Ticket: ', updatedValues);
      form.resetFields();
      closeModal();
    } catch (error) {
      console.error('Error creating ticket: ', error);
    } finally {
      setConfirmLoading(false);
    }
  }

  async function onFinishEdit(values: Value) {
    try {
      const { user, ...rest } = values;
      const ticketId = ticketDbEntry.id;
      const updatedValues = {
        ...rest,
        boardId: 1,
        reporterId: 1,
        assigneeId: user,
        dueDate: dayjs(values.dueDate).format('YYYY-MM-DDTHH:mm:ssZ'),
      };
      const updatedFields = getUpdatedFields(ticketDbEntry, updatedValues);
      await updateTicket({ ticketId, values: updatedFields });
      setConfirmLoading(isUpdating);
      closeModal();
    } catch (error) {
      console.error('Error updating ticket: ', error);
    } finally {
      setConfirmLoading(false);
    }
  }

  return createPortal(
    <Modal
      title={
        mode === 'create'
          ? 'Enter Ticket Information Here'
          : 'Edit Ticket Information'
      }
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      open={isOpen}
      onClose={closeModal}
      getContainer={false}
      destroyOnClose={true}
      mask={false}
      okText={mode === 'create' ? 'Create' : 'Update'}
    >
      <Form
        form={form}
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleOnFinish}
        autoComplete='off'
        disabled={isLoading}
        initialValues={
          mode === 'viewEdit'
            ? {
                title: record?.title,
                description: record?.description,
                dueDate: dayjs(record?.dueDate),
                user: record?.assigneeId,
                status: record?.status,
                priority: record?.priority,
                type: record?.type,
              }
            : { status: 'BACKLOG', priority: 'LOW', type: 'BUG' }
        }
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
          <Input placeholder='Please enter a title' />
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
          <Input placeholder='Please enter a description' />
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
          <DatePicker style={{ width: '100%', textAlign: 'left' }} />
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
          <Select
            style={{ textAlign: 'left' }}
            placeholder='Please select a user'
          >
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
    </Modal>,
    document.body
  );
}

export default TicketModal;
