// src/config/render.config.ts

import { GAME_HEIGHT, GAME_WIDTH } from './game.constants';

export const CHARACTER_DEPTH = 100;
export const MAX_DEPTH = 999;
export const CAMERA_ZOOM = 4;

export const CHARACTER_SPRITESHEET_CONFIG: Phaser.Types.Loader.FileTypes.ImageFrameConfig = {
	frameWidth: 16,
	frameHeight: 32,
	startFrame: 0,
};

export const MAIN_DIV_STYLE = `
    width: ${GAME_WIDTH}px;
    height: ${GAME_HEIGHT}px;
    display: block;           
    position: relative;       
    pointer-events: none;     
`.replace(/\s/g, '');

export const TRANSITION_CANVAS_STYLE = `
			position: fixed;
			top: 0;
			left: 0;
			z-index: 9999;
		`.replace(/\s/g, '');
