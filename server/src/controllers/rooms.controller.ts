import { matchMaker } from '@colyseus/core';
import { CODE_GENERATION_MAX_RETRIES } from '@config/generation.config';
import {
	ErrorCode,
	HttpStatus,
	OkCode,
	RoomTypes,
	type CreateRoomDto,
	type RoomResponse,
} from '@game/shared';
import { db } from '@instances/db.instance';
import { generateRoomCode } from '@utils/codegen.util';
import { HttpError } from '@utils/httpError.util';
import { sendSuccess } from '@utils/httpSuccess.util';
import type { Request, Response } from 'express';

export const createRoom = async (req: Request, res: Response) => {
	let shortCode = '';
	let link;
	let retries = CODE_GENERATION_MAX_RETRIES;

	do {
		shortCode = generateRoomCode();
		link = await db.core!.findUniqueRoomByCode(shortCode);
		retries--;
	} while (link && retries > 0);

	if (link) {
		throw new HttpError(
			HttpStatus.Forbidden,
			ErrorCode.ServerError,
			'Не удалось сгененерировать короткий код комнаты',
		);
	}

	const data = req.body as CreateRoomDto;

	const room = await matchMaker.createRoom(RoomTypes.BaseGameRoom, {
		name: data.roomName,
		maxClients: data.playersAmount,
		isPrivate: data.isPrivate,
	});

	await db.core?.insertRoom(shortCode, room.roomId);
	sendSuccess(res, HttpStatus.OK, OkCode.RoomCreated, {
		data: { code: shortCode, roomId: room.roomId },
	} as RoomResponse);
	console.log(`Успешно создал новую комнату [${shortCode}]:[${room.roomId}]`);
};

export const joinRoom = async (req: Request, res: Response) => {
	const { code } = req.params;
	console.log('ПЫТАЮСЬ ПРИСОЕДИНИТЬ ИГРОКА!', code);

	const room = await db.core!.findUniqueRoomByCode(code);
	if (!room) {
		throw new HttpError(HttpStatus.NotFound, ErrorCode.RoomNotFound);
	}

	console.log('Успех');
	sendSuccess(res, HttpStatus.OK, OkCode.RoomJoin, { data: { roomId: room.longRoomId } } as RoomResponse);
};

export const listRooms = async (req: Request, res: Response) => {
	const rooms = await matchMaker.query({ private: false });
	sendSuccess(res, HttpStatus.OK, OkCode.RoomsListed, { data: rooms });
};
