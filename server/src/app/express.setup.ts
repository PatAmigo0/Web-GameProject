import apiRoutes from '@apiroutes';
import { monitor } from '@colyseus/monitor';
import { apiLimiter } from '@middlewares/api.middleware';
import { corsMiddleware } from '@middlewares/cors.middleware';
import { errorHandler } from '@middlewares/error.middleware';
import { helmetMiddleware } from '@middlewares/helmet.middleware';
import { monitorMiddleware } from '@middlewares/monitor.middleware';
import { staticMiddleware } from '@middlewares/static.middleware';
import express from 'express';

export const initializeExpress = (app: express.Express) => {
	app.set('trust proxy', 1);

	app.use(helmetMiddleware);
	app.use(corsMiddleware);

	app.use('/api', [apiLimiter, express.json({ limit: '10kb' }), apiRoutes]);
	app.use('/monitor', monitorMiddleware, monitor());
	app.use('/', staticMiddleware);
	app.use(errorHandler);
};
