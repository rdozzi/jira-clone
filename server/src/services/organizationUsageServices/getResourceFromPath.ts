import { ResourceType } from '../../types/ResourceType';

interface StringKeyedObject {
  [key: string]: ResourceType;
}

export function getResourceFromPath(pathResource: string) {
  const pathToResource: StringKeyedObject = {
    attachments: 'FileStorage',
    bannedEmails: 'BannedEmail',
    boards: 'Board',
    comments: 'Comment',
    labels: 'Label',
    projects: 'Project',
    tickets: 'Ticket',
    users: 'User',
  };

  return pathToResource[pathResource];
}
