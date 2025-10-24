import { useContext } from 'react';
import { AttachmentModalContext } from './AttachmentModalContext';

export function useAttachmentModal() {
  const context = useContext(AttachmentModalContext);

  if (!context) {
    throw new Error('useAttachmentModal must be used within a ThemeProvider');
  }

  return context;
}
