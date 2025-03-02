import dayjs from 'dayjs';

import { Table, Button } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useGetTickets } from '../features/tickets/useGetTickets';
import { useModal } from '../contexts/useModal';

import TicketModal from '../ui/TicketModal';
import TicketListItemButton from '../ui/TicketListItemButton';

interface DataType {
  id: number;
  title: string;
  dueDate: Date;
  description: string;
  assignee: { last_name: string };
  status: string;
  priority: string;
  type: string;
}

const onChange: TableProps<DataType>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra
) => console.log('params', pagination, filters, sorter, extra);

function TicketList() {
  const { isLoading, tickets, error } = useGetTickets();
  const { isOpen, openModal, closeModal, mode, modalProps } = useModal();

  if (error) {
    return <div>Error loading tickets: {error.message}</div>;
  }

  console.log(tickets);

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      sorter: (a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate)),
      render: (date) => dayjs(date).format('MM / DD / YYYY'),
    },
    {
      title: 'User',
      dataIndex: 'assignee',
      sorter: (a, b) =>
        a.assignee['last_name'].localeCompare(b.assignee['last_name']),
      render: ({ first_name, last_name }) => `${first_name} ${last_name}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      sorter: (a, b) => a.priority.localeCompare(b.priority),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: '',
      key: 'action',
      align: 'center',
      render: (record) => <TicketListItemButton record={record} />,
    },
  ];

  function handleCreate() {
    openModal('create', {});
  }

  return (
    <>
      <Table<DataType>
        columns={columns}
        dataSource={tickets}
        rowKey='id'
        onChange={onChange}
        loading={isLoading}
        pagination={false}
      />
      <div>
        <Button onClick={handleCreate}>
          <PlusOutlined /> Create
        </Button>
      </div>
      {mode === 'create' && (
        <TicketModal
          isOpen={isOpen}
          closeModal={closeModal}
          mode={mode}
          {...modalProps}
        />
      )}
    </>
  );
}
export default TicketList;
