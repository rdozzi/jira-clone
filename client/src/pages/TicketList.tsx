import dayjs from 'dayjs';

import { Table, Button } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useTickets } from '../contexts/useTickets';
import { useModal } from '../contexts/useModal';

import TicketModal from '../ui/TicketModal';
import TicketListItemButton from '../ui/TicketListItemButton';

const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
const statusOrder = { BACKLOG: 3, IN_PROGRESS: 2, DONE: 1 };

interface DataType {
  id: number;
  title: string;
  dueDate: Date;
  description: string;
  assignee: { lastName: string };
  status: keyof typeof statusOrder;
  priority: keyof typeof priorityOrder;
  type: string;
}

export interface Record {
  assignee: { firstName: string; lastName: string };
  assigneeId: number;
  boardId: number;
  createdAt: Date;
  description: string;
  dueDate: Date | string;
  id: number;
  priority: string;
  reporterId: number;
  status: string;
  title: string;
  type: string;
  updatedAt: Date;
}

const onChange: TableProps<DataType>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra
) => console.log('params', pagination, filters, sorter, extra);

function TicketList() {
  const { isLoading, tickets, error } = useTickets();
  const { isOpen, openModal, closeModal, mode, modalProps } = useModal();

  const record = modalProps?.record as Record;

  if (error) {
    return <div>Error loading tickets: {error.message}</div>;
  }

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
      sorter: {
        compare: (a, b) =>
          dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf(),
        multiple: 2,
      },
      render: (date) => dayjs(date).format('MM / DD / YYYY'),
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      sorter: {
        compare: (a, b) =>
          a.assignee['lastName']
            .toLocaleLowerCase()
            .localeCompare(b.assignee['lastName'].toLocaleLowerCase()),
        multiple: 0,
      },
      render: ({ firstName, lastName }) => `${firstName} ${lastName}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: {
        compare: (a, b) => statusOrder[a.status] - statusOrder[b.status],
        multiple: 1,
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      sorter: {
        compare: (a, b) =>
          priorityOrder[a.priority] - priorityOrder[b.priority],
        multiple: 2,
      },
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
    <div
      style={{
        borderRadius: 8,
        padding: 4,
        background: 'var(--antd-background, transparent)',
      }}
    >
      <Table<DataType>
        columns={columns}
        dataSource={tickets}
        rowKey='id'
        onChange={onChange}
        loading={isLoading}
        pagination={false}
      />
      <div style={{ marginTop: 4 }}>
        <Button onClick={handleCreate}>
          <PlusOutlined /> Create
        </Button>
      </div>

      <TicketModal
        isOpen={isOpen}
        closeModal={closeModal}
        mode={mode}
        record={record}
      />
    </div>
  );
}
export default TicketList;
