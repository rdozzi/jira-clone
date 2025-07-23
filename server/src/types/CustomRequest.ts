import { Request } from 'express';
import { CustomFile } from './CustomFile';
import {
  Attachment,
  GlobalRole,
  OrganizationRole,
  ProjectRole,
} from '@prisma/client';

export interface CustomRequest extends Request {
  attachment?: CustomFile | Attachment;
  filepath?: CustomFile;
  file?: CustomFile;
  files?: CustomFile[];

  user?: {
    id: number;
    organizationRole: OrganizationRole;
    globalRole: GlobalRole;
    organizationId: number;
  };

  userProjects?: {
    projectId: number;
    projectRole: ProjectRole;
  }[];
}
