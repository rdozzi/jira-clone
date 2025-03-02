import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import HeaderComp from './HeaderComp';
import ThemeToggle from './ThemeToggle';

const { Sider, Footer, Content } = Layout;

type StyleObject = React.CSSProperties;

const siderStyle: StyleObject = { backgroundColor: 'aqua', height: '100vh' };

const footerStyle: StyleObject = {
  backgroundColor: 'lightblue',
};

function AppLayout() {
  return (
    <Layout>
      <Sider style={siderStyle}>
        <div>Sider</div>
        <div>
          <ThemeToggle />
        </div>
      </Sider>
      <Layout>
        <HeaderComp />
        <Content>
          <Outlet />
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
