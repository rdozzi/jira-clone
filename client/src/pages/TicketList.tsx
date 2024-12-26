import React from 'react';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';

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
    sorter: { compare: (a, b) => a.title - b.title },
  },
  {
    title: 'Description',
    dataIndex: 'description',
    sorter: { compare: (a, b) => a.description - b.description },
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

function TicketList(): React.FC {
  return <Table<DataType> columns={columns} onChange={onChange} />;
}
export default TicketList;
