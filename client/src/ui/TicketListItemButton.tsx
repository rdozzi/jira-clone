import { Dropdown, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import { useDeleteTicket } from '../features/tickets/useDeleteTicket';
import { useCreateTickets } from '../features/tickets/useCreateTickets';
import { useDropdown } from '../contexts/DropdownContext';
import { useModal } from '../contexts/useModal';

import TicketModal from './TicketModal';

export interface Record {
  assignee: { first_name: string; last_name: string };
  assigneeId: number;
  boardId: number;
  createdAt: string;
  description: string;
  dueDate: string;
  id: number;
  priority: string;
  reporterId: number;
  status: string;
  title: string;
  type: string;
  udpatedAt: string;
}

interface Ticket {
  assigneeId: number;
  boardId: number;
  description: string;
  dueDate: string;
  priority: string;
  reporterId: number;
  status: string;
  title: string;
  type: string;
}

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

function TicketListItemButton({ record }: { record: Record }) {
  const { activeDropdown, closeDropdown, toggleDropdown } = useDropdown();
  const { isOpen, openModal, closeModal } = useModal();
  const { deleteTicket, isDeleting } = useDeleteTicket();
  const { createNewTicket, isCreating } = useCreateTickets();

  const isDropdownOpen = activeDropdown === record.id;

  function handleButtonClick() {
    toggleDropdown(record.id);
  }

  function onClose() {
    closeModal();
  }

  function handleMenuClick(e: { key: string }) {
    const duplicateTicket: Ticket = {
      assigneeId: record.assigneeId,
      boardId: record.boardId,
      description: record.description,
      dueDate: record.dueDate,
      priority: record.priority,
      reporterId: record.reporterId,
      status: record.status,
      title: `${record.title} (Copy)`,
      type: record.type,
    };
    switch (e.key) {
      case 'view_edit':
        openModal();
        console.log('View/Edit ticket:', record);
        break;

      case 'delete':
        deleteTicket(record.id);
        console.log('Delete ticket:', record);
        break;

      case 'duplicate':
        if (!record || typeof record != 'object') {
          console.error('Invalid record for duplication', record);
          break;
        }
        createNewTicket(duplicateTicket);
        console.log('Duplicate ticket created:', record);
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
      {isOpen && (
        <TicketModal isOpen={isOpen} onClose={onClose} record={record} />
      )}
    </>
  );
}

export default TicketListItemButton;
