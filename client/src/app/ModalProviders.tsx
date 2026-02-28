import { ReactNode } from 'react';
import { TicketModalProvider } from '../contexts/modalContexts/TicketModalProvider';
import { ProjectMemberModalProvider } from '../contexts/modalContexts/ProjectMemberModalProvider';
import { ProjectModalProvider } from '../contexts/modalContexts/ProjectModalProvider';
import { BoardModalProvider } from '../contexts/modalContexts/BoardModalProvider';
import { OrganizationUserModalProvider } from '../contexts/modalContexts/OrganizationUserModalProvider';

function ModalProviders({ children }: { children: ReactNode }) {
  return (
    <TicketModalProvider>
      <ProjectMemberModalProvider>
        <ProjectModalProvider>
          <BoardModalProvider>
            <OrganizationUserModalProvider>
              {children}
            </OrganizationUserModalProvider>
          </BoardModalProvider>
        </ProjectModalProvider>
      </ProjectMemberModalProvider>
    </TicketModalProvider>
  );
}

export default ModalProviders;
