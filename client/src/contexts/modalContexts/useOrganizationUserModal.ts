import { useContext } from 'react';
import { OrganizationUseModalContext } from './OrganizationUserModalContext';

export function useOrganizationUserModal() {
  const context = useContext(OrganizationUseModalContext);

  if (!context) {
    throw new Error(
      'useOrganizationUserModal must be used within a ProjectModalProvider',
    );
  }
  return context;
}
