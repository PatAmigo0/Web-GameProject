import * as RoomsController from '@controllers/rooms.controller';
import { Router } from 'express';

const router = Router();

router.get('/join/:code', RoomsController.joinRoom);
router.post('/create', RoomsController.createRoom);

export default router;
