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
        type='text'
        onClick={onClick}
        style={{
          width: '100%',
          textAlign: 'left',
          fontSize: `${fontSize}px`,
          transform: transform ?? undefined,
          transition: transition ?? undefined,
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            lineHeight: 1, // ensures perfect centering for any font size
            height: '100%', // prevents drift
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
