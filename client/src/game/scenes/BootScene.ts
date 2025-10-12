// src/scenes/BootScene.ts

import { Scene } from 'phaser';
import { AssetManager } from '../classes/manager/AssetManager';

export class BootScene extends Scene {
	constructor() {
		super('BootScene');
	}

	preload() {
		this.add
			.text(
				this.cameras.main.width / 2,
				this.cameras.main.height / 2,
				'Загрузка игровых данных...',
				{ color: '#ffffff', fontSize: '24px' },
			)
			.setOrigin(0.5);
	}

	async create() {
		await AssetManager.buildManifest();
		this.scene.start('MainMenuScene');
	}
}
