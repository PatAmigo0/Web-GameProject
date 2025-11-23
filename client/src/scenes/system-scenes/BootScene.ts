// src/scenes/system/BootScene.ts

import { WithPhaserLifecycle } from '@abstracts/scene-base/WithPhaserLifecycle';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.BootScene, SceneTypes.SystemScene, { to: SceneKeys.LoginScene })
export class BootScene extends WithPhaserLifecycle {
	private loadingText!: Phaser.GameObjects.Text;

	public preload() {
		this.loadingText = this.add
			.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Загрузка игровых данных...', {
				color: '#ffffff',
				fontSize: '24px',
			})
			.setOrigin(0.5);
	}

	public shutdown() {
		this.loadingText.destroy();
	}

	public async loadAssets() {
		await this.game.assetManager.buildManifest();
		// this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, STARTING_SCENE);
	}

	/**
	 * Отвечает за логику: что делать?
	 * - Могу ли я сразу войти в сеть?
	 * - Или мне нужно сначало попросить пользователя войти самому?
	 */
	public async handleStartup() {
		await this.game.authService.tryAuth(true, 'login');
	}
}
