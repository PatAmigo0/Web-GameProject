// src/utils/BootScene.ts

import { AssetManager } from '../utils/manager/AssetManager';
import { NamedScene } from '../utils/ABC/NamedScene';
import { SceneKey } from '../utils/decorator/SceneKey.decorator';

@SceneKey('BootScene')
export class BootScene extends NamedScene {
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
		this.scene.start('TMainMenuScene');
	}
}
