import { db } from '@/instances/db.instance';
import { Room, type Client } from '@colyseus/core';
import { BaseGameRoomState } from '@schema/BaseGameRoomState';

export class BaseGameRoom extends Room<BaseGameRoomState> {
	maxClients = 10;
	state = new BaseGameRoomState();

	public shortCode!: string;

	static async onAuth() {
		console.log('Проверка аутентификации...');
		return true;
	}

	public onCreate(options: any) {
		this.autoDispose = true;

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

	async onDispose() {
		console.log('room', this.roomId, 'disposing...');
		await db.core?.prisma.roomCodes.delete({
			where: { longRoomId: this.roomId, shortRoomId: this.shortCode },
		});

		console.log('Успешно удалил запись о комнате из дб');
	}
}
