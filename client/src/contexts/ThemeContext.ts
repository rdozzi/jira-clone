import { createContext } from 'react';

export interface ThemeContextType {
  modeTheme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);
