import { AttachmentEntityType } from '@prisma/client';

interface LogIdObject {
  ticketId: number | null;
  boardId: number | null;
  projectId: number | null;
}

export function generateEntityIdForLog(
  entityType: AttachmentEntityType,
  entityId: number
) {
  const logIdObject: LogIdObject = {
    ticketId: null,
    boardId: null,
    projectId: null,
  };

  switch (entityType) {
    case 'TICKET':
      logIdObject.ticketId = entityId;
      break;
    case 'COMMENT':
      logIdObject.ticketId = entityId;
      break;
    case 'BOARD':
      logIdObject.boardId = entityId;
      break;
    case 'PROJECT':
      logIdObject.projectId = entityId;
      break;
    default:
      // No User entity present in multiple uploads
      console.log('User or invalid entity');
  }

  return logIdObject;
}
