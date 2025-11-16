import * as AuthController from '@controllers/auth.controller';
import { Router } from 'express';

const router = Router();

router.post('/test', AuthController.test);

export default router;
