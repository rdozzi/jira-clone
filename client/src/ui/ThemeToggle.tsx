import { useTheme } from '../contexts/useTheme';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

function ThemeToggle() {
  const { modeTheme, toggleTheme } = useTheme();

  function handleClick() {
    toggleTheme();
  }

  return (
    <Tooltip
      title={
        modeTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'
      }
    >
      <Button
        type='text'
        icon={modeTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
        onClick={handleClick}
        style={{
          fontSize: '20px',
          transition: 'transform 0.3s ease-in-out',
          transform: modeTheme === 'light' ? 'rotate(0deg)' : 'rotate(180deg)',
        }}
      />
    </Tooltip>
  );
}

export default ThemeToggle;
