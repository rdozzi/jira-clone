import { Outlet } from 'react-router-dom';
import { Flex, Layout } from 'antd';

const { Header, Sider, Footer, Content } = Layout;

type StyleObject = React.CSSProperties;

const siderStyle: StyleObject = { backgroundColor: 'aqua', height: '100vh' };

const headerStyle: StyleObject = {
  backgroundColor: 'blue',
  color: 'white',
};

const footerStyle: StyleObject = {
  backgroundColor: 'lightblue',
};

function AppLayout() {
  return (
    <Layout>
      <Sider style={siderStyle}>Sider</Sider>
      <Layout>
        <Header style={headerStyle}>Header</Header>
        <Content>
          <Outlet />
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
