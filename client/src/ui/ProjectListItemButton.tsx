import { memo } from 'react';
import { useDropdown } from '../contexts/DropdownContext';
import { useModal } from '../contexts/useModal';
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
];

const ProjectListItemButton = memo(function ProjectListItemButton({
  record,
}: {
  record: ProjectMember;
}) {
  const { activeDropdown, closeDropdown, toggleDropdown } = useDropdown();
  const { isOpen, openModal, closeModal, mode, modalProps } = useModal();
  const { removeProjectMember, isRemovingProjectMember } =
    useRemoveProjectMember();

  const isDropdownOpen = activeDropdown === record.userId;

  function handleButtonClick() {
    toggleDropdown(record.userId);
  }

  function handleMenuClick(e: { key: string }) {
    switch (e.key) {
      case 'editRole':
        openModal('viewEdit', { id: record.userId, record });
        console.log('Edit project member role:', record);
        break;

      case 'removeMember':
        removeProjectMember({
          projectId: record.projectId,
          userId: record.userId,
        });
        console.log('Remove project member:', record);
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

export default ProjectListItemButton;
