import { Request } from 'express';
import { CustomFile } from './CustomFile';
import { Attachment, GlobalRole, ProjectRole } from '@prisma/client';

export interface CustomRequest extends Request {
  attachment?: CustomFile | Attachment;
  filepath?: CustomFile;
  file?: CustomFile;
  files?: CustomFile[];

  user?: {
    id: number;
    globalRole: GlobalRole;
  };

  userProjects?: {
    projectId: number;
    projectRole: ProjectRole;
  }[];
}
