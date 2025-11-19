import { ErrorCode, HttpStatus } from '@game/shared';
import { HttpError, sendError } from '@utils/httpError.util';
import type { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.log('Новая ошибка:', err?.message);

	if (err instanceof HttpError) {
		return sendError(res, err.statusCode, err.code, err.message);
	}

	if (err instanceof SyntaxError && 'body' in err) {
		return sendError(res, HttpStatus.BadRequest, ErrorCode.BadJson, 'Invalid JSON');
	}

	console.error('НЕОЖИДАННАЯ ОШИБКА:', err);
	return sendError(
		res,
		HttpStatus.InternalServerError,
		ErrorCode.CriticalServerError,
		'На сервере произошла критическая ошибка',
	);
};

export const catchAsync = (fn: Function) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
