import { Flex } from 'antd';
import Loading from './Loading';
import { useGetOrganization } from '../features/organization/useGetOrganization';

function OrganizationHeader() {
  const { isLoading, organization, error } = useGetOrganization();
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error!</div>;
  }
  return (
    <Flex
      style={{ padding: '20px 0px 20px 0px ', fontWeight: 'bold' }}
      justify='center'
      align='center'
    >
      {organization?.name}
    </Flex>
  );
}

export default OrganizationHeader;
