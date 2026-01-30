import { ReactNode } from 'react';
import { TicketModalProvider } from '../contexts/modalContexts/TicketModalProvider';
import { ProjectMemberModalProvider } from '../contexts/modalContexts/ProjectMemberModalProvider';
import { ProjectModalProvider } from '../contexts/modalContexts/ProjectModalProvider';
import { BoardModalProvider } from '../contexts/modalContexts/BoardModalProvider';

function ModalProviders({ children }: { children: ReactNode }) {
  return (
    <TicketModalProvider>
      <ProjectMemberModalProvider>
        <ProjectModalProvider>
          <BoardModalProvider>{children}</BoardModalProvider>
        </ProjectModalProvider>
      </ProjectMemberModalProvider>
    </TicketModalProvider>
  );
}

export default ModalProviders;
