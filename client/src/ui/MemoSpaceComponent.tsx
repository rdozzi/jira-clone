import React from 'react';
import { Space } from 'antd';
import { memo } from 'react';

interface MemoSpaceComponentProps {
  children: React.ReactNode;
}

const MemoSpaceComponent = memo(function MemoSpaceComponent({
  children,
}: MemoSpaceComponentProps) {
  return (
    <Space direction='vertical' size='small' style={{ display: 'flex' }}>
      {children}
    </Space>
  );
});

export default MemoSpaceComponent;
