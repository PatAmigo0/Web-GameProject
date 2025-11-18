// src/config/core.config.ts

/**
 * Ключ для пользовательского кэша
 */
export const CUSTOM_CACHE_KEY = '__custom_cache__';

/**
 * Для SceneDisposalService
 */
export const SHAKING_ALLOWED = true;

export const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;

const WEB_SOCKET_PROTOCOL = __PRODUCTION__ ? 'wss' : 'ws';
const TRANSFER_PROTOCOL = __PRODUCTION__ ? 'https' : 'http';

export const WSS_URL = `${WEB_SOCKET_PROTOCOL}://${SERVER_HOST}`;
export const TRANSFER_HOST = `${TRANSFER_PROTOCOL}://${SERVER_HOST}`;
