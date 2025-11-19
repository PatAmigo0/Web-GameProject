import { SERVER_HOST, VITE_PORT } from '@game/shared';

export const HTTP_DEV_HOST = `http://${SERVER_HOST}`;
export const HTTPS_HOST = `https://${SERVER_HOST}`;
export const WS_DEV_HOST = HTTP_DEV_HOST.replace('http', 'ws');
export const WSS_HOST = HTTPS_HOST.replace('https', 'wss');

export const ALLOWED_ORIGINS = new Set([
	`http://localhost:${VITE_PORT}`,
	`http://127.0.0.1:${VITE_PORT}`,
	`http://${SERVER_HOST}`,
	`https://${SERVER_HOST}`,
]);
