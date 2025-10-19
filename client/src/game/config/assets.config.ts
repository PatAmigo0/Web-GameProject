import playerSpriteUrl from '../../assets/images/hero.png';
import newPlayerSpriteUrl from '../../assets/images/Walk.png';
import idlePlayerSpriteUrl from '../../assets/images/Stand.png';

export const ASSET_KEYS = {
	PLAYER_SPRITE: 'player',
	NEW_PLAYER_SPRITE: 'nplayer',
	PLAYER_IDLE: 'player-idle',
};

export const ASSET_URLS = {
	[ASSET_KEYS.PLAYER_SPRITE]: playerSpriteUrl,
	[ASSET_KEYS.NEW_PLAYER_SPRITE]: newPlayerSpriteUrl,
	[ASSET_KEYS.PLAYER_IDLE]: idlePlayerSpriteUrl,
};
