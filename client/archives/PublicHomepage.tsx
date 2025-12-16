import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

function PublicHomepage() {
  const navigate = useNavigate();

  function toLogin() {
    navigate('/login');
  }
  return (
    <>
      <div>This is my public homepage!</div>
      <Button onClick={toLogin}>Go to Login Page</Button>
    </>
  );
}

export default PublicHomepage;
