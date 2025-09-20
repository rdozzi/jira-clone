import { ProjectBoardContext } from './ProjectBoardContext';
import { useContext } from 'react';

export function useProjectBoard() {
  const context = useContext(ProjectBoardContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
