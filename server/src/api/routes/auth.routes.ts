import * as AuthController from '@controllers/auth.controller';
import { loginSchema, registerSchema } from '@game/shared';
import { validate } from '@middlewares/validate.middleware';
import { Router } from 'express';

const router = Router();

router.post('/registration', validate(registerSchema), AuthController.registration);
router.post('/login', validate(loginSchema), AuthController.login);

export default router;
