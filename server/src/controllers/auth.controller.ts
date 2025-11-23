import { ErrorCode, HttpStatus, OkCode, type LoginDto, type RegisterDto } from '@game/shared';
import { db } from '@instances/db.instance';
import { HttpError } from '@utils/httpError.util'; // Твой класс ошибки
import { sendSuccess } from '@utils/httpSuccess.util';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// отправляет JWT токен клиенту
const successAuth = (res: Response, code: OkCode, uuid: string, username: string) => {
	const token = jwt.sign({ uuid: uuid, username: username }, process.env.JWT_SECRET!, {
		expiresIn: '7d',
	});

	sendSuccess(res, HttpStatus.OK, code, { data: { token: token, uuid: uuid } });
};

// Контроллер регистрации
export const registration = async (req: Request, res: Response) => {
	const { login, password } = req.body as RegisterDto;

	const existingUser = await db.core!.findUniqueUser(login);
	if (existingUser) {
		throw new HttpError(HttpStatus.Conflict, ErrorCode.LoginTaken);
	}

	const saltedPassword = await bcrypt.hash(password, 4);
	const userUuid = crypto.randomUUID();

	await db.core!.insertUser(login, saltedPassword, userUuid);

	console.log(`New user ${login}, uuid: ${userUuid}, password: ${password}, ip: ${req.ip}, ${req.ips}`);
	successAuth(res, OkCode.SuccessRegistration, userUuid, login);
};

// Контроллер входа
export const login = async (req: Request, res: Response) => {
	const { login, password } = req.body as LoginDto;

	const user = await db.core!.findUniqueUser(login);
	if (!user) {
		throw new HttpError(HttpStatus.NotFound, ErrorCode.UserNotFound);
	}

	const isPasswordValid = await bcrypt.compare(password, user.passwordHash!);
	if (!isPasswordValid) {
		throw new HttpError(HttpStatus.Unauthorized, ErrorCode.UserWrongPassword);
	}

	console.log(`User logged in: ${login}, his uuid is ${user.uuid}, ip: ${req.ip}, ${req.ips}`);
	successAuth(res, OkCode.SuccesLogin, user.uuid, login);
};
