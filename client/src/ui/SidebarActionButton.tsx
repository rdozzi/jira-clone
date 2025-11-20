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
  children,
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
        style={{
          width: '100%',
          textAlign: 'left',
          fontSize: `${fontSize}px`,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 2px',
          transform: transform ?? undefined,
          transition: transition ?? undefined,
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            lineHeight: 1,
            height: '100%',
          }}
        >
          {icon}
          <span style={{ fontSize: `${fontSize}px` }}>
            {children ?? `${text}`}
          </span>
        </span>
      </Button>
    </Tooltip>
  );
}

export default SidebarActionButton;
