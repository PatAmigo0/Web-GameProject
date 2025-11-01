// src/utils/BootScene.ts

import { AssetManager } from '../../services/AssetManager';
import { NamedScene } from '../../core/abstracts/NamedScene';
import { SceneKey } from '../../utils/decorators/SceneKey.decorator';
import { SceneKeys } from '../../types';
import { Game } from '../../main';
import { EventTypes } from '../../config/events.config';

@SceneKey(SceneKeys.BootScene)
export class BootScene extends NamedScene {
	private loadingText!: Phaser.GameObjects.Text;

	preload() {
		this.loadingText = this.add
			.text(
				this.cameras.main.width / 2,
				this.cameras.main.height / 2,
				'Загрузка игровых данных...',
				{ color: '#ffffff', fontSize: '24px' },
			)
			.setOrigin(0.5);
	}

	shutdown() {
		this.loadingText.destroy();
	}

	public async loadAssets() {
		await AssetManager.buildManifest();
		Game.EventService.emit(EventTypes.BOOT);
	}
}
