import { ActivityLogs } from '../types/ActivityLogs';
import { trimAttachmentName } from './trimAttachmentName';
import dayjs from 'dayjs';

export function mapActivityToMessage(log: ActivityLogs) {
  const { action, targetType, metadata, createdAt } = log;

  const time = dayjs(createdAt).format('MMM DD, YYYY h:mm A');

  switch (action) {
    // User actions
    case 'CREATE_USER':
      return { message: 'New user created', time };
    case 'UPDATE_USER':
      return { message: 'Updated user profile', time };
    case 'DELETE_USER':
      return { message: 'User account deleted', time };
    case 'BAN_USER_EMAIL':
      return { message: 'Banned user email address', time };
    case 'DELETE_BANNED_EMAIL':
      return { message: 'Removed banned email address', time };

    // Project actions
    case 'CREATE_PROJECT':
      return {
        message: `Created project "${metadata?.projectName ?? ''}"`,
        time,
      };
    case 'UPDATE_PROJECT':
      return {
        message: `Updated project`, // Requires join with projects table
        time,
      };
    case 'DELETE_PROJECT':
      return {
        message: `Deleted project "${metadata?.name ?? ''}"`,
        time,
      };

    // Project member actions
    case 'ADD_PROJECT_MEMBER':
      return {
        message: `Added member ${
          metadata?.firstName_lastName ?? ''
        } to project`,
        time,
      };
    case 'REMOVE_PROJECT_MEMBER':
      return {
        message: `Removed member ${
          metadata?.firstName_lastName ?? ''
        } from project`,
        time,
      };
    case 'UPDATE_PROJECT_MEMBER_ROLE':
      return {
        message: `Changed member role`, // Need to add logic to ProjectMember
        time,
      };

    // Board actions
    case 'CREATE_BOARD':
      return {
        message: `Created board "${metadata?.name ?? ''}"`,
        time,
      };
    case 'UPDATE_BOARD':
      return {
        message: `Updated board "${metadata?.name ?? ''}"`,
        time,
      };
    case 'DELETE_BOARD':
      return {
        message: `Deleted board "${metadata?.name ?? ''}"`,
        time,
      };

    // Ticket actions
    case 'CREATE_TICKET':
      return {
        message: `Created ticket "${metadata?.title ?? ''}"`,
        time,
      };
    case 'UPDATE_TICKET':
      return {
        message: `Updated ticket "${metadata?.title ?? ''}"`,
        time,
      };
    case 'DELETE_TICKET':
      return {
        message: `Deleted ticket "${metadata?.title ?? ''}"`,
        time,
      };

    // Comment actions
    case 'CREATE_COMMENT':
      return { message: `Added a comment`, time };
    case 'UPDATE_COMMENT':
      return { message: `Edited a comment`, time };
    case 'DELETE_COMMENT':
      return { message: `Deleted a comment`, time };

    // Label actions
    case 'CREATE_LABEL':
      return {
        message: `Created label "${metadata?.name ?? ''}"`,
        time,
      };
    case 'UPDATE_LABEL':
      return {
        message: `Updated label`, // No join to label table
        time,
      };
    case 'DELETE_LABEL':
      return {
        message: `Deleted label "${metadata?.name ?? ''}"`,
        time,
      };

    // Attachment actions
    case 'CREATE_ATTACHMENT':
      return {
        message: `Uploaded file "${
          trimAttachmentName(metadata?.filename) ?? 'NA'
        }"`,
        time,
      };

    case 'DOWNLOAD_ATTACHMENT':
      return {
        message: `Downloaded file "${
          trimAttachmentName(metadata?.filename) ?? 'NA'
        }"`,
        time,
      };

    case 'DELETE_ATTACHMENT':
      return {
        message: `Deleted file "${
          trimAttachmentName(metadata?.filename) ?? 'NA'
        }"`,
        time,
      };

    default:
      return { message: `${action} ${targetType ?? ''}`.trim(), time };
  }

  // BAN_USER_EMAIL
  // DELETE_BANNED_EMAIL
  // CREATE_BOARD
  // UPDATE_BOARD
  // DELETE_BOARD
  // CREATE_COMMENT
  // DELETE_COMMENT
  // UPDATE_COMMENT
  // CREATE_LABEL
  // UPDATE_LABEL
  // DELETE_LABEL
  // CREATE_PROJECT
  // UPDATE_PROJECT
  // DELETE_PROJECT
  // ADD_PROJECT_MEMBER
  // REMOVE_PROJECT_MEMBER
  // UPDATE_PROJECT_MEMBER_ROLE
  // CREATE_TICKET
  // DELETE_TICKET
  // UPDATE_TICKET
  // CREATE_USER
  // UPDATE_USER
  // DELETE_USER
}
