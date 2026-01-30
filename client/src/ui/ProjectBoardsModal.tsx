import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Form, Input, Select } from 'antd';
import { useProjectInfo } from '../contexts/useProjectInfo';
import { useGetBoardById } from '../features/boards/useGetBoardsById';
import { useUpdateBoard } from '../features/boards/useUpdateBoard';
import { getUpdatedBoardFields } from '../utilities/getUpdatedFields';
import { Board } from '../types/Board';
import { Project } from '../types/Projects';

import { useCreateBoard } from '../features/boards/useCreateBoard';

export interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  record?: Board;
  mode: 'create' | 'viewEdit' | null;
}

export interface Value {
  project: number;
  name: string;
  description: string;
}

function getOptions(projects?: Project[]): { value: number; label: string }[] {
  return (
    projects?.map((project) => ({
      value: project.id,
      label: `${project.name}`,
    })) || []
  );
}

function ProjectBoardsModal({ isOpen, closeModal, record, mode }: ModalProps) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { typedProjects, isProjectLoading } = useProjectInfo();
  const { createBoard, isCreatingBoard } = useCreateBoard();
  const { board } = useGetBoardById(record?.id);
  const { updateBoard, isUpdatingBoard } = useUpdateBoard();

  const [form] = Form.useForm();
  const projectOptions = getOptions(typedProjects);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'create') {
      form.resetFields();
    } else if (mode === 'viewEdit') {
      form.setFieldsValue({
        project: record?.projectId,
        name: record?.name,
        description: record?.description,
      });
    }
  }, [isOpen, mode, record, form]);

  function handleOk() {
    form.submit();
  }

  function handleCancel() {
    closeModal();
    form.resetFields();
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
      const { project, ...rest } = values;
      const newValues = { projectId: project, ...rest };
      createBoard(newValues);
      setConfirmLoading(isCreatingBoard);
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
      const { project, ...rest } = values;
      const newValues = { projectId: project, ...rest };
      const boardId = board.id;
      const updatedFields = getUpdatedBoardFields(board, newValues);
      updateBoard({ boardId, values: updatedFields });
      setConfirmLoading(isUpdatingBoard);
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
          ? 'Enter Board Information Here'
          : 'Edit Board Information'
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
        name='projectBoardForm'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleOnFinish}
        autoComplete='off'
        disabled={isProjectLoading}
      >
        <Form.Item
          label='Project'
          name='project'
          rules={[
            {
              required: true,
              message: 'Please provide a project!',
            },
          ]}
        >
          <Select
            style={{ textAlign: 'left' }}
            placeholder='Please select a project'
          >
            {projectOptions.map((options) => {
              return (
                <Select.Option key={options.value} value={options.value}>
                  {options.label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label='Name'
          name='name'
          rules={[
            {
              required: true,
              message: 'Please provide a name',
              max: 255,
            },
          ]}
        >
          <Input placeholder='Please enter a name' />
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
      </Form>
    </Modal>,
    document.body,
  );
}

export default ProjectBoardsModal;
