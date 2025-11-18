import { db } from '@/instances/db.instance';
import { SALT_ROUNDS } from '@config/user.config';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import type { LoginDto, RegisterDto } from '../../../packages/shared/dist';

export const test = async (req: Request, res: Response) => {
	console.log('[TEST] Тело запроса:', req.body);

	res.status(200).json({
		message: 'Тест пройден',
		receivedData: req.body,
		token: crypto.randomUUID(),
	});
};

export const registration = async (req: Request, res: Response) => {
	const body = req.body as RegisterDto;
	const login = body.login;
	const password = body.password;

	try {
		const db_entry = await db.core!.findUniqueUser(login);
		if (db_entry) {
			throw new Error('BAD_REGISRTATION');
		}

		const saltedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		const userUUID = crypto.randomUUID();

		await db.core!.insertUser(login, saltedPassword, userUUID);

		console.log(`Успешно создал нового пользователя! Username: ${login}, Password: ${password}`);
		res.status(200).json('SUCCESS'); // !!! update later (return a jwt token)
	} catch (e) {
		res.status(400).json({ error: (e as Error).message ?? 'null' });
	}
};

export const login = async (req: Request, res: Response) => {
	const body = req.body as LoginDto;
	const login = body?.login;
	const password = body?.password;

	try {
		const db_entry = await db.core!.findUniqueUser(login);
		if (!db_entry) {
			throw new Error('BAD_LOGIN');
		}

		if (!bcrypt.compareSync(password, db_entry.passwordHash)) {
			throw new Error('BAD_PASSWORD');
		}

		console.log('Пользователь успешно вошел в меня (ах ~)!');
		res.status(200).json({ message: 'SUCCESS' }); // !!! update later (return a jwt token)
	} catch (e) {
		res.status(400).json({ error: (e as Error).message ?? 'null' });
	}
};
