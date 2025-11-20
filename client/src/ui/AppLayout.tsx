import { ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Tooltip } from 'antd';
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
        <div>
          <UserAvatar />
        </div>
        <div>
          <Tooltip
            title={
              modeTheme === 'light'
                ? 'Switch to Dark Mode'
                : 'Switch to Light Mode'
            }
          >
            <SidebarActionButton
              children={children}
              icon={modeTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
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
          </Tooltip>
        </div>
        <div>
          <SidebarActionButton
            children={children}
            icon={<HomeOutlined />}
            onClick={() => navigate('/user-homepage')}
            fontSize={16}
            text={'Home'}
          />
        </div>
        <div>
          <SidebarActionButton
            children={children}
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            fontSize={16}
            text={'Logout'}
          />
        </div>
        <div>
          <GenericDropdown
            option={project}
            options={projects}
            setSelected={setProject}
            isSelectedLoading={isProjectLoading}
            isProjectInfoView={isProjectInfoView}
          />
        </div>
        <div>
          <GenericDropdown
            option={board}
            options={boards}
            setSelected={setBoard}
            isSelectedLoading={isBoardLoading}
            isProjectInfoView={isProjectInfoView}
          />
        </div>
        <div>
          <SidebarActionButton
            children={children}
            icon={<InfoCircleOutlined />}
            onClick={() => navigate(`/projects/${projectIdNumber}/overview`)}
            fontSize={16}
            text={'Project Info'}
          />
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
