import { memo } from 'react';
import { Boards } from '../types/Boards';
import { useDropdown } from '../contexts/DropdownContext';
import { useModal } from '../contexts/useModal';
import ProjectBoardsModal from './ProjectBoardsModal';

import { Dropdown, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

const dropdownItems = [
  {
    key: 'view_edit',
    label: 'View/Edit',
  },
  {
    key: 'duplicate',
    label: 'Duplicate',
  },
  {
    key: 'archive',
    label: 'Archive',
  },
  {
    key: 'delete',
    label: 'Delete',
  },
];

const BoardListItemButton = memo(function BoardListItemButton({
  record,
}: {
  record: Boards;
}) {
  const { activeDropdown, closeDropdown, toggleDropdown } = useDropdown();
  const { isOpen, openModal, closeModal, mode, modalProps } = useModal();

  const isDropdownOpen = activeDropdown === record.id;

  function handleButtonClick() {
    toggleDropdown(record.id);
  }

  function handleMenuClick(e: { key: string }) {
    const duplicateBoard: Boards = {
      id: record.id,
      name: record.name,
      projectId: record.projectId,
      description: record.description,
      organizationId: record.organizationId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
    switch (e.key) {
      case 'view_edit':
        openModal('viewEdit', { id: record.id, record });
        console.log('View/Edit board:', record);
        break;

      case 'duplicate':
        if (!record || typeof record != 'object') {
          console.error('Invalid record for duplication', record);
          break;
        }
        // createNewBoard(duplicateBoard);
        console.log('Duplicate board created:', record);
        break;

      case 'archive':
        console.log('Archive board:', record);
        break;

      case 'delete':
        // deleteBoard(record.id);
        console.log('Delete board:', record);
        break;

      default:
        console.log(`Action selected: ${e.key} for board:`, record);
    }
    closeDropdown();
  }

  return (
    <>
      <Dropdown
        menu={{ items: dropdownItems, onClick: handleMenuClick }}
        open={isDropdownOpen}
        trigger={['click']}
        // disabled={isDeleting || isCreating}
        onOpenChange={(open) => {
          if (!open) closeDropdown();
        }}
      >
        <Button type='text' onClick={handleButtonClick}>
          <EllipsisOutlined />
        </Button>
      </Dropdown>
      {isOpen && mode === 'viewEdit' && modalProps?.id === record.id && (
        <ProjectBoardsModal
          isOpen={isOpen}
          closeModal={closeModal}
          mode={mode}
          {...modalProps}
        />
      )}
    </>
  );
});

export default BoardListItemButton;
