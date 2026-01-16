import { Table } from 'antd';
import { useProjectInfo } from '../contexts/useProjectInfo';

const columns = [
  { title: 'Field', dataIndex: 'field', key: 'field' },
  { title: 'Info', dataIndex: 'info', key: 'info' },
];

export function ProjectOverview() {
  const { selectedProject } = useProjectInfo();

  const dataSource = [
    {
      key: '1',
      field: 'Project Name',
      info: selectedProject?.name,
    },
    {
      key: '2',
      field: 'Project Description',
      info: selectedProject?.description,
    },
    {
      key: '3',
      field: 'Project Status',
      info: selectedProject?.status,
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      size='middle'
      pagination={false}
    />
  );
}

export default ProjectOverview;
