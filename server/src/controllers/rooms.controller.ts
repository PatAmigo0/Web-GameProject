import { matchMaker } from '@colyseus/core';
import { CODE_GENERATION_MAX_RETRIES } from '@config/codegeneration.config';
import { prisma } from '@database/database';
import { generateRoomCode } from '@utils/codeGenerator.util';
import type { Request, Response } from 'express';

export const createRoom = async (req: Request, res: Response) => {
	try {
		let shortCode = '';
		let link;
		let retries = CODE_GENERATION_MAX_RETRIES;

		do {
			shortCode = generateRoomCode();
			link = await prisma.roomCodes.findUnique({ where: { shortRoomId: shortCode } });
			retries--;
		} while (link && retries > 0);

		if (!shortCode && link) {
			throw new Error('Не удалось сгененерировать короткий код комнаты');
		}

		const room = await matchMaker.createRoom('baseGameRoom', {
			name: 'test',
			shortCode: shortCode,
		});

		const t = await prisma.roomCodes.create({
			data: {
				shortRoomId: shortCode,
				longRoomId: room.roomId,
			},
		});

		console.log(t);

		res.status(200).json({ code: shortCode, roomId: room.roomId });
	} catch (e) {
		res.status(500).json({ error: (e as Error)?.message });
		console.log(e);
		console.log('Ошибка во время запроса:', (e as Error).message);
	}
};

export const joinRoom = (req: Request, res: Response) => {};
