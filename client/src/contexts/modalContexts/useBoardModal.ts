import { useContext } from 'react';
import { BoardModalContext } from './BoardModalContext';

export function useBoardModal() {
  const context = useContext(BoardModalContext);

  if (!context) {
    throw new Error('useBoardModal must be used within a BoardModalProvider');
  }
  return context;
}
