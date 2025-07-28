import { Router } from 'express';
import { requireGlobalSuperUser } from '../middleware/superUserMiddleware/requireGlobalSuperUser';

const router = Router();

router.use(requireGlobalSuperUser());

export default router;
