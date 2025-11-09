import { Room, Client } from 'colyseus';
import { Schema, type, MapSchema } from '@colyseus/schema';

class Player extends Schema {
	@type('string') name: string = '';
}

class State extends Schema {
	@type({ map: Player }) players = new MapSchema<Player>();
	@type('string') lastMessage: string = 'Welcome!';
}

export class MyRoom extends Room<State> {
	// Метод для отправки сообщений с сервера
	public sendServerMessage(text: string) {
		console.log(`📤 СЕРВЕР → ВСЕМ: ${text}`);

		this.broadcast('server_message', {
			from: 'SERVER',
			message: text,
			timestamp: Date.now(),
			type: 'system',
		});
	}

	// Метод для отправки конкретному клиенту
	public sendToClient(clientId: string, text: string) {
		const client = this.clients.find((c) => c.sessionId === clientId);
		if (client) {
			console.log(`📤 СЕРВЕР → ${clientId}: ${text}`);

			client.send('private_message', {
				from: 'SERVER',
				message: text,
				timestamp: Date.now(),
				type: 'private',
			});
		}
	}

	onCreate(options: any) {
		console.log('🎮 MyRoom created!');
		this.setState(new State());

		(global as any).broadcast = (text: string) => {
			this.sendServerMessage(text);
		};

		(global as any).sendTo = (clientId: string, text: string) => {
			this.sendToClient(clientId, text);
		};

		(global as any).listPlayers = () => {
			console.log('👥 Игроки в комнате:');
			this.clients.forEach((client: Client) => {
				console.log(`   ${client.sessionId}`);
			});
		};
		this.onMessage('chat', (client, message) => {
			console.log(
				`📩 СЕРВЕР: Сообщение от ${client.sessionId}:`,
				message,
			);

			this.state.lastMessage = `${client.sessionId}: ${message}`;

			this.broadcast('chat', {
				from: client.sessionId,
				message: message,
				timestamp: Date.now(),
			});
		});

		console.log('Обработчик "chat" зарегистрирован!');
	}

	onJoin(client: Client, options: any) {
		console.log(`=== Игрок присоединился: ${client.sessionId}`);
		const player = new Player();
		player.name = options.name || 'Player';
		this.state.players.set(client.sessionId, player);
		console.log(` === Всего игроков: ${this.state.players.size}`);
		this.sendToClient(
			client.sessionId,
			`Добро пожаловать, ${player.name}!`,
		);
	}

	onLeave(client: Client, consented: boolean) {
		console.log(`Игрок вышел: ${client.sessionId}`);
		this.state.players.delete(client.sessionId);
		console.log(`Осталось игроков: ${this.state.players.size}`);

		this.sendServerMessage(`Игрок ${client.sessionId} покинул игру`);
	}
}
