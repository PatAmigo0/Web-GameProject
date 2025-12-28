import { HOST_PORT, VITE_PORT } from '@game/shared';

export const HTTP_DEV_HOST = `http://localhost:${HOST_PORT}`;
export const HTTPS_HOST = process.env.PRODUCTION_HOST!;
console.log(process.env.PRODUCTION_HOST);
export const WS_DEV_HOST = HTTP_DEV_HOST.replace('http', 'ws');
export const WSS_HOST = HTTPS_HOST.replace('https', 'wss');

export const ALLOWED_ORIGINS = new Set([
	`http://localhost:${VITE_PORT}`,
	`https://localhost:${VITE_PORT}`,
	`http://127.0.0.1:${VITE_PORT}`,
	`https://127.0.0.1:${VITE_PORT}`,
	HTTP_DEV_HOST,
	HTTPS_HOST,
]);

console.log(ALLOWED_ORIGINS);
