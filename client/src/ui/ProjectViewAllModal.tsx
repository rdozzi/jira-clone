import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ProjectViewAllProjects } from '../types/Projects';
import { ModalProps } from '../types/ModalProps';
import { Modal, Form, Input } from 'antd';
import { useCreateProject } from '../features/projects/useCreateProject';
import { useUpdateProject } from '../features/projects/useUpdateProject';
import { getUpdatedProjectFields } from '../utilities/getUpdatedFields';

type ProjectModalProps = ModalProps<ProjectViewAllProjects>;

export interface Values {
  name: string;
  description: string;
}

function ProjectViewAllModal({
  isOpen,
  closeModal,
  mode,
  record,
}: ProjectModalProps) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { createProject, isCreatingProject, createProjectError } =
    useCreateProject();
  const { updateProject, isUpdatingProject, projectUpdateError } =
    useUpdateProject();

  const [form] = Form.useForm();

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'create') {
      form.resetFields();
    } else if (mode === 'viewEdit') {
      form.setFieldsValue({
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

  function handleOnFinish(values: Values) {
    if (mode === 'create') {
      onFinishCreate(values);
    } else {
      onFinishEdit(values);
    }
  }

  async function onFinishCreate(values: Values) {
    try {
      createProject(values);
      setConfirmLoading(isCreatingProject);
      form.resetFields();
      closeModal();
    } catch (error) {
      console.error('Error creating ticket: ', error);
    } finally {
      setConfirmLoading(false);
    }
  }

  async function onFinishEdit(values: Values) {
    try {
      const projectId = record?.id as number;
      const updatedFields = getUpdatedProjectFields(record, values);
      updateProject({ projectId, values: updatedFields });
      setConfirmLoading(isUpdatingProject);
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
          ? 'Enter Project Information Here'
          : 'Edit Project Information'
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
        name='projectForm'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleOnFinish}
        autoComplete='off'
        disabled={isCreatingProject || isUpdatingProject}
      >
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
    document.body
  );
}

export default ProjectViewAllModal;
