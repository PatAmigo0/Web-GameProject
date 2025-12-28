// src/config/game.config.ts

import { scenes } from '@scenes/index';
import AwaitLoaderPlugin from 'phaser3-rex-plugins/plugins/awaitloader-plugin.js';
import { GAME_HEIGHT, GAME_WIDTH } from './game.constants';

export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: GAME_WIDTH,
	height: GAME_HEIGHT,
	parent: 'webgame',
	url: import.meta.env.URL || '',
	version: import.meta.env.VERSION || '0.0.1',
	scene: scenes,
	pixelArt: true,
	disableContextMenu: true,

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
