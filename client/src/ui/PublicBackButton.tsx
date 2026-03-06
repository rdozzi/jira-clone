import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { LeftSquareOutlined } from '@ant-design/icons';

interface PublicBackButtonProps {
  variant?: 'default' | 'primary';
}

export function PublicBackButton({
  variant = 'default',
}: PublicBackButtonProps) {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '0.5em 0em 0.5em 0em' }}>
      <Button
        type={variant === 'primary' ? 'primary' : 'default'}
        icon={<LeftSquareOutlined />}
        onClick={() => {
          navigate(-1);
        }}
      >
        Go Back
      </Button>
    </div>
  );
}
