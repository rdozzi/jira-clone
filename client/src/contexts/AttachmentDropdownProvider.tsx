import { useState } from 'react';
import { AttachmentDropdownContext } from './AttachmentDropdownContext';

export function AttachmentDropdownProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeAttachmentDropdown, setActiveAttachmentDropdown] = useState<
    number | null
  >(null);

  function openAttachmentDropdown(entityId: number) {
    setActiveAttachmentDropdown(entityId);
  }

  function closeAttachmentDropdown() {
    setActiveAttachmentDropdown(null);
  }

  function toggleAttachmentDropdown(entityId: number) {
    setActiveAttachmentDropdown(
      entityId === activeAttachmentDropdown ? null : entityId
    );
  }

  return (
    <AttachmentDropdownContext.Provider
      value={{
        activeAttachmentDropdown,
        openAttachmentDropdown,
        closeAttachmentDropdown,
        toggleAttachmentDropdown,
      }}
    >
      {children}
    </AttachmentDropdownContext.Provider>
  );
}
