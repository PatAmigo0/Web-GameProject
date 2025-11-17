import { Room, type Client } from '@colyseus/core';
import { prisma } from '@database/database';
import { BaseGameRoomState } from '@schema/BaseGameRoomState';

export class BaseGameRoom extends Room<BaseGameRoomState> {
	maxClients = 10;
	state = new BaseGameRoomState();

	public shortCode!: string;

	static async onAuth() {
		console.log('Проверка аутентификации...');
		return true;
	}

	onCreate(options: any) {
		if (options.shortCode) {
			this.shortCode = options.shortCode as string;
		}

		this.onMessage('type', (client, message) => {
			//
			// handle "type" message
			//
		});
	}

	onJoin(client: Client, options: any) {
		console.log(client.sessionId, 'joined!');
	}

	onLeave(client: Client, consented: boolean) {
		console.log(client.sessionId, 'left!');
	}

	onDispose() {
		console.log('room', this.roomId, 'disposing...');
		prisma.roomCodes
			.delete({
				where: { longRoomId: this.roomId, shortRoomId: this.shortCode },
			})
			.then(() => {
				console.log('Успешно удалил запись о комнате из дб');
			})
			.catch((e) => {
				console.log(`Не удалось очистить комнату в бд: ${e}`);
			});
	}
}
