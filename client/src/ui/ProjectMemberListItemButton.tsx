import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropdown } from '../contexts/DropdownContext';
import { useProjectMemberModal } from '../contexts/modalContexts/useProjectMemberModal';
import ProjectMembersModal from './ProjectMembersModal';

import { Dropdown, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import { ProjectMember } from '../types/ProjectMember';
import { useRemoveProjectMember } from '../features/projectMember/useRemoveProjectMember';

const dropdownItems = [
  {
    key: 'editRole',
    label: 'Edit Role',
  },
  {
    key: 'removeMember',
    label: 'Remove Member',
  },
  {
    key: 'userInfo',
    label: 'User Info',
  },
];

const ProjectMemberListItemButton = memo(function ProjectMemberListItemButton({
  record,
  projectId,
}: {
  record: ProjectMember;
  projectId: number;
}) {
  const { activeDropdown, closeDropdown, toggleDropdown } = useDropdown();
  const { isOpen, openModal, closeModal, mode, modalProps } =
    useProjectMemberModal();
  const { removeProjectMember, isRemovingProjectMember } =
    useRemoveProjectMember();
  const navigate = useNavigate();

  const isDropdownOpen = activeDropdown === record.userId;

  function handleButtonClick() {
    toggleDropdown(record.userId);
  }

  function handleMenuClick(e: { key: string }) {
    switch (e.key) {
      case 'editRole':
        openModal('viewEdit', { id: record.userId, record });
        break;

      case 'removeMember':
        removeProjectMember({
          projectId: projectId,
          userId: record.userId,
        });
        break;

      case 'userInfo':
        navigate('/user-profile');
        break;

      default:
        console.log(`Action selected: ${e.key} for project member:`, record);
    }
    closeDropdown();
  }

  return (
    <>
      <Dropdown
        menu={{ items: dropdownItems, onClick: handleMenuClick }}
        open={isDropdownOpen}
        trigger={['click']}
        disabled={isRemovingProjectMember}
        onOpenChange={(open) => {
          if (!open) closeDropdown();
        }}
      >
        <Button type='text' onClick={handleButtonClick}>
          <EllipsisOutlined />
        </Button>
      </Dropdown>
      {isOpen &&
        mode === 'viewEdit' &&
        modalProps?.userId === record.userId && (
          <ProjectMembersModal
            isOpen={isOpen}
            closeModal={closeModal}
            mode={mode}
            {...modalProps}
          />
        )}
    </>
  );
});

export default ProjectMemberListItemButton;
