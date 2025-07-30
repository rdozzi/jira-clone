import prisma from '../lib/prisma';
import { Request, Response, Router } from 'express';
import { requireGlobalSuperUser } from '../middleware/superUserMiddleware/requireGlobalSuperUser';
import { validateMultipleParamsSuperUser } from '../middleware/validation/validateMultipleParamsSuperUser';
import { getBodySchemaForCreate } from '../middleware/superUserMiddleware/getBodySchemaForCreate';
import { getBodySchemaForUpdate } from '../middleware/superUserMiddleware/getBodySchemaForUpdate';
import {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from '../controllers/superUserFunctionController';
import { validateBodyFromLocals } from '../middleware/validation/validateBodyFromLocals';

const router = Router();

router.use(requireGlobalSuperUser());

//Get
//Organization, Entity, Id
router.get(
  `/function/:resource/:organizationId/:recordId?`,
  validateMultipleParamsSuperUser,
  async (req: Request, res: Response): Promise<void> => {
    await getRecords(req, res, prisma);
  }
);

//Create
//Organization, Entity, Id
router.post(
  `/function/:resource/:organizationId`,
  validateMultipleParamsSuperUser,
  getBodySchemaForCreate,
  validateBodyFromLocals(),
  async (req: Request, res: Response): Promise<void> => {
    await createRecord(req, res, prisma);
  }
);

//Edit
//Organization, Entity, Id
router.patch(
  `/function/:resource/:organizationId/:recordId`,
  validateMultipleParamsSuperUser,
  getBodySchemaForUpdate,
  validateBodyFromLocals(),
  async (req: Request, res: Response): Promise<void> => {
    await updateRecord(req, res, prisma);
  }
);

//Delete
//Organization, Entity, Id
router.delete(
  `/function/:resource/:organizationId/:recordId`,
  validateMultipleParamsSuperUser,
  async (req: Request, res: Response): Promise<void> => {
    await deleteRecord(req, res, prisma);
  }
);
export default router;
