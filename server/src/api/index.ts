import authRoutes from '@routes/auth.routes';
import { Router } from 'express';

const router = Router();

router.use('/auth', authRoutes);

export default router;
