import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

function UserHomeButton() {
  const navigate = useNavigate();
  return (
    <Button
      type='text'
      icon={<HomeOutlined />}
      onClick={() => navigate('/user-homepage')}
    />
  );
}

export default UserHomeButton;
