import { initializeGameServer } from '@app/colyseus.setup';
import { initializeExpress } from '@app/express.setup';
import { beforeListen } from '@app/hooks';
import config from '@colyseus/tools';

import { RedisDriver } from '@colyseus/redis-driver';
import { WebSocketTransport } from '@colyseus/ws-transport';

// alias -> app
export default config({
	options: {
		driver: new RedisDriver(),
	},

	initializeTransport: (options) => {
		return new WebSocketTransport(options);
	},

	initializeGameServer: initializeGameServer,
	initializeExpress: initializeExpress,
	beforeListen: beforeListen,
});
