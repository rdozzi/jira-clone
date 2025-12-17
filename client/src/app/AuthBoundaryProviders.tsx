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

  const userKey = isAuthenticated ? `user-${userId}` : 'guest';

  console.log(userKey);

  return (
    <UserProvider key={userKey}>
      <ProjectBoardProvider key={userKey}>
        <TicketProvider key={userKey}>
          <UserHomeTicketProvider key={userKey}>
            <ProjectInfoProvider key={userKey}>
              <ProjectMemberProvider key={userKey}>
                <AttachmentModalProvider key={userKey}>
                  {children}
                </AttachmentModalProvider>
              </ProjectMemberProvider>
            </ProjectInfoProvider>
          </UserHomeTicketProvider>
        </TicketProvider>
      </ProjectBoardProvider>
    </UserProvider>
  );
}
