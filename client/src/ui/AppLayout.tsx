import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Select, Avatar, Flex, Space } from 'antd';
import HeaderComp from './HeaderComp';
import ThemeToggle from './ThemeToggle';
import LogoutButton from './LogoutButton';
import UserHomeButton from './UserHomeButton';
import ProjectInfoLink from './ProjectInfoLink';
import { useProjectBoard } from '../contexts/useProjectBoard';
import { useGetUserSelf } from '../features/users/useGetUserSelf';

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
    project,
    setProject,
    boards,
    board,
    setBoard,
    isBoardLoading,
    // boardError,
  } = useProjectBoard();
  const { userSelf } = useGetUserSelf();
  const location = useLocation();
  const navigate = useNavigate();

  function onClick() {
    navigate('/user-profile', { replace: true });
  }

  const isProjectInfoView = /^\/projects\//.test(location.pathname);

  function getInitials(firstName: string, lastName: string) {
    if (!firstName && !lastName) return '?';
    const firstInitial = firstName?.[0] ?? '';
    const lastInitial = lastName?.[0] ?? '';

    const initials = firstInitial + lastInitial;
    return initials || '?';
  }

  return (
    <Layout>
      <Sider style={siderStyle}>
        <Flex justify='flex-start' align='center'>
          <Space>
            <span>
              <Avatar
                size={'large'}
                onClick={onClick}
                style={{ cursor: 'pointer' }}
              >
                {userSelf
                  ? getInitials(userSelf?.firstName, userSelf?.lastName)
                  : '?'}
              </Avatar>
            </span>
            <span>{`Hello, ${userSelf?.firstName}!`}</span>
          </Space>
        </Flex>
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
            value={project?.id}
            loading={isProjectLoading}
            size={'middle'}
            disabled={isProjectInfoView}
            onChange={(id) => {
              const selectedProject =
                projects?.find((p) => p.id === id) || null;
              setProject(selectedProject);
            }}
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
            value={board?.id ?? undefined}
            loading={isBoardLoading}
            size={'middle'}
            disabled={isProjectInfoView}
            onChange={(id) => {
              const selectedBoard = boards?.find((b) => b.id === id) || null;
              setBoard(selectedBoard);
            }}
          >
            {boards?.map((b) => {
              return (
                <Select.Option key={b.id} value={b.id}>
                  {b.name}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <div>
          <ProjectInfoLink />
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
