import config from '@colyseus/tools';
import { beforeListen } from '@config/beforelisten.config';
import { initializeExpress } from '@config/express.config';
import { initializeGameServer } from '@config/gameserver.config';

// alias -> app
export default config({
	initializeGameServer: initializeGameServer,
	initializeExpress: initializeExpress,
	beforeListen: beforeListen,
});
