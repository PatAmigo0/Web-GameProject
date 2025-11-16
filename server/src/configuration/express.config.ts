import apiRoutes from '@apiroutes';
import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

export const initializeExpress = (app: express.Express) => {
	app.get('/hello_world', (req, res) => {
		res.send("It's time to kick ass and chew bubblegum!");
	});

	app.use(
		cors({
			origin: ['http://localhost:666', 'http://localhost:5173', 'http://127.0.0.1:5173'],
		}),
	);

	app.use('/api', apiRoutes);

	/**
	 * Use @colyseus/playground
	 * (It is not recommended to expose this route in a production environment)
	 */
	if (process.env.NODE_ENV !== 'production') {
		console.log(`using playground cuz ${process.env.NODE_ENV}`);
		app.use('/', playground());
	} else {
		console.log('using production static build');
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const clientBuildPath = path.join(__dirname, '..', '..', 'client', 'dist');
		app.use(express.static(clientBuildPath));
	}

	/**
	 * Use @colyseus/monitor
	 * It is recommended to protect this route with a password
	 * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
	 */
	app.use('/monitor', monitor());
};
