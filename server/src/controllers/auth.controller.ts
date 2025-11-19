import { ErrorCode, HttpStatus, OkCode, type LoginDto, type RegisterDto } from '@game/shared';
import { db } from '@instances/db.instance';
import { HttpError } from '@utils/httpError.util'; // Твой класс ошибки
import { sendSuccess } from '@utils/httpSuccess.util';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type { Request, Response } from 'express';

// Контроллер регистрации
export const registration = async (req: Request, res: Response) => {
	const { login, password } = req.body as RegisterDto;

	const existingUser = await db.core!.findUniqueUser(login);
	if (existingUser) {
		throw new HttpError(HttpStatus.Conflict, ErrorCode.LoginTaken);
	}

	const saltedPassword = await bcrypt.hash(password, 10);
	const userUUID = crypto.randomUUID();

	await db.core!.insertUser(login, saltedPassword, userUUID);

	console.log(`New user: ${login}`);
	sendSuccess(res, HttpStatus.OK, OkCode.SuccessRegistration);
};

// Контроллер входа
export const login = async (req: Request, res: Response) => {
	const { login, password } = req.body as LoginDto;

	const user = await db.core!.findUniqueUser(login);
	if (!user) {
		throw new HttpError(HttpStatus.NotFound, ErrorCode.UserNotFound);
	}

	const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
	if (!isPasswordValid) {
		throw new HttpError(HttpStatus.Unauthorized, ErrorCode.UserWrongPassword);
	}

	console.log(`User logged in: ${login}`);
	sendSuccess(res, HttpStatus.OK, OkCode.SuccesLogin);
};
