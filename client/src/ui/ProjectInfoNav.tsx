import { Layout, Flex } from 'antd';
import { NavLink, useParams } from 'react-router-dom';

const { Footer } = Layout;

function ProjectInfoNav() {
  const { projectId } = useParams();
  return (
    <>
      <Layout>
        <Footer style={{ padding: '10px 8px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: '20px',
            }}
          >
            <NavLink to={`/projects/${projectId}/overview`}>
              Project Info
            </NavLink>
            <NavLink to={`/projects/${projectId}/boards`}>
              Project Boards
            </NavLink>
            <NavLink to={`/projects/${projectId}/members`}>
              Project Members
            </NavLink>
          </div>
        </Footer>
      </Layout>
    </>
  );
}

export default ProjectInfoNav;
