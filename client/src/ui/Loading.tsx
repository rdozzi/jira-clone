import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

function Loading() {
  return (
    <Spin
      indicator={<LoadingOutlined style={{ fontSize: 64 }} spin />}
      fullscreen={true}
    />
  );
}

export default Loading;
