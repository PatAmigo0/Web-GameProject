import { LobbyRoom, type Server } from '@colyseus/core';
import { RoomTypes } from '@game/shared';
import { colyseus } from '@instances/colyseus.instance';
import { BaseGameRoom } from '@rooms/BaseGameRoom';

export const initializeGameServer = (gameServer: Server) => {
	colyseus.gameServer = gameServer;
	colyseus.gameServer.define(RoomTypes.LobbyRoom, LobbyRoom);
	colyseus.gameServer.define(RoomTypes.BaseGameRoom, BaseGameRoom).enableRealtimeListing();
};
