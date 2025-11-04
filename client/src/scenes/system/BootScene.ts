// src/utils/BootScene.ts

import { AssetManager } from '@/managers/AssetManager';
import { TypedScene } from '@abstracts/scenes/TypedScene';
import { withPhaserLifecycle } from '@abstracts/scenes/WithPhaserLifecycle';
import { GameEventTypes } from '@config/events.config';
import { SceneInfo } from '@decorators/scene/SceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

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
	public heartbeat() {}

	public shutdown() {
		this.loadingText.destroy();
	}

	public async loadAssets() {
		await AssetManager.buildManifest();
		this.game.events.emit(GameEventTypes.BOOT);
	}
}
