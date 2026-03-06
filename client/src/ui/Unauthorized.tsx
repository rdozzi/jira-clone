import { Card, Typography, Space } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { PublicBackButton } from './PublicBackButton';

const { Title, Text } = Typography;

function Unauthorized() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
      }}
    >
      <Card
        style={{
          width: 420,
          textAlign: 'center',
          borderRadius: 8,
        }}
      >
        <Space direction='vertical' size='large'>
          <StopOutlined style={{ fontSize: 48, color: '#D7133E' }} />

          <Title level={2} style={{ margin: 0 }}>
            403 – Unauthorized
          </Title>

          <Text type='secondary'>
            You do not have permission to access this resource.
          </Text>

          <PublicBackButton />
        </Space>
      </Card>
    </div>
  );
}

export default Unauthorized;
