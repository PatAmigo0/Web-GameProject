import { authMiddleware } from '@middlewares/auth.middleware';
import authRoutes from '@routes/auth.routes';
import probingRoutes from '@routes/probing.routes';
import roomRoutes from '@routes/protected/room.routes';
import { Router } from 'express';

const router = Router();

router.use('/auth', authRoutes);
router.use('/probing', probingRoutes);

//#region Protected router
const protectedRouter = Router();
protectedRouter.use(authMiddleware);
protectedRouter.use('/rooms', roomRoutes);
//#endregion

router.use('/protected', protectedRouter);

export default router;
