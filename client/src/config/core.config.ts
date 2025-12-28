// client/src/config/core.config.ts

import { HOST_PORT } from '@game/shared';

export const CUSTOM_CACHE_KEY = '__custom_cache__';
export const SHAKING_ALLOWED = true;

export const VITE_SERVER_HOST = __PRODUCTION__ ? window.location.origin : `http://localhost:${HOST_PORT}`;

const isSecure = window.location.protocol === 'https:';
const WEB_SOCKET_PROTOCOL = isSecure ? 'wss' : 'ws';

export const WS_URL = `${WEB_SOCKET_PROTOCOL}://${VITE_SERVER_HOST.split('://')[1]}`;
export const TRANSFER_HOST = VITE_SERVER_HOST;

console.log('RUNNING ', VITE_SERVER_HOST);
console.log('TRANSFERs HOST:', TRANSFER_HOST);