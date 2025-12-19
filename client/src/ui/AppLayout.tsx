import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Flex, Typography } from 'antd';
import {
  LogoutOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import SidebarActionButton from './SidebarActionButton';
import HeaderComp from './HeaderComp';
import UserAvatar from './UserAvatar';
import { useProjectBoard } from '../contexts/useProjectBoard';
import { useAuth } from '../contexts/useAuth';
import { useLogout } from '../features/auth/useLogout';
import { useProjectInfo } from '../contexts/useProjectInfo';
import { useTheme } from '../contexts/useTheme';
import { GenericDropdown } from './GenericDropdown';
import ModalLayer from '../ui/ModalLayer';

const { Text } = Typography;

const { Sider, Content } = Layout;

function AppLayout() {
  const location = useLocation();
  const { logout: frontendLogout } = useAuth();
  const { mutate: logoutMutation } = useLogout();
  const { projectIdNumber } = useProjectInfo();
  const { modeTheme, toggleTheme } = useTheme();
  const {
    projects,
    isProjectLoading,
    project,
    setProject,
    boards,
    board,
    setBoard,
    isBoardLoading,
  } = useProjectBoard();

  const isProjectInfoView = /^\/projects\//.test(location.pathname);
  const isUserHomePageView = /^\/user-homepage/.test(location.pathname);
  const isUserProfileView = /^\/user-profile/.test(location.pathname);

  const navigate = useNavigate();

  function handleLogout() {
    logoutMutation(undefined, {
      onSuccess: () => {
        frontendLogout();
      },
      onError: (error) => {
        console.error('Logout failed:', error);
      },
    });
  }

  return (
    <Layout
      style={{
        height: '100vh',
      }}
    >
      <HeaderComp />
      <Layout
        style={{
          overflow: 'hidden',
        }}
      >
        <Sider
          style={{
            padding: '8px',
            gap: '18px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Flex vertical justify='flex-start'>
              <UserAvatar />
              <SidebarActionButton
                icon={
                  modeTheme === 'light' ? <MoonOutlined /> : <SunOutlined />
                }
                onClick={toggleTheme}
                fontSize={16}
                text={modeTheme === 'light' ? 'Dark Mode' : 'Light Mode'}
                transition={'transform 0.3s ease-in-out'}
                tooltipTitle={
                  modeTheme === 'light'
                    ? 'Switch to Dark Mode'
                    : 'Switch to Light Mode'
                }
              />
            </Flex>
            <Flex vertical style={{ marginTop: 24 }} align='flex-start'>
              <Text
                type='secondary'
                style={{ fontSize: 12, letterSpacing: 0.5 }}
              >
                WORKSPACE
              </Text>
              <GenericDropdown
                option={project}
                options={projects}
                setSelected={setProject}
                isSelectedLoading={isProjectLoading}
                isProjectInfoView={
                  isProjectInfoView || isUserHomePageView || isUserProfileView
                }
              />
              <GenericDropdown
                option={board}
                options={boards}
                setSelected={setBoard}
                isSelectedLoading={isBoardLoading}
                isProjectInfoView={
                  isProjectInfoView || isUserHomePageView || isUserProfileView
                }
              />
              <SidebarActionButton
                icon={<InfoCircleOutlined />}
                onClick={() =>
                  navigate(`/projects/${projectIdNumber}/overview`)
                }
                fontSize={16}
                text={'Project Info'}
              />
            </Flex>
            <Flex vertical align='flex-end' style={{ marginTop: 'auto' }}>
              <SidebarActionButton
                icon={<HomeOutlined />}
                onClick={() => navigate('/user-homepage')}
                fontSize={16}
                text={'Home'}
              />
              <SidebarActionButton
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                fontSize={16}
                text={'Logout'}
              />
            </Flex>
          </div>
        </Sider>
        <Content>
          <Outlet />
        </Content>
        <ModalLayer />
      </Layout>
    </Layout>
  );
}

export default AppLayout;
