import { HTTP_DEV_HOST, HTTPS_HOST, WS_DEV_HOST, WSS_HOST } from '@config/cors.config';
import helmet from 'helmet';

export const helmetMiddleware = helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", "'unsafe-inline'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			connectSrc: ["'self'", HTTP_DEV_HOST, WS_DEV_HOST, HTTPS_HOST, WSS_HOST],
			imgSrc: ["'self'", 'data:', 'https:'],
		},
	},
});
