import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

function BackButton({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <Button
      type='text'
      icon={<ArrowLeftOutlined />}
      onClick={() => {
        navigate(-1);
      }}
      style={{
        fontSize: '20px',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      {children}
    </Button>
  );
}

export default BackButton;
