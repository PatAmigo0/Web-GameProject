import { initializeGameServer } from '@app/colyseus.setup';
import { initializeExpress } from '@app/express.setup';
import { initializeTransport } from '@app/transport.setup';
import { beforeListen } from '@app/hooks';
import config from '@colyseus/tools';

import { RedisDriver } from '@colyseus/redis-driver';

// alias -> app
export default config({
	options: {
		driver: new RedisDriver({
			host: process.env.REDIS_HOST || 'localhost',
			port: 6379,
		}),
	},

	initializeTransport: initializeTransport,
	initializeGameServer: initializeGameServer,
	initializeExpress: initializeExpress,
	beforeListen: beforeListen,
});
