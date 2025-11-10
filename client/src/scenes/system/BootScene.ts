// src/scenes/system/BootScene.ts

import { CoreScene } from '@abstracts/scene/CoreScene';
import { withPhaserLifecycle } from '@abstracts/scene/WithPhaserLifecycle';
import { GAME_EVENT_TYPES } from '@config/events.config';
import { SceneInfo } from '@decorators/SceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.BootScene, SceneTypes.SystemScene)
export class BootScene extends withPhaserLifecycle(CoreScene) {
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

	public heartbeat() {}

	public shutdown() {
		this.loadingText.destroy();
	}

	public async loadAssets() {
		await this.game.assetManager.buildManifest();
		this.game.events.emit(GAME_EVENT_TYPES.BOOT); // -> EventService слушает это событие
	}
}
