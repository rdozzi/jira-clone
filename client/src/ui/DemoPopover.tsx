import { Popover } from 'antd';
import type { TooltipPlacement } from 'antd/es/tooltip/index';
import { useUser } from '../contexts/useUser';

interface DemoPopoverProps {
  children?: React.ReactElement;
  content: string;
  placement?: TooltipPlacement;
}

export function DemoPopover({
  content,
  placement = 'top',
  children,
}: DemoPopoverProps) {
  const { userSelf } = useUser();

  return userSelf?.isDemoUser ? (
    <Popover content={content} placement={placement}>
      <span>{children}</span>
    </Popover>
  ) : (
    children
  );
}
