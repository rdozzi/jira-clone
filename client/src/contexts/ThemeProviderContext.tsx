import { useEffect, ReactNode } from 'react';
import { lightTheme, darkTheme } from '../styles/themeConfig';

import useLocalStorageState from '../hooks/useLocalStorageState';
import { ThemeContext } from './ThemeContext';
import ConfigProviderComponent from '../styles/ConfigProviderComponent';

export function ThemeProviderContext({ children }: { children: ReactNode }) {
  const [modeTheme, setModeTheme] = useLocalStorageState('theme');

  // Update root html tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', modeTheme);
  }, [modeTheme]);

  const toggleTheme = () =>
    setModeTheme(modeTheme === 'light' ? 'dark' : 'light');

  const themeTokens = modeTheme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ modeTheme, toggleTheme }}>
      <ConfigProviderComponent
        themeTokens={themeTokens}
        lightTheme={lightTheme}
        darkTheme={darkTheme}
        modeTheme={modeTheme}
      >
        {children}
      </ConfigProviderComponent>
    </ThemeContext.Provider>
  );
}
