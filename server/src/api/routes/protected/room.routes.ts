import * as RoomsController from '@controllers/rooms.controller';
import { roomCreateSchema } from '@game/shared';
import { validate } from '@middlewares/validate.middleware';
import { Router } from 'express';

const router = Router();

router.get('/list', RoomsController.listRooms);
router.get('/join/:code', RoomsController.joinRoom);
router.post('/create', validate(roomCreateSchema), RoomsController.createRoom);

export default router;
