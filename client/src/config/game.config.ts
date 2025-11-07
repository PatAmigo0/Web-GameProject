//#region IMPORTS
import { SceneKeys } from '@gametypes/scene.types';
import { scenes } from '@scenes/index';
//#endregion

//#region CORE GAME CONFIGURATION
/**
 * Основной объект конфигурации Phaser.Game
 */
export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1280,
	height: 720,
	parent: 'webgame',
	url: import.meta.env.URL || '',
	version: import.meta.env.VERSION || '0.0.1',
	scene: scenes,
	pixelArt: true, // Включаем Pixel Art по умолчанию

	// Настройки масштабирования и размещения на экране
	scale: {
		mode: Phaser.Scale.ENVELOP, // fit to window
		autoCenter: Phaser.Scale.CENTER_BOTH, // vertically and horizontally
	},

	// Настройки физики (Arcade Physics)
	physics: {
		default: 'arcade',
		arcade: {
			debug: true, // Включаем отладку физики
		},
	},

	// Настройки DOM-элементов
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
