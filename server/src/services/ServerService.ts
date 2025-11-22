import app from '@/app/app.enty';
import { db } from '@/instances/db.instance';
import { Server } from '@colyseus/core';
import { listen } from '@colyseus/tools';
import { DatabasePostgreSQL } from '@database/database';
import { HOST_PORT } from '@game/shared';
import { loadenv } from '@utils/loadenv.util';

export class ServerService {
	private initalized = false;
	public gameServer!: Server;
	public db!: DatabasePostgreSQL;

	public async start() {
		if (this.initalized) {
			throw new Error('Попытка запуска уже включенного сервера');
		}
		this.init();
		this.gameServer = await listen(app, HOST_PORT);
		this.initalized = true;
		return this;
	}

	public async shutdown(signal: string) {
		console.log(`[${signal}] Сервер получил сигнал о завершеии работы`);

		try {
			await this.gameServer.gracefullyShutdown();
			console.log('Комнаты colyseus очищены.');
		} catch (e) {
			console.error(`Ошибка очистки комнат colyseus: ${e}`);
		}

		try {
			console.log('Очистка дб (roomCodes)');

			const { count } = await this.db.clearRoomCodes();
			console.log(`Очистил ${count} записей`);
		} catch (e) {
			console.log(`Ошибка очистки дб: ${e}`);
		} finally {
			this.db.prisma.$disconnect();
			console.log('Отключился от дб');
		}

		console.log('Сервер выключен');
		process.exit(0);
	}

	private init() {
		loadenv();
		this.listenForProcessSignals();
		this.initDB();
	}

	private initDB() {
		this.db = new DatabasePostgreSQL();
		db.core = this.db; // db.core -> глобальный эзэмпляр бд

		this.clearDB();
	}

	private clearDB() {
		this.db.clearRoomCodes().then(() => {
			console.log('Успешно удалил записи о комнатах в дб');
		});
	}

	private listenForProcessSignals() {
		process.on('SIGTERM', () => this.shutdown('SIGTERM'));
		process.on('SIGINT', () => this.shutdown('SIGINT'));
	}
}
