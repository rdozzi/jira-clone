import { createContext } from 'react';

interface AttachmentDropdownType {
  activeAttachmentDropdown: number | null;
  openAttachmentDropdown: (_entityId: number) => void;
  closeAttachmentDropdown: () => void;
  toggleAttachmentDropdown: (_entityId: number) => void;
}

export const AttachmentDropdownContext =
  createContext<AttachmentDropdownType | null>(null);
