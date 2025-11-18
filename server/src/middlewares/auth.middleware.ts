// src/middleware/auth.middleware.ts

import { ErrorCode, HttpStatus, type AuthRequest } from '@game/shared';
import type { NextFunction, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		if (!JWT_SECRET)
			return res.status(HttpStatus.InternalServerError).json(ErrorCode.CriticalServerError);
		throw new Error(''); // Временная заглушка
		next();
	} catch (e) {
		return res.status(HttpStatus.Unauthorized).json({ error: ErrorCode.UserNotAllowed });
	}
};
