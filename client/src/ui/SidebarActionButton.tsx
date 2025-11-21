import { ReactNode } from 'react';
import { Button, Tooltip } from 'antd';

interface SidebarActionButtonProps {
  children: ReactNode;
  icon: ReactNode; // AntD component
  onClick: () => void;
  fontSize: number; // integrated as pixels 'px' for MVP
  text: string;
  tooltipTitle?: string;
  transform?: string;
  transition?: string;
}

function SidebarActionButton({
  icon,
  onClick,
  fontSize,
  text,
  tooltipTitle,
  transform,
  transition,
}: SidebarActionButtonProps) {
  return (
    <Tooltip title={tooltipTitle}>
      <Button
        block
        type='text'
        onClick={onClick}
        icon={icon}
        iconPosition='start'
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          textAlign: 'left',
          lineHeight: 1,
          fontSize: `${fontSize}px`,
          padding: '6px 4px',
          transform: transform ?? undefined,
          transition: transition ?? undefined,
        }}
      >
        {text}
      </Button>
    </Tooltip>
  );
}

export default SidebarActionButton;
