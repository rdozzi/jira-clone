import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { useGetTickets } from '../features/tickets/useGetTickets';

interface DataType {
  id: number;
  title: string;
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
    title: 'Status',
    dataIndex: 'status',
    sorter: { compare: (a, b) => a.status - b.status },
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    sorter: { compare: (a, b) => a.priority - b.priority },
  },
  {
    title: 'Type',
    dataIndex: 'type',
    sorter: { compare: (a, b) => a.priority - b.priority },
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
  console.log(tickets);

  return (
    <Table<DataType>
      columns={columns}
      dataSource={tickets}
      onChange={onChange}
    />
  );
}
export default TicketList;
