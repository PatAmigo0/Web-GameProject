import { scenes } from './scenes';

export const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1280,
	height: 720,
	parent: 'webgame',
	url: import.meta.env.URL || '',
	version: import.meta.env.VERSION || '0.0.1',
	scene: scenes,
	scale: {
		mode: Phaser.Scale.FIT, // fit to window
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
