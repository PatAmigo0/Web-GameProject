import { scenes } from '../scenes';
import { SceneKeys } from '../types';

export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1280,
	height: 720,
	parent: 'webgame',
	url: import.meta.env.URL || '',
	version: import.meta.env.VERSION || '0.0.1',
	scene: scenes,
	scale: {
		mode: Phaser.Scale.ENVELOP, // fit to window
		autoCenter: Phaser.Scale.CENTER_BOTH, // vertically and horizontally
	},
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
		},
	},

	dom: {
		createContainer: true,
	},
};

export const STARTING_MENU = SceneKeys.TMainMenu;
export const STARTING_SCENE = SceneKeys.TestPlace;
export const MOVE_SPEED = 70;
