import * as ProbingController from '@controllers/probing.conrtoller';
import { Router } from 'express';

const router = Router();

router.get('/ping', ProbingController.ping); // чтобы узнать жив ли сервак

export default router;
