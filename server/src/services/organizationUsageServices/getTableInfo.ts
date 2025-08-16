import { ResourceType } from '../../types/ResourceAndColumnTypes';

interface StringKeyedObject {
  [key: string]: { table: string; total: string; max: string };
}

export function getTableInfo(resourceType: ResourceType) {
  const resourceToColumn: StringKeyedObject = {
    BannedEmail: {
      table: 'OrganizationBannedEmailsUsage',
      total: 'totalBannedEmails',
      max: 'maxBannedEmails',
    },
    Board: {
      table: 'OrganizationBoardUsage',
      total: 'totalBoards',
      max: 'maxBoards',
    },
    Comment: {
      table: 'OrganizationCommentUsage',
      total: 'totalComments',
      max: 'maxComments',
    },
    FileStorage: {
      table: 'OrganizationFileStorageUsage',
      total: 'totalFileStorage',
      max: 'maxFileStorage',
    },
    Label: {
      table: 'OrganizationLabelUsage',
      total: 'totalLabels',
      max: 'maxLabels',
    },
    Project: {
      table: 'OrganizationProjectUsage',
      total: 'totalProjects',
      max: 'maxProjects',
    },
    Ticket: {
      table: 'OrganizationTicketUsage',
      total: 'totalTickets',
      max: 'maxTickets',
    },
    User: {
      table: 'OrganizationUserUsage',
      total: 'totalUsers',
      max: 'maxUsers',
    },
  };

  return resourceToColumn[resourceType];
}
