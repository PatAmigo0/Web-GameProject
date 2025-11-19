// src/middleware/auth.middleware.ts

import { ErrorCode, HttpStatus, type AuthRequest } from '@game/shared';
import { HttpError } from '@utils/httpError.util';
import type { NextFunction, Response } from 'express';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		throw new HttpError(HttpStatus.Unauthorized, ErrorCode.UserNotAllowed, 'User not allowed'); // Временная заглушка
		next();
	} catch (e) {
		if (e instanceof HttpError) {
			return next(e);
		}

		return next(e);
	}
};
