import { useNavigate } from 'react-router-dom';
import { Button, Popover } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

function BackButton({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <Popover placement='right' content={'Go back'}>
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
    </Popover>
  );
}

export default BackButton;
