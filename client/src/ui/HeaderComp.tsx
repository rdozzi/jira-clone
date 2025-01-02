import { Layout, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;

type StyleObject = React.CSSProperties;

const headerStyle: StyleObject = {
  backgroundColor: 'blue',
  color: 'white',
};

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
    <Header style={headerStyle}>
      <Tabs
        activeKey={location.pathname}
        onChange={(key) => navigate(key)}
        items={items}
      />
    </Header>
  );
}

export default HeaderComp;
