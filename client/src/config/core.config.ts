// src/config/core.config.ts

import { SERVER_HOST } from '@game/shared';

/**
 * Ключ для пользовательского кэша
 */
export const CUSTOM_CACHE_KEY = '__custom_cache__';

/**
 * Для SceneDisposalService
 */
export const SHAKING_ALLOWED = true;

export const VITE_SERVER_HOST = SERVER_HOST;

const WEB_SOCKET_PROTOCOL = __PRODUCTION__ ? 'wss' : 'ws';
const TRANSFER_PROTOCOL = __PRODUCTION__ ? 'https' : 'http';

export const WSS_URL = `${WEB_SOCKET_PROTOCOL}://${VITE_SERVER_HOST}`;
export const TRANSFER_HOST = `${TRANSFER_PROTOCOL}://${VITE_SERVER_HOST}`;
