// src/utils/BootScene.ts

import { AssetManager } from '@/services/AssetManager';
import { TypedScene } from '@/core/abstracts/TypedScene';
import { SceneKeys, SceneTypes } from '@/types/scene.types';
import { Game } from '@main';
import { EventTypes } from '@config/events.config';
import { SceneInfo } from '@utils/decorators/SceneInfo.decorator';

@SceneInfo(SceneKeys.BootScene, SceneTypes.SystemScene)
export class BootScene extends TypedScene {
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
