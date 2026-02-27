import React, { createContext, useContext, useState } from 'react';

interface DropdownContextType {
  activeDropdown: number | null;
  openDropdown: (_entityId: number) => void;
  closeDropdown: () => void;
  toggleDropdown: (_entityId: number) => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  function openDropdown(entityId: number) {
    setActiveDropdown(entityId);
  }

  function closeDropdown() {
    setActiveDropdown(null);
  }

  function toggleDropdown(entityId: number) {
    setActiveDropdown(entityId === activeDropdown ? null : entityId);
  }

  return (
    <DropdownContext.Provider
      value={{ activeDropdown, openDropdown, closeDropdown, toggleDropdown }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDropdown() {
  if (!useContext(DropdownContext)) {
    throw new Error('useDropdown must be used within a DropdownProvider');
  }
  return (
    useContext(DropdownContext) || {
      activeDropdown: null,
      openDropdown: () => {},
      closeDropdown: () => {},
      toggleDropdown: () => {},
    }
  );
}
