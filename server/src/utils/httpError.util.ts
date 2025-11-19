import { ErrorCode, type HttpStatus, type QueryError } from '@game/shared';
import type { Response } from 'express';

// src/utils/HttpError.ts
export class HttpError extends Error {
	public statusCode: number;
	public code: ErrorCode;

	constructor(statusCode: number, code: ErrorCode, message?: string) {
		super(message ?? code);
		this.statusCode = statusCode;
		this.code = code || ErrorCode.CriticalServerError;

		Object.setPrototypeOf(this, HttpError.prototype);
	}
}

export const buildError = (code: ErrorCode, message?: string) => {
	return { code: code, message: message } as QueryError;
};

export const sendError = (res: Response, status: HttpStatus, code: ErrorCode, message?: string) => {
	return res.status(status).json(buildError(code, message));
};
