// src/middleware/auth.middleware.ts

import { ErrorCode, HttpStatus, type AuthRequest } from '@game/shared';
import { sendError } from '@utils/httpError.util';
import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		if (!token) {
			return sendError(res, HttpStatus.Unauthorized, ErrorCode.AuthInvalidToken);
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!);
		req.user = decoded;

		next();
	} catch (e) {
		console.log(e);
		return sendError(res, HttpStatus.Unauthorized, ErrorCode.AuthInvalidToken);
	}
};
