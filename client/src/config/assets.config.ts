// src/config/assets.config.ts

//#region IMPORTS
import idleCharacterSpriteUrl from '/assets/images/Stand.png';
import moveCharacterSpriteUrl from '/assets/images/Walk.png';
//#endregion

//#region ASSET KEYS
export const ASSET_KEYS = {
	CHARACTER_SPRITE: 'character-base-walk',
	CHARACTER_IDLE: 'character-base-idle',
	MAP_MANIFEST: 'map-manifest',
	HTML_MANIFEST: 'html-manifest',
} as const;
//#endregion

//#region ASSET URLS
export const ASSET_URLS = {
	[ASSET_KEYS.CHARACTER_SPRITE]: moveCharacterSpriteUrl,
	[ASSET_KEYS.CHARACTER_IDLE]: idleCharacterSpriteUrl,
	[ASSET_KEYS.MAP_MANIFEST]: '/assets/manifests/map-manifest.json',
	[ASSET_KEYS.HTML_MANIFEST]: '/assets/manifests/html-manifest.json',
} as const;
//#endregion
