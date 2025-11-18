import { db } from '@/instances/db.instance';
import { matchMaker } from '@colyseus/core';
import { CODE_GENERATION_MAX_RETRIES } from '@config/codegeneration.config';
import { generateRoomCode } from '@utils/codegen.util';
import type { Request, Response } from 'express';

export const createRoom = async (req: Request, res: Response) => {
	try {
		let shortCode = '';
		let link;
		let retries = CODE_GENERATION_MAX_RETRIES;

		do {
			shortCode = generateRoomCode();
			link = await db.core!.findUniqueRoomByCode(shortCode);
			retries--;
		} while (link && retries > 0);

		if (link) {
			throw new Error('Не удалось сгененерировать короткий код комнаты');
		}

		const room = await matchMaker.createRoom('baseGameRoom', {
			name: 'test',
			shortCode: shortCode,
		});

		await db.core?.insertRoom(shortCode, room.roomId); // ждем пока не обновим дб
		res.status(200).json({ code: shortCode, roomId: room.roomId });
		console.log(`Успешно создал новую комнату [${room.shortCode}]:[${room.roomId}]`);
	} catch (e) {
		res.status(500).json({ error: (e as Error)?.message });
		console.log('Ошибка во время запроса:', (e as Error).message, e);
	}
};

export const joinRoom = (req: Request, res: Response) => {
	console.log('ПЫТАЮСЬ ПРИСОЕДИНИТЬ ИГРОКА!');
};
