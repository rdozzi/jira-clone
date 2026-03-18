import { memo } from 'react';
import { Board } from '../types/Board';
import { useDropdown } from '../contexts/DropdownContext';
import { useBoardModal } from '../contexts/modalContexts/useBoardModal';
import { useCreateBoard } from '../features/boards/useCreateBoard';
import { useDeleteBoard } from '../features/boards/useDeleteBoard';
import { useAttachmentModal } from '../contexts/useAttachmentModal';
import { useUser } from '../contexts/useUser';

import { Dropdown, Button, message } from 'antd';
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
  record: Board;
}) {
  const { activeDropdown, closeDropdown, toggleDropdown } = useDropdown();
  const { openModal: openBoardModal } = useBoardModal();
  const { openModal: openAttachmentModal } = useAttachmentModal();
  const { createBoard, isCreatingBoard } = useCreateBoard();
  const { deleteBoard, isDeletingBoard } = useDeleteBoard();
  const { userSelf } = useUser();

  const isDropdownOpen = activeDropdown === record.id;

  function handleButtonClick() {
    toggleDropdown(record.id);
  }

  function handleMenuClick(e: { key: string }) {
    const partialBoard: Partial<Board> = {
      name: record.name,
      projectId: record.projectId,
      description: record.description,
    };
    switch (e.key) {
      case 'view_edit':
        openBoardModal('viewEdit', { id: record.id, record });
        break;

      case 'duplicate':
        if (userSelf?.isDemoUser) {
          message.info('This button is disabled for demo users');
          return;
        }
        if (!record || typeof record != 'object') {
          console.error('Invalid record for duplication', record);
          break;
        }
        createBoard(partialBoard);
        break;

      case 'archive':
        message.info(
          `Archive selected for board: ${record.name} [Future feature]`,
        );
        break;

      case 'attachments':
        openAttachmentModal('BOARD', { id: record.id, record });
        break;

      case 'delete':
        if (userSelf?.isDemoUser) {
          message.info('This button is disabled for demo users');
          return;
        }
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
