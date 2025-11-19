import { OkCode, type HttpStatus } from '@game/shared';
import type { Response } from 'express';

export const sendSuccess = (res: Response, status: HttpStatus, code: OkCode, data?: {}) => {
	if (data) {
		Object.defineProperty(data, 'code', {
			value: code,
			enumerable: true,
			configurable: true,
		});
	} else {
		data = {
			code: code,
		};
	}

	return res.status(status).json(data);
};
