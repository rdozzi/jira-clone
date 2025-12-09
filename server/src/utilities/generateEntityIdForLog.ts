import { AttachmentEntityType } from '@prisma/client';

interface LogIdObject {
  commentId: number | null;
  ticketId: number | null;
  boardId: number | null;
  projectId: number | null;
}

export function generateEntityIdForLog(
  entityType: AttachmentEntityType,
  entityId: number
) {
  const logIdObject: LogIdObject = {
    commentId: null,
    ticketId: null,
    boardId: null,
    projectId: null,
  };

  switch (entityType) {
    case 'TICKET':
      logIdObject.ticketId = entityId;
      break;
    case 'COMMENT':
      logIdObject.commentId = entityId;
      break;
    case 'BOARD':
      logIdObject.boardId = entityId;
      break;
    case 'PROJECT':
      logIdObject.projectId = entityId;
      break;
    default:
      // User entity does not apply
      console.error('User or invalid entity');
  }

  return logIdObject;
}
