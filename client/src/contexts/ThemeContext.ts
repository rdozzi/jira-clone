import { createContext } from 'react';

export type Mode = 'light' | 'dark';

export interface ThemeContextType {
  modeTheme: Mode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
