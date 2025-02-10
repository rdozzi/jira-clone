import React, { createContext, useContext, useState } from 'react';

interface DropdownContextType {
  activeDropdown: number | null;
  openDropdown: (ticketId: number) => void;
  closeDropdown: () => void;
  toggleDropdown: (ticketId: number) => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  function openDropdown(ticketId: number) {
    setActiveDropdown(ticketId);
  }

  function closeDropdown() {
    setActiveDropdown(null);
  }

  function toggleDropdown(ticketId: number) {
    setActiveDropdown(ticketId === activeDropdown ? null : ticketId);
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
  return useContext(DropdownContext);
}
