import { OrganizationMemberListItemButton } from '../ui/OrganizationMemberListItemButton';
import { OrganizationMembersModal } from '../ui/OrganizationMembersModal';
import BackButton from '../ui/BackButton';

import { useGetUsers } from '../features/users/useGetUsers';
import { useOrganizationUserModal } from '../contexts/modalContexts/useOrganizationUserModal';
import { useUser } from '../contexts/useUser';

import { Spin, Table, Button, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { OrganizationUser } from '../types/Users';

function OrganizationPage() {
  const { isLoadingUsers, users, error } = useGetUsers();
  const { isOpen, openModal, closeModal, modalProps } =
    useOrganizationUserModal();
  const { userSelf } = useUser();

  if (isLoadingUsers) {
    return (
      <div>
        <Spin />
      </div>
    );
  }

  if (error) {
    return <div>Failed to load users</div>;
  }

  const columns: TableColumnsType<OrganizationUser> = [
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: any) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) =>
        a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase()),
    },
    {
      title: 'Organization Role',
      key: 'organizationRole',
      dataIndex: 'organizationRole',
      sorter: (a, b) => a.organizationRole.localeCompare(b.organizationRole),
    },
    {
      title: '',
      key: 'action',
      align: 'center',
      render: (record) => <OrganizationMemberListItemButton record={record} />,
    },
  ];

  function handleCreate() {
    if (
      userSelf?.organizationRole !== 'ADMIN' &&
      userSelf?.organizationRole !== 'SUPERADMIN'
    ) {
      message.error('Insufficient role: Cannot create new user');
    }
    openModal({});
  }

  return (
    <>
      <Table<OrganizationUser>
        columns={columns}
        dataSource={users}
        rowKey='id'
        loading={isLoadingUsers}
        pagination={false}
      />
      <div>
        <Button onClick={handleCreate}>
          <PlusOutlined /> Create User
        </Button>
      </div>
      <BackButton />
      <OrganizationMembersModal
        isOpen={isOpen}
        closeModal={closeModal}
        {...modalProps}
      />
    </>
  );
}

export default OrganizationPage;
