import { useNavigate } from 'react-router-dom';
import { Flex } from 'antd';
import Loading from './Loading';
import { useGetOrganization } from '../features/organization/useGetOrganization';

function OrganizationHeader() {
  const { isLoading, organization, error } = useGetOrganization();
  const navigate = useNavigate();
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error!</div>;
  }

  function onClick() {
    navigate('/organization-members');
  }

  return (
    <Flex
      style={{
        padding: '20px 0px 20px 0px ',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
      justify='center'
      align='center'
      onClick={onClick}
    >
      {organization?.name}
    </Flex>
  );
}

export default OrganizationHeader;
