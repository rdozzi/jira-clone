import { ResourceType, ColumnType } from '../../types/ResourceAndColumnTypes';

interface StringKeyedObject {
  [key: string]: ColumnType;
}

export function getColumnfromResource(resourceType: ResourceType) {
  const resourceToColumn: StringKeyedObject = {
    BannedEmail: 'totalBannedEmails',
    Board: 'totalBoards',
    Comment: 'totalComments',
    FileStorage: 'totalFileStorage',
    Label: 'totalLabels',
    Project: 'totalProjects',
    Ticket: 'totalTickets',
    User: 'totalUsers',
  };

  return resourceToColumn[resourceType];
}
