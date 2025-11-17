import { colyseus } from '@/instances/colyseus.instance';
import type { Server } from '@colyseus/core';
import { BaseGameRoom } from '@rooms/BaseGameRoom';

export const initializeGameServer = (gameServer: Server) => {
	colyseus.gameServer = gameServer;
	colyseus.gameServer.define('baseGameRoom', BaseGameRoom);
};
