import { memo, useState } from 'react';
import { useDropdown } from '../contexts/DropdownContext';

import { Dropdown, Button, Popconfirm } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import { OrganizationUser } from '../types/Users';
import { useDeleteUser } from '../features/users/useDeleteUser';

const dropdownItems = [
  {
    key: 'deleteUser',
    label: 'Delete User',
  },
];

export const OrganizationMemberListItemButton = memo(
  function OrganizationMemberListItemButton({
    record,
  }: {
    record: OrganizationUser;
  }) {
    const [isPopConfirmOpen, setIsPopConfirmOpen] = useState<boolean>(false);
    const { activeDropdown, closeDropdown, toggleDropdown } = useDropdown();
    const { deleteUser, isDeletingUser } = useDeleteUser();

    const isDropdownOpen = activeDropdown === record.id;

    function handleButtonClick() {
      toggleDropdown(record.id);
    }

    function handleMenuClick(e: { key: string }) {
      switch (e.key) {
        case 'deleteUser':
          setIsPopConfirmOpen(true);
          break;

        default:
          console.log(`Action selected: ${e.key} for project member:`, record);
      }
      closeDropdown();
    }

    function handlePopConfirmDeleteUser(recordId: number) {
      deleteUser(recordId);
      setIsPopConfirmOpen(false);
      return;
    }

    return (
      <>
        <Dropdown
          menu={{ items: dropdownItems, onClick: handleMenuClick }}
          open={isDropdownOpen}
          trigger={['click']}
          onOpenChange={(open) => {
            if (!open) closeDropdown();
          }}
          disabled={isDeletingUser}
        >
          <Button type='text' onClick={handleButtonClick}>
            <EllipsisOutlined />
          </Button>
        </Dropdown>
        <Popconfirm
          title='Delete User'
          description='Are you sure you want to delete this user?'
          onConfirm={() => handlePopConfirmDeleteUser(record.id)}
          okText='Yes'
          cancelText='No'
          open={isPopConfirmOpen}
        />
      </>
    );
  },
);
