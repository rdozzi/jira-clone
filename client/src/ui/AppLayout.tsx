import { ReactNode } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { useLogout } from '../features/auth/useLogout';
import { useProjectInfo } from '../contexts/useProjectInfo';
import { useTheme } from '../contexts/useTheme';
import GenericDropdown from './GenericDropdown';

const { Text } = Typography;

const { Sider, Content } = Layout;

type StyleObject = React.CSSProperties;

const siderStyle: StyleObject = { backgroundColor: 'aqua', height: '100vh' };

function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { logout: frontendLogout } = useAuth();
  const { mutate: logoutMutation } = useLogout();
  const { projectIdNumber } = useProjectInfo();
  const { modeTheme, toggleTheme } = useTheme();
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

  const isProjectInfoView = /^\/projects\//.test(location.pathname);
  const navigate = useNavigate();

  function handleLogout() {
    console.log('Logging out...');

    logoutMutation(undefined, {
      onSuccess: () => {
        console.log('Logout successful');
        frontendLogout();
      },
      onError: (error) => {
        console.error('Logout failed:', error);
      },
    });
  }

  return (
    <Layout>
      <Sider style={siderStyle}>
        <div
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
          >
            <Flex vertical justify='flex-start'>
              <UserAvatar />
              {/*Light/Dark mode component*/}
              <SidebarActionButton
                children={children}
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
                isProjectInfoView={isProjectInfoView}
              />
              <GenericDropdown
                option={board}
                options={boards}
                setSelected={setBoard}
                isSelectedLoading={isBoardLoading}
                isProjectInfoView={isProjectInfoView}
              />
              <SidebarActionButton
                children={children}
                icon={<InfoCircleOutlined />}
                onClick={() =>
                  navigate(`/projects/${projectIdNumber}/overview`)
                }
                fontSize={16}
                text={'Project Info'}
              />
            </Flex>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <Flex vertical align='flex-start'>
              <SidebarActionButton
                children={children}
                icon={<HomeOutlined />}
                onClick={() => navigate('/user-homepage')}
                fontSize={16}
                text={'Home'}
              />
              <SidebarActionButton
                children={children}
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                fontSize={16}
                text={'Logout'}
              />
            </Flex>
          </div>
        </div>
      </Sider>
      <Layout>
        <HeaderComp />
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
