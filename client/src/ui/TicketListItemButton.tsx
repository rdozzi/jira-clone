import { Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import { useDropdown } from './DropdownContext';

interface Record {
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

const items: MenuProps['items'] = [
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

  const isDropdownOpen = activeDropdown === record.id;

  function handleButtonClick() {
    toggleDropdown(record.id);
  }

  function handleMenuClick(e: { key: string }) {
    console.log(`Action selected: ${e.key} for ticket:`, record);
    closeDropdown();
  }

  return (
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
      open={isDropdownOpen}
      trigger={['click']}
      onOpenChange={(open) => {
        if (!open) closeDropdown();
      }}
    >
      <Button type='text' onClick={handleButtonClick}>
        <EllipsisOutlined />
      </Button>
    </Dropdown>
  );
}

export default TicketListItemButton;
