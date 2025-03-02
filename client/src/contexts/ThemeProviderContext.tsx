import { useEffect, ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { lightTheme, darkTheme } from '../styles/themeConfig';

import useLocalStorageState from '../hooks/useLocalStorageState';
import { ThemeContext } from './ThemeContext';

export function ThemeProviderContext({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorageState('theme');

  // Update root html tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const themeTokens = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider
        theme={{
          token: { ...themeTokens },
          components: {
            Tabs: {
              itemColor:
                theme === 'light' ? lightTheme.colorText : darkTheme.colorText,
              inkBarColor:
                theme === 'light'
                  ? lightTheme.colorPrimary
                  : darkTheme.colorPrimary,
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
