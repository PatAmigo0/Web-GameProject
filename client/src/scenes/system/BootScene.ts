// src/utils/BootScene.ts

import { AssetManager } from '@/services/AssetManager';
import { TypedScene } from '@/core/abstracts/scenes/TypedScene';
import { SceneKeys, SceneTypes } from '@/types/scene.types';
import { EventTypes } from '@config/events.config';
import { SceneInfo } from '@utils/decorators/SceneInfo.decorator';
import { Game } from '@main';

@SceneInfo(SceneKeys.BootScene, SceneTypes.SystemScene)
export class BootScene extends TypedScene {
	private loadingText!: Phaser.GameObjects.Text;

	public preload() {
		this.loadingText = this.add
			.text(
				this.cameras.main.width / 2,
				this.cameras.main.height / 2,
				'Загрузка игровых данных...',
				{ color: '#ffffff', fontSize: '24px' },
			)
			.setOrigin(0.5);
	}

	public shutdown() {
		this.loadingText.destroy();
	}

	public async loadAssets() {
		await AssetManager.buildManifest();
		Game.EventService.emit(EventTypes.BOOT);
	}
}
