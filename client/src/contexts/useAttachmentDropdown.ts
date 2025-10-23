import { useContext } from 'react';
import { AttachmentDropdownContext } from './AttachmentDropdownContext';

export function useAttachmentDropdown() {
  const context = useContext(AttachmentDropdownContext);

  if (!context) {
    throw new Error(
      'useAttachmentDropdown must be used within a ThemeProvider'
    );
  }

  return context;
}
