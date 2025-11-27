import { db } from '@/instances/db.instance';
import { Room, type Client } from '@colyseus/core';
import type { JwtAuthPayload } from '@game/shared';
import { BaseGameRoomState, Player } from '@game/shared';
import { ServerError } from 'colyseus.js';
import jwt from 'jsonwebtoken';

type RoomConfig = { name: string; maxClients: number; isPrivate: boolean };

export class BaseGameRoom extends Room<BaseGameRoomState> {
	maxClients = 4;
	autoDispose = true;
	state = new BaseGameRoomState();

	public async onAuth(client: Client, options: any, request: any) {
		if (!options.accessToken) {
			throw new ServerError(401, 'Token missing');
		}

		try {
			const payload = jwt.verify(options.accessToken, process.env.JWT_SECRET as string);
			return payload;
		} catch (e) {
			throw new ServerError(401, 'Invalid token');
		}
	}

	public onCreate(options: RoomConfig) {
		this.initRoom(options);
		this.listenMessages();

		this.clock.setTimeout(() => {
			if (this.clients.length === 0) {
				this.disconnect();
			}
		}, 10000);
	}

	public async onJoin(client: Client, options: any) {
		await this.setupPresence(client);
		const user = client.auth as JwtAuthPayload;

		const player = new Player();
		player.id = user.uuid || client.sessionId;
		player.username = user.username || 'Guest';
		player.x = 200;
		player.y = 200;

		this.state.players.set(client.sessionId, player);
	}

	public async onLeave(client: Client, consented: boolean) {
		await this.disposePresence(client.auth.uuid);
		this.state.players.delete(client.sessionId);
	}

	public async onDispose() {
		await db.core?.prisma.roomCodes.delete({
			where: { longRoomId: this.roomId },
		});
	}

	private initRoom(options: RoomConfig) {
		this.maxClients = options.maxClients;
		this.setPrivate(options.isPrivate);
		this.setMetadata({ roomName: options.name });
	}

	private listenMessages() {
		this.onMessage('move', (client, data) => {
			const player = this.state.players.get(client.sessionId);
			if (player) {
				player.x = data.x;
				player.y = data.y;
			}
		});
	}

	private async setupPresence(client: Client) {
		const userId = (client.auth as JwtAuthPayload).uuid;
		await this.presence.subscribe(`disconnect_user:${userId}`, (payload: any) => {
			if (client.sessionId !== payload.newSessionId) {
				client.send('error', { message: 'Вы зашли с другого устройства' });
				client.leave();
			}
		});

		await this.presence.publish(`disconnect_user:${userId}`, {
			newSessionId: client.sessionId,
		});
	}

	private async disposePresence(userId: string) {
		try {
			await this.presence.unsubscribe(`disconnect_user:${userId}`);
		} catch (e) {}
	}
}
