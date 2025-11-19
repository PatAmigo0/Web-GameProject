import { ALLOWED_ORIGINS } from '@config/cors.config';
import { ErrorCode, HttpStatus } from '@game/shared';
import { HttpError } from '@utils/httpError.util';
import cors from 'cors';

export const corsMiddleware = cors({
	origin: (origin, callback) => {
		if (!origin) return callback(null, true);
		if (ALLOWED_ORIGINS.has(origin)) {
			callback(null, true);
		} else {
			callback(new HttpError(HttpStatus.InternalServerError, ErrorCode.CorsNotAllowed));
		}
	},
	credentials: true,
});
