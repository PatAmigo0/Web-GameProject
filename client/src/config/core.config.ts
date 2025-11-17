// src/config/core.config.ts

/**
 * Ключ для пользовательского кэша
 */
export const CUSTOM_CACHE_KEY = '__custom_cache__';

/**
 * Для SceneDisposalService
 */
export const SHAKING_ALLOWED = true;

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const WSS_URL = `wss://${SERVER_URL}`;
export const HTTPS_URL = `https://${SERVER_URL}`;
