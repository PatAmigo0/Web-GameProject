import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import { SHAKING_ALLOWED } from '@config/core.config';
import { injectLogger } from '@decorators/injectLogger.decorator';
import type { SceneManager } from '@managers/SceneManager';
import { Logger } from '@utils/Logger.util';

/**
 * Альфа вариант шэйкера для оптимизации
 *
 * Очень плохой и подлежит доробтке в будущем, но в целом рабочий
 */
@injectLogger()
export class SceneDisposalService {
	private scenes!: CoreScene[];
	private declare logger: Logger;

	constructor(private sceneManager: SceneManager) {
		this.scenes = sceneManager.scenes;
		this.shake =
			SHAKING_ALLOWED && this.scenes.every((scene) => scene.config)
				? () => {
						const disposable = new Set<CoreScene>();
						this.scenes.forEach((targetScene) => {
							if (
								(this.sceneManager.isShutdown(targetScene) ||
									this.sceneManager.isInitialized(targetScene)) &&
								this.scenes.filter((scene) => {
									return (
										scene != targetScene &&
										!disposable.has(scene) &&
										scene.sys.getStatus() != Phaser.Scenes.SHUTDOWN &&
										scene.config?.to?.has(targetScene.sceneKey)
									);
								}).length == 0
							) {
								disposable.add(targetScene);
							}
						});

						disposable.forEach((scene) => {
							this.sceneManager.remove(scene.sceneKey);
						});

						this.logger.debug('Scenes after shake:', this.scenes);
				  }
				: () => {};
	}

	public shake!: () => void;
}
