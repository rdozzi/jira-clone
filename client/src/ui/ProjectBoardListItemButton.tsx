import { memo } from 'react';
import { Boards } from '../types/Boards';
import { useDropdown } from '../contexts/DropdownContext';
import { useModal } from '../contexts/useModal';
import { useCreateBoard } from '../features/boards/useCreateBoard';
import { useDeleteBoard } from '../features/boards/useDeleteBoard';
import { useAttachmentModal } from '../contexts/useAttachmentModal';

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
    key: 'attachments',
    label: 'Attachments',
  },
  {
    key: 'delete',
    label: 'Delete',
  },
];

const ProjectBoardListItemButton = memo(function ProjectBoardListItemButton({
  record,
}: {
  record: Boards;
}) {
  const { activeDropdown, closeDropdown, toggleDropdown } = useDropdown();
  const { openModal } = useModal();
  const { openModal: openAttachmentModal } = useAttachmentModal();
  const { createBoard, isCreatingBoard } = useCreateBoard();
  const { deleteBoard, isDeletingBoard } = useDeleteBoard();

  const isDropdownOpen = activeDropdown === record.id;

  function handleButtonClick() {
    toggleDropdown(record.id);
  }

  function handleMenuClick(e: { key: string }) {
    const partialBoard: Partial<Boards> = {
      name: record.name,
      projectId: record.projectId,
      description: record.description,
    };
    switch (e.key) {
      case 'view_edit':
        openModal('viewEdit', { id: record.id, record });
        break;

      case 'duplicate':
        if (!record || typeof record != 'object') {
          console.error('Invalid record for duplication', record);
          break;
        }
        createBoard(partialBoard);
        break;

      case 'archive':
        console.log(`Archive selected for board: ${record.name}`);
        break;

      case 'attachments':
        openAttachmentModal('BOARD', { id: record.id, record });
        break;

      case 'delete':
        deleteBoard(record.id);
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
        disabled={isDeletingBoard || isCreatingBoard}
        onOpenChange={(open) => {
          if (!open) closeDropdown();
        }}
      >
        <Button type='text' onClick={handleButtonClick}>
          <EllipsisOutlined />
        </Button>
      </Dropdown>
    </>
  );
});

export default ProjectBoardListItemButton;
