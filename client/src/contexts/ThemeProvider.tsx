import { useEffect, useState, ReactNode } from 'react';
import { Mode } from './ThemeContext';

import { ThemeContext } from './ThemeContext';
import ConfigProviderComponent from '../styles/ConfigProviderComponent';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [modeTheme, setModeTheme] = useState<Mode>('light');

  // Load saved theme on mount
  useEffect(() => {
    const stored = localStorage.getItem('themeMode');
    if (stored === 'light' || stored === 'dark') {
      setModeTheme(stored);
    }
  }, []);

  // Save theme on change
  useEffect(() => {
    localStorage.setItem('themeMode', modeTheme);
  }, [modeTheme]);

  const toggleTheme = () =>
    setModeTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ modeTheme, toggleTheme }}>
      <ConfigProviderComponent modeTheme={modeTheme}>
        {children}
      </ConfigProviderComponent>
    </ThemeContext.Provider>
  );
}
