import { Client, Room } from 'colyseus.js';

console.log('🎮 GameClient загружается...');

export class GameClient {
	public room: Room | null = null;

	constructor() {
		this.connect();
	}

	async connect() {
		try {
			console.log('Подключаемся к серверу...');
			const client = new Client('ws://localhost:52');
			this.room = await client.joinOrCreate('my_room');

			console.log('Подключились к комнате!');

			console.log('Готово! Используй send("текст")');
		} catch (error: any) {
			console.log(' Ошибка:', error?.message);
		}
	}
}

new GameClient();
