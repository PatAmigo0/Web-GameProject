import config from '@colyseus/tools';
import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';
import { MyRoom } from './rooms/MyRoom';

export default config({
	initializeGameServer: (gameServer) => {
		console.log('Registering rooms...');
		gameServer.define('my_room', MyRoom);
		console.log('Room "my_room" registered');
	},

	initializeExpress: (app) => {
		app.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
			res.header('Access-Control-Allow-Headers', 'Content-Type');
			if (req.method === 'OPTIONS') return res.status(200).end();
			next();
		});

		app.get('/health', (req, res) => {
			res.json({ status: 'ok', message: 'Server is running' });
		});

		if (process.env.NODE_ENV !== 'production') {
			app.use('/', playground());
		}

		app.use('/monitor', monitor());
	},

	beforeListen: () => {
		console.log(' Server configuration complete');
	},
});
