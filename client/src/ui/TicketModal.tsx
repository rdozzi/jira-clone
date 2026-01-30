import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';

import { Modal, Form, Input, Radio, DatePicker, Select } from 'antd';

import { Ticket, Priority, Status, Type } from '../types/Ticket';

import { useCreateTickets } from '../features/tickets/useCreateTickets';
import { useGetTicketById } from '../features/tickets/useGetTicketById';
import { useUpdateTicket } from '../features/tickets/useUpdateTicket';
import { useProjectBoard } from '../contexts/useProjectBoard';
import { useGetUserSelf } from '../features/users/useGetUserSelf';
import { ProjectMember } from '../types/ProjectMember';
import { getUpdatedFields } from '../utilities/getUpdatedFields';
import { useGetProjectMembers } from '../features/projectMember/useGetProjectMembers';

function getOptions(
  projectMembers?: ProjectMember[],
): { value: number; label: string }[] {
  return (
    projectMembers?.map((projectMember) => ({
      value: projectMember.userId,
      label: `${projectMember.firstName} ${projectMember.lastName}`,
    })) || []
  );
}

export interface TicketModalProps {
  isOpen: boolean;
  closeModal: () => void;
  record?: Ticket;
  mode: 'create' | 'viewEdit' | null;
}

function TicketModal({ isOpen, closeModal, record, mode }: TicketModalProps) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { createNewTicket, isCreating } = useCreateTickets();
  const { ticket } = useGetTicketById(record?.id);
  const { updateTicket, isUpdating } = useUpdateTicket();
  const { projectId, boardId } = useProjectBoard();
  const { userSelf, isLoadingUser } = useGetUserSelf();
  const { isLoadingProjectMember, projectMembers } =
    useGetProjectMembers(projectId);

  const [form] = Form.useForm();

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'create') {
      form.resetFields();
      form.setFieldsValue({ status: 'BACKLOG', priority: 'LOW', type: 'BUG' });
    } else if (mode === 'viewEdit') {
      form.setFieldsValue({
        title: record?.title,
        description: record?.description,
        dueDate: dayjs(record?.dueDate),
        assignee: record?.assigneeId,
        status: record?.status,
        priority: record?.priority,
        type: record?.type,
      });
    }
  }, [isOpen, mode, record, form]);

  const userOptions = getOptions(projectMembers);

  function handleOk() {
    form.submit();
  }

  function handleCancel() {
    closeModal();
  }

  interface Value {
    title: string;
    description: string;
    dueDate: Date;
    assignee: number;
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
      const { assignee, ...rest } = values;
      const updatedValues = {
        ...rest,
        boardId: boardId as number,
        reporterId: userSelf.id,
        assigneeId: assignee,
        dueDate: dayjs(values.dueDate).format('YYYY-MM-DDTHH:mm:ssZ'),
        priority: values.priority as Priority,
        status: values.status as Status,
        type: values.type as Type,
      };

      createNewTicket(updatedValues);
      setConfirmLoading(isCreating);
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
      const { assignee, ...rest } = values;
      const ticketId = ticket?.data?.id;
      const updatedValues = {
        ...rest,
        boardId: boardId as number,
        reporterId: userSelf.id,
        assigneeId: assignee,
        dueDate: dayjs(values.dueDate).format('YYYY-MM-DDTHH:mm:ssZ'),
      };
      const updatedFields = getUpdatedFields(ticket?.data, updatedValues);
      updateTicket({ ticketId, values: updatedFields });
      setConfirmLoading(isUpdating);
      form.resetFields();
      closeModal();
    } catch (error) {
      console.error('Error updating ticket: ', error);
      form.resetFields();
      closeModal();
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
      afterClose={() => form.resetFields()}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      open={isOpen}
      getContainer={false}
      destroyOnClose={true}
      mask={false}
      okText={mode === 'create' ? 'Create' : 'Update'}
    >
      <Form
        form={form}
        key={mode === 'create' ? 'create' : record?.id || 'edit'}
        name='ticketModalForm'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleOnFinish}
        autoComplete='off'
        disabled={isLoadingUser && isLoadingProjectMember}
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
          label='Assignee'
          name='assignee'
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
    document.body,
  );
}

export default TicketModal;
