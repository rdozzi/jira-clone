import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { useGetTickets } from '../features/tickets/useGetTickets';
import dayjs from 'dayjs';

interface DataType {
  id: number;
  title: string;
  dueDate: Date;
  description: string;
  status: string;
  priority: string;
  type: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Title',
    dataIndex: 'title',
    sorter: { compare: (a, b) => a.title.localeCompare(b.title) },
  },
  {
    title: 'Description',
    dataIndex: 'description',
    sorter: { compare: (a, b) => a.description.localeCompare(b.description) },
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    sorter: { compare: (a, b) => a.dueDate.valueOf() - b.dueDate.valueOf() },
    render: (date) => dayjs(date).format('MM / DD / YYYY'),
  },
  {
    title: 'User',
    dataIndex: 'assignee',
    sorter: { compare: (a, b) => a.description.localeCompare(b.description) },
    render: ({ first_name, last_name }) => `${first_name} ${last_name}`,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sorter: { compare: (a, b) => a.description.localeCompare(b.description) },
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    sorter: { compare: (a, b) => a.description.localeCompare(b.description) },
  },
  {
    title: 'Type',
    dataIndex: 'type',
    sorter: { compare: (a, b) => a.description.localeCompare(b.description) },
  },
];

const onChange: TableProps<DataType>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra
) => console.log('params', pagination, filters, sorter, extra);

function TicketList() {
  const { isLoading, tickets, error } = useGetTickets();

  return (
    <Table<DataType>
      columns={columns}
      dataSource={tickets}
      rowKey='id'
      onChange={onChange}
    />
  );
}
export default TicketList;
