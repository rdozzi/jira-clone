export type ResourceType =
  | 'BannedEmail'
  | 'Board'
  | 'Comment'
  | 'FileStorage'
  | 'Label'
  | 'Project'
  | 'Ticket'
  | 'User';

export type TotalAndMaxColumnType =
  | ['OrganizationBannedEmailsUsage', 'totalBannedEmails', 'maxBannedEmails']
  | ['OrganizationBoardUsage', 'totalBoards', 'maxBoards']
  | ['OrganizationCommentUsage', 'totalComments', 'maxComments']
  | ['OrganizationFileStorageUsage', 'totalFileStorage', 'maxFileStorage']
  | ['OrganizationLabelUsage', 'totalLabels', 'maxLabels']
  | ['OrganizationProjectUsage', 'totalProjects', 'maxProjects']
  | ['OrganizationTicketUsage', 'totalTickets', 'maxTickets']
  | ['OrganizationUserUsage', 'totalUsers', 'maxUsers'];
