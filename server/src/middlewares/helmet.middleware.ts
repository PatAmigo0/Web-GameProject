import { HTTP_DEV_HOST, HTTPS_HOST, WS_DEV_HOST, WSS_HOST } from '@config/cors.config';
import helmet from 'helmet';

const isDev = process.env.NODE_ENV !== 'production';

export const helmetMiddleware = helmet({
	crossOriginEmbedderPolicy: false,

	contentSecurityPolicy: {
		directives: {
			// По умолчанию: только с нашего домена
			defaultSrc: ["'self'"],
			scriptSrc: isDev ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"] : ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
			connectSrc: ["'self'", HTTP_DEV_HOST, WS_DEV_HOST, HTTPS_HOST, WSS_HOST].filter(Boolean),
			imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
			workerSrc: ["'self'", 'blob:'],
			mediaSrc: ["'self'", 'data:', 'blob:', 'https:'],
			fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],

			// Запрещаем встраивать вашу игру в iframe на чужих сайтах (защита от Clickjacking)
			frameAncestors: ["'self'"],
		},
	},
});
