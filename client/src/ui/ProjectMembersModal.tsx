import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ProjectMember } from '../types/ProjectMember';
import { Modal, Form, Select } from 'antd';
import { useAddProjectMember } from '../features/projectMember/useAddProjectMember';
import { useUpdateProjectMemberRole } from '../features/projectMember/useUpdateProjectMemberRole';
import { useProjectInfo } from '../contexts/useProjectInfo';
import { useGetUsers } from '../features/users/useGetUsers';
import { PROJECT_ROLES } from '../types/ProjectMember';
import { Users } from '../types/Users';

export interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  record?: ProjectMember;
  mode: 'create' | 'viewEdit' | null;
}

export interface Value {
  projectId: number;
  userId: number;
  projectRole: string;
}

function ProjectMembersModal({ isOpen, closeModal, record, mode }: ModalProps) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { addProjectMember, isAddingProjectMember } = useAddProjectMember();
  const { updateProjectMemberRole, isUpdatingProjectMemberRole } =
    useUpdateProjectMemberRole();
  const { selectedProject, typedProjects, isProjectLoading } = useProjectInfo();
  const { isLoadingUsers, users } = useGetUsers();

  const [form] = Form.useForm();

  function handleOk() {
    form.submit();
  }

  function handleCancel() {
    closeModal();
    form.resetFields();
  }

  function handleOnFinish(values: Value) {
    if (mode === 'create') {
      onFinishAdd(values);
    } else {
      onFinishUpdate(values);
    }
  }

  async function onFinishAdd(values: Value) {
    try {
      const { projectId, ...rest } = values;
      const memberInfo = { ...rest };
      addProjectMember({ projectId, memberInfo });
      setConfirmLoading(isAddingProjectMember);
      form.resetFields();
      closeModal();
    } catch (error) {
      console.error('Error adding member: ', error);
    } finally {
      setConfirmLoading(false);
    }
  }

  async function onFinishUpdate(values: Value) {
    try {
      const { projectId, userId, projectRole } = values;
      updateProjectMemberRole({ projectId, userId, projectRole });
      setConfirmLoading(isUpdatingProjectMemberRole);
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
          ? 'Enter Project, User, & Role'
          : 'Edit User Role Info'
      }
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      open={isOpen}
      onClose={closeModal}
      getContainer={false}
      destroyOnClose={true}
      mask={false}
      okText={mode === 'create' ? 'Add' : 'Update'}
    >
      <Form
        form={form}
        name='projectModalForm'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleOnFinish}
        autoComplete='off'
        disabled={isProjectLoading || isLoadingUsers}
        initialValues={
          mode === 'viewEdit'
            ? {
                projectRole: record?.projectRole,
              }
            : { project: selectedProject }
        }
      >
        <Form.Item
          label='Project'
          name='projectId'
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
            disabled={mode === 'viewEdit'}
          >
            {typedProjects.map((project) => {
              return (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label='User'
          name='userId'
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
            disabled={mode === 'viewEdit'}
          >
            {users?.map((user: Users) => {
              return (
                <Select.Option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label='Role'
          name='projectRole'
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
            {PROJECT_ROLES.map((role, i) => {
              return (
                <Select.Option key={i} value={role}>
                  {role}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>,
    document.body
  );
}

export default ProjectMembersModal;
