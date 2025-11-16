import type { Server } from '@colyseus/core';
import { MyRoom } from '@rooms/MyRoom';

export const initializeGameServer = (gameServer: Server) => {
	gameServer.define('my_room', MyRoom);
};
