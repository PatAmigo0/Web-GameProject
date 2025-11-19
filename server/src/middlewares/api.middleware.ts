import { ErrorCode, HttpStatus } from '@game/shared';
import { buildError } from '@utils/httpError.util';
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: true,
	legacyHeaders: false,
	statusCode: HttpStatus.TooManyRequests,
	message: buildError(ErrorCode.RateLimitExceed),
});
