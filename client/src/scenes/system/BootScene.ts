// src/utils/BootScene.ts

import { AssetManager } from '@/services/AssetManager';
import { SceneKeys, SceneTypes } from '@/types/scene.types';
import { EventTypes } from '@config/events.config';
import { SceneInfo } from '@/utils/decorators/scene/SceneInfo.decorator';
import { Game } from '@main';
import { withPhaserLifecycle } from '@/core/abstracts/scenes/WithPhaserLifecycle';
import { TypedScene } from '@/core/abstracts/scenes/TypedScene';

@SceneInfo(SceneKeys.BootScene, SceneTypes.SystemScene)
export class BootScene extends withPhaserLifecycle(TypedScene) {
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

	public create() {}
	public heartbeat(): void {}

	public shutdown() {
		this.loadingText.destroy();
	}

	public async loadAssets() {
		await AssetManager.buildManifest();
		Game.EventService.emit(EventTypes.BOOT);
	}
}
