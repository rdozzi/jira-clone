import { Result, Typography } from 'antd';
import { PublicBackButton } from '../ui/PublicBackButton';

const { Paragraph } = Typography;

function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAFBFC', // matches your light theme background
        padding: 24,
      }}
    >
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you are looking for does not exist.'
        extra={
          <>
            <Paragraph style={{ color: '#1F2937' }}>
              The link may be broken or the page may have been removed.
            </Paragraph>

            <PublicBackButton variant='primary' />
          </>
        }
      />
    </div>
  );
}

export default NotFound;
