// src/utils/BootScene.ts

import { AssetManager } from '../../services/AssetManager';
import { NamedScene } from '../../core/abstracts/NamedScene';
import { SceneKey } from '../../utils/decorators/SceneKey.decorator';
import { SceneKeys } from '../../types';
import { STARTING_MENU } from '../../config/game.config';

@SceneKey(SceneKeys.BootScene)
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
		this.scene.start(STARTING_MENU);
	}
}
