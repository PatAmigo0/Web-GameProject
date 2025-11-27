import { ErrorCode, HttpStatus, type AuthRequest } from '@game/shared';
import { sendError } from '@utils/httpError.util';
import type { NextFunction, Response } from 'express';
import { ZodError, type ZodType } from 'zod';

export const validate =
	(zodSchema: ZodType<any, any>) => async (req: AuthRequest, res: Response, next: NextFunction) => {
		try {
			const parsedData = await zodSchema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});

			if (parsedData.body) req.body = parsedData.body;
			if (parsedData.query) req.query = parsedData.query;
			if (parsedData.params) req.params = parsedData.params;

			next();
		} catch (error: Error | any) {
			if (error instanceof ZodError) {
				return sendError(res, HttpStatus.ZodValidationError, ErrorCode.BadJson);
			}
			return sendError(res, HttpStatus.InternalServerError, ErrorCode.InformationCorrupted);
		}
	};
