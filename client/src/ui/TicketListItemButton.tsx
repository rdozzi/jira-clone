import { useState, memo } from 'react';
import dayjs from 'dayjs';
import { Ticket } from '../types/Ticket';

import { Dropdown, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import { useDeleteTicket } from '../features/tickets/useDeleteTicket';
import { useCreateTickets } from '../features/tickets/useCreateTickets';
import { useDropdown } from '../contexts/DropdownContext';
import { useModal } from '../contexts/useModal';
import { useAttachmentModal } from '../contexts/useAttachmentModal';

import CommentModal from './CommentModal';

type TicketBase = Omit<Ticket, 'dueDate'> & { dueDate?: string | Date };

type TicketListItemButtonProps<T extends TicketBase> = { record: T };

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
    key: 'add_view_comments',
    label: 'Add/View Comments',
  },
  { key: 'attachments', label: 'Attachments' },
  {
    key: 'delete',
    label: 'Delete',
  },
];

const TicketListItemButton = memo(function TicketListItemButton<
  T extends TicketBase,
>({ record }: TicketListItemButtonProps<T>) {
  const { activeDropdown, closeDropdown, toggleDropdown } = useDropdown();
  const { openModal } = useModal();
  const { deleteTicket, isDeleting } = useDeleteTicket();
  const { createNewTicket, isCreating } = useCreateTickets();
  const { openModal: openAttachmentModal } = useAttachmentModal();

  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const isDropdownOpen = activeDropdown === record.id;

  function handleButtonClick() {
    toggleDropdown(record.id);
  }

  function onOkCommentModal() {
    setIsCommentOpen(false);
  }

  function handleMenuClick(e: { key: string }) {
    const duplicateTicket = {
      assigneeId: record.assigneeId,
      boardId: record.boardId,
      description: record.description,
      dueDate: dayjs(record.dueDate).format('YYYY-MM-DDTHH:mm:ssZ'),
      priority: record.priority,
      reporterId: record.reporterId,
      status: record.status,
      title: `${record.title} (Copy)`,
      type: record.type,
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
        createNewTicket(duplicateTicket);
        break;

      case 'archive':
        console.log(`Archive option selected for ticket`, record.title);
        break;

      case 'add_view_comments':
        setIsCommentOpen(() => true);
        break;

      case 'attachments':
        openAttachmentModal('TICKET', { id: record.id, record });
        break;

      case 'delete':
        deleteTicket(record.id);
        break;

      default:
        console.log(`Action selected: ${e.key} for ticket:`, record);
    }
    closeDropdown();
  }

  return (
    <>
      <Dropdown
        menu={{ items: dropdownItems, onClick: handleMenuClick }}
        open={isDropdownOpen}
        trigger={['click']}
        disabled={isDeleting || isCreating}
        onOpenChange={(open) => {
          if (!open) closeDropdown();
        }}
      >
        <Button type='text' onClick={handleButtonClick}>
          <EllipsisOutlined />
        </Button>
      </Dropdown>

      <CommentModal
        isCommentOpen={isCommentOpen}
        onOk={onOkCommentModal}
        ticketTitle={record.title}
        ticketDescription={record.description}
        recordId={record.id}
      />
    </>
  );
});

export default TicketListItemButton;
