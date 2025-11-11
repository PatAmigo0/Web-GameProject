import type { WithPhaserLifecycle } from '@abstracts/scene-base/WithPhaserLifecycle';
import type { IInitializiable } from '@gametypes/core.types';
import { PhaserEvents, type ICoreSceneManager } from '@gametypes/phaser.types';
import { SceneTypes } from '@gametypes/scene.types';
import type { GameService } from '@services/GameService';
import { TransitionManager } from './TransitionManager';

export class SceneManager extends Phaser.Scenes.SceneManager implements ICoreSceneManager, IInitializiable {
	declare scenes: WithPhaserLifecycle[];
	declare game: GameService;

	private currentMainScene: WithPhaserLifecycle | undefined = null;
	private transitionManager!: TransitionManager;

	public init(): void {
		this.currentMainScene = null;
		this.transitionManager = new TransitionManager(this);
	}

	public changeMainScene(sceneKey: string): void {
		console.debug(
			`[SceneManager] меняю главную сцену: ${this.currentMainScene?.sceneKey} -> ${sceneKey}`,
		);

		const newScene = this.getScene(sceneKey);
		this.handleSceneType(newScene);

		if (this.currentMainScene) {
			this.transitionManager.swapScenes(this.currentMainScene, newScene);
		} else {
			this.start(newScene);
		}

		this.currentMainScene = newScene;
	}

	public stop<T extends WithPhaserLifecycle>(key: string | T, data?: object): this {
		const scene = this.getScene<WithPhaserLifecycle>(key);
		scene.events.once(PhaserEvents.SHUTDOWN, () => {
			scene.shutdown();
		});
		super.stop(scene, data);
		return this;
	}

	private handleSceneType(scene: WithPhaserLifecycle): void {
		switch (scene.sceneType) {
			case SceneTypes.GameScene:
				this.game.userInputService.lockMainKeys();
				break;
			case SceneTypes.HTMLScene:
				this.game.userInputService.unlockMainKeys();
				break;
			default:
				console.warn('[SceneManager] неподдерживаемый тип сцены');
		}
	}

	//#endregion
}
