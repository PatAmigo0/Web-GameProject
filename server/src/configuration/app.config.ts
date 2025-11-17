import config from '@colyseus/tools';
import { beforeListen } from '@config/beforelisten.config';
import { initializeExpress } from '@config/express.config';
import { initializeGameServer } from '@config/gameserver.config';

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
