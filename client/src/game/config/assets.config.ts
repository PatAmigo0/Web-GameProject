import playerSpriteUrl from '../../assets/images/hero.png';
import newPlayerSpriteUrl from '../../assets/images/Walk.png';
import idlePlayerSpriteUrl from '../../assets/images/Stand.png';
import HatImage1 from '../../assets/images/test_head_1.png';
import HatImage2 from '../../assets/images/test_head_2.png';
import HatImage3 from '../../assets/images/test_head_3.png';

export const ASSET_KEYS = {
	PLAYER_SPRITE: 'player',
	NEW_PLAYER_SPRITE: 'nplayer',
	PLAYER_IDLE: 'player-idle',
	HAT_1: 'hat-1',
	HAT_2: 'hat-2',
	HAT_3: 'hat-3',
};

export const ASSET_URLS = {
	[ASSET_KEYS.PLAYER_SPRITE]: playerSpriteUrl,
	[ASSET_KEYS.NEW_PLAYER_SPRITE]: newPlayerSpriteUrl,
	[ASSET_KEYS.PLAYER_IDLE]: idlePlayerSpriteUrl,
	[ASSET_KEYS.HAT_1]: HatImage1,
	[ASSET_KEYS.HAT_2]: HatImage2,
	[ASSET_KEYS.HAT_3]: HatImage3,
};
