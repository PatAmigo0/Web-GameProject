import { colyseus } from '@/instances/colyseus.instance';
import type { Server } from '@colyseus/core';
import { BaseGameRoom } from '@rooms/BaseGameRoom';

// 1. Сигнатура изменена: (gameServer: Server) => void
// 'listen' передаст сюда уже созданный сервер.
export const initializeGameServer = (gameServer: Server) => {
	colyseus.gameServer = gameServer;
	colyseus.gameServer.define('baseGameRoom', BaseGameRoom);
	console.log(colyseus.gameServer);
};
