import app from '@app';
import { Server } from '@colyseus/core';
import { listen } from '@colyseus/tools';
import { prisma } from '@database/database';
import { loadenv } from '@utils/loadenv.util';

export class ServerService {
	private initalized = false;
	public gameServer!: Server;

	public async start() {
		if (this.initalized) {
			throw new Error('Попытка запуска уже включенного сервера');
		}
		this.init();
		this.gameServer = await listen(app);
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

			const { count } = await prisma.roomCodes.deleteMany({});
			console.log(`Очистил ${count} записеq`);
		} catch (e) {
			console.log(`Ошибка очистки дб: ${e}`);
		} finally {
			prisma.$disconnect();
			console.log('Отключился от дб');
		}

		console.log('Сервер выключен');
		process.exit(0);
	}

	private init() {
		loadenv();
		this.listenForProcessSignals();
		prisma.roomCodes.deleteMany({}).then(() => {
			console.log('Успешно удалил очистил записи о комнатах в дб');
		});
	}

	private listenForProcessSignals() {
		process.on('SIGTERM', () => this.shutdown('SIGTERM'));
		process.on('SIGINT', () => this.shutdown('SIGINT'));
	}
}
