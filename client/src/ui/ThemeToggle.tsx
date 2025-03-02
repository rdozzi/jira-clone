import { useTheme } from '../contexts/useTheme';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  function handleClick() {
    toggleTheme();
  }

  return (
    <Tooltip
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      <Button
        type='text'
        icon={theme === 'light' ? <SunOutlined /> : <MoonOutlined />}
        onClick={handleClick}
        style={{
          fontSize: '20px',
          transition: 'transform 0.3s ease-in-out',
          transform: theme === 'light' ? 'rotate(0deg)' : 'rotate(180deg)',
        }}
      />
    </Tooltip>
  );
}

export default ThemeToggle;
