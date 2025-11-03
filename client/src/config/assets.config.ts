//#region IMPORTS
import playerSpriteUrl from '/assets/images/hero.png';
import idlePlayerSpriteUrl from '/assets/images/Stand.png';
import newPlayerSpriteUrl from '/assets/images/Walk.png';
//#endregion

//#region ASSET KEYS
/**
 * Ключи (строковые идентификаторы) ассетов, используемые в коде Phaser
 */
export const ASSET_KEYS = {
	PLAYER_SPRITE: 'player',
	NEW_PLAYER_SPRITE: 'nplayer',
	PLAYER_IDLE: 'player-idle',
	MAP_MANIFEST: 'map-manifest',
	HTML_MANIFEST: 'html-manifest',
} as const;
//#endregion

//#region ASSET URLS
/**
 * Сопоставление ключей ассетов с их фактическими URL-адресами (путями к файлам)
 */
export const ASSET_URLS = {
	[ASSET_KEYS.PLAYER_SPRITE]: playerSpriteUrl,
	[ASSET_KEYS.NEW_PLAYER_SPRITE]: newPlayerSpriteUrl,
	[ASSET_KEYS.PLAYER_IDLE]: idlePlayerSpriteUrl,
	[ASSET_KEYS.MAP_MANIFEST]: '/assets/manifests/map-manifest.json',
	[ASSET_KEYS.HTML_MANIFEST]: '/assets/manifests/html-manifest.json',
} as const;
//#endregion
