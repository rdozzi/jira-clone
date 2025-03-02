import { Layout, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;

function HeaderComp() {
  const navigate = useNavigate();
  const location = useLocation();

  const items: TabsProps['items'] = [
    {
      key: '/tickets/ticketlist',
      label: 'Task List',
    },
    {
      key: '/tickets/taskboard',
      label: 'Task Board',
    },
    {
      key: '/tickets/calendar',
      label: 'Calendar',
    },
  ];

  return (
    <Header>
      <Tabs
        activeKey={location.pathname}
        onChange={(key) => navigate(key)}
        items={items}
      />
    </Header>
  );
}

export default HeaderComp;
