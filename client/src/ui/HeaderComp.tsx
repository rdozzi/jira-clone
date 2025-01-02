import { Layout, Tabs } from 'antd';
import type { TabsProps } from 'antd';

const { Header } = Layout;

type StyleObject = React.CSSProperties;

const headerStyle: StyleObject = {
  backgroundColor: 'blue',
  color: 'white',
};

const items: TabsProps['items'] = [
  {
    key: 'taskList',
    label: 'Task List',
  },
  {
    key: 'taskBoard',
    label: 'Task Board',
  },
  {
    key: 'calendar',
    label: 'Calendar',
  },
];

function HeaderComp() {
  return (
    <Header style={headerStyle}>
      <Tabs defaultActiveKey='taskList' items={items} />
    </Header>
  );
}

export default HeaderComp;
