//#region IMPORTS
import { SceneKeys } from '@gametypes/scene.types';
import { scenes } from '@scenes/index';
import AwaitLoaderPlugin from 'phaser3-rex-plugins/plugins/awaitloader-plugin.js';

//#endregion

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

//#region CORE GAME CONFIGURATION
/**
 * Основной объект конфигурации Phaser.Game
 */
export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: GAME_WIDTH,
	height: GAME_HEIGHT,
	parent: 'webgame',
	url: import.meta.env.URL || '',
	version: import.meta.env.VERSION || '0.0.1',
	scene: scenes,
	pixelArt: true,

	plugins: {
		global: [
			{
				key: 'rexAwaitLoader',
				plugin: AwaitLoaderPlugin,
				start: true,
			},
		],
	},

	scale: {
		mode: Phaser.Scale.ENVELOP,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},

	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
		},
	},

	dom: {
		createContainer: true,
	},
} as const;
//#endregion

//#region SCENE FLOW CONFIGURATION
/**
 * Ключи сцен, с которых начинается игра/меню
 */
export const STARTING_SCENE = SceneKeys.LoginScene;
export const TEST_SCENE = SceneKeys.CharacterTestPlace;
//#endregion

//#region PLAYER & WORLD CONFIGURATION
/**
 * Настройки, связанные с игроком, движением и размерами тайлов
 */
export const MOVE_SPEED = 70;
export const PLAYER_CONFIG = { width: 16, height: 32 };

export const TILE_SIZE = { width: 16, height: 16 };
export const IDLE_ANIM_LOCK_DURATION = 80;
//#endregion

//#region RENDERING & DEPTH CONFIGURATION
/**
 * Настройки, связанные с отображением и z-индексом (глубиной)
 */
export const PLAYER_DEPTH = 100;
export const MAX_DEPTH = 999;
export const CAMERA_ZOOM = 4;
//#endregion

export const MAIN_DIV_STYLE = `
			display: flex; flex-direction: 
			column; justify-content: center; 
			align-items: center; text-align: center; 
			width: ${GAME_WIDTH}px; 
			height: ${GAME_HEIGHT}px;
			`.replace(/\s/g, '');

export const TRANSITION_CANVAS_STYLE = `
			position: fixed;
			top: 0;
			left: 0;
			z-index: 9999;
		`.replace(/\s/g, '');

export const CUSTOM_CACHE_KEY = '__custom_cache__';
