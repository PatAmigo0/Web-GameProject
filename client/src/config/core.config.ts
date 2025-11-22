// src/config/core.config.ts

import { HOST_PORT } from '@game/shared';

/**
 * Ключ для пользовательского кэша
 */
export const CUSTOM_CACHE_KEY = '__custom_cache__';

/**
 * Для SceneDisposalService
 */
export const SHAKING_ALLOWED = true;

export const VITE_SERVER_HOST = __PRODUCTION__ ? window.location.origin : `http://localhost:${HOST_PORT}`;

const WEB_SOCKET_PROTOCOL = __PRODUCTION__ ? 'wss' : 'ws';
// const TRANSFER_PROTOCOL = __PRODUCTION__ ? 'https' : 'http';

export const WS_URL = `${WEB_SOCKET_PROTOCOL}://${VITE_SERVER_HOST.split('://')[1]}`;
export const TRANSFER_HOST = VITE_SERVER_HOST;

console.log('RUNNING ', VITE_SERVER_HOST);
