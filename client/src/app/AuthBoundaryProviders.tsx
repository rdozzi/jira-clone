import { ReactNode } from 'react';
import { TicketProvider } from '../contexts/TicketProvider';
import { ProjectBoardProvider } from '../contexts/ProjectBoardProvider';
import { UserProvider } from '../contexts/UserProvider';
import { ProjectMemberProvider } from '../contexts/ProjectMemberProvider';
import { ProjectInfoProvider } from '../contexts/ProjectInfoProvider';
import { AttachmentModalProvider } from '../contexts/AttachmentModalProvider';
import { UserHomeTicketProvider } from '../contexts/UserHomeTicketProvider';

import { useAuth } from '../contexts/useAuth';

export function AuthBoundaryProviders({ children }: { children: ReactNode }) {
  const { isAuthenticated, userId, isLoading } = useAuth();

  if (isLoading) return null;

  const userKey = isAuthenticated && userId ? `user-${userId}` : 'guest';

  return (
    <UserProvider key={userKey}>
      <ProjectBoardProvider>
        <TicketProvider>
          <UserHomeTicketProvider>
            <ProjectInfoProvider>
              <ProjectMemberProvider>
                <AttachmentModalProvider>{children}</AttachmentModalProvider>
              </ProjectMemberProvider>
            </ProjectInfoProvider>
          </UserHomeTicketProvider>
        </TicketProvider>
      </ProjectBoardProvider>
    </UserProvider>
  );
}
