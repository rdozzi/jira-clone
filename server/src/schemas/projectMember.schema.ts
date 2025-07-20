import { z } from 'zod';
import { projectRoleSchema } from './base.schema';

export const projectMemberUpdateSchema = z
  .object({
    projectRole: projectRoleSchema,
  })
  .strict();
