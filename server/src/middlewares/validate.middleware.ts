import { ErrorCode, HttpStatus, type AuthRequest } from '@game/shared';
import type { NextFunction, Response } from 'express';
import { ZodError, type ZodType } from 'zod';

export const validate =
	(zodSchema: ZodType<any, any>) => async (req: AuthRequest, res: Response, next: NextFunction) => {
		try {
			await zodSchema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next();
		} catch (error: Error | any) {
			if (error instanceof ZodError) {
				return res.status(HttpStatus.ZodValidationError).json({ error: error.message });
			}
			return res.status(HttpStatus.InternalServerError).json(ErrorCode.InformationCorrupted);
		}
	};
