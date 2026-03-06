import { useNavigate } from 'react-router-dom';
import { Button, Popover } from 'antd';
import { LeftSquareOutlined } from '@ant-design/icons';

function BackButton({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '0.5em 0em 0.5em 0em' }}>
      <Popover placement='right' content={'Go back'}>
        <Button
          icon={<LeftSquareOutlined />}
          size='large'
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
    </div>
  );
}

export default BackButton;
