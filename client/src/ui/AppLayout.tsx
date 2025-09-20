import { Outlet } from 'react-router-dom';
import { Layout, Select } from 'antd';
import HeaderComp from './HeaderComp';
import ThemeToggle from './ThemeToggle';
import LogoutButton from './LogoutButton';
import UserHomeButton from './UserHomeButton';
import { useProjectBoard } from '../contexts/useProjectBoard';

const { Sider, Footer, Content } = Layout;

type StyleObject = React.CSSProperties;

const siderStyle: StyleObject = { backgroundColor: 'aqua', height: '100vh' };

const footerStyle: StyleObject = {
  backgroundColor: 'lightblue',
};

function AppLayout() {
  const {
    projects,
    isProjectLoading,
    // projectError,
    boards,
    isBoardLoading,
    // boardError,
  } = useProjectBoard();

  return (
    <Layout>
      <Sider style={siderStyle}>
        <div>Sider</div>
        <div>
          <ThemeToggle />
        </div>
        <div>
          <LogoutButton />
        </div>
        <div>
          <UserHomeButton />
        </div>
        <div>
          <Select
            style={{ width: '100%', textAlign: 'left' }}
            // placeholder='Please select a project'
            defaultValue={projects?.[0]?.name}
            loading={isProjectLoading}
            size={'middle'}
          >
            {projects?.map((project) => {
              return (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <div>
          <Select
            style={{ width: '100%', textAlign: 'left' }}
            // placeholder='Please select a board'
            defaultValue={boards?.[0]?.name}
            loading={isBoardLoading}
            size={'middle'}
          >
            {boards?.map((board) => {
              return (
                <Select.Option key={board.id} value={board.id}>
                  {board.name}
                </Select.Option>
              );
            })}
          </Select>
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
