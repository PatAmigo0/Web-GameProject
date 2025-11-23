import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import type { WithPhaserLifecycle } from '@abstracts/scene-base/WithPhaserLifecycle';
import { injectInitializator } from '@decorators/injectInitializator.decorator';
import { injectLogger } from '@decorators/injectLogger.decorator';
import type { IInitializiable } from '@gametypes/core.types';
import { GameEvents } from '@gametypes/event.types';
import { PhaserEvents, type ICoreSceneManager } from '@gametypes/phaser.types';
import { SceneTypes } from '@gametypes/scene.types';
import type { GameService } from '@services/GameService';
import type { SceneDisposalService } from '@services/SceneDisposalService';
import type { Logger } from '@utils/Logger.util';
import { TransitionManager } from './TransitionManager';

@injectLogger()
@injectInitializator(
	(manager: SceneManager, transitionManager: TransitionManager, SDS: SceneDisposalService) => {
		manager.currentMainScene = null;
		manager.transitionManager = transitionManager;
		manager.sceneDisposalService = SDS;
		manager.listenEvents();
	},
)
export class SceneManager extends Phaser.Scenes.SceneManager implements ICoreSceneManager, IInitializiable {
	declare scenes: WithPhaserLifecycle[];
	declare game: GameService;

	protected declare logger: Logger;
	protected currentMainScene: WithPhaserLifecycle;
	protected transitionManager!: TransitionManager;
	protected sceneDisposalService!: SceneDisposalService;

	public declare init: (service: TransitionManager, service2: SceneDisposalService) => void;

	public changeMainScene(sceneKey: string): void {
		this.logger.debug(`Меняю главную сцену: ${this.currentMainScene?.sceneKey} -> ${sceneKey}`);

		const newScene = this.getScene(sceneKey);
		this.handleSceneType(newScene);

		if (this.currentMainScene) {
			this.transitionManager.swapScenes(this.currentMainScene, newScene, () =>
				this.sceneDisposalService.shake(),
			);
		} else {
			this.start(newScene);
		}

		this.currentMainScene = newScene;
	}

	public isShutdown<T extends CoreScene>(key: string | T): boolean {
		return this.getSceneStatus(key) == Phaser.Scenes.SHUTDOWN;
	}

	public isInitialized<T extends CoreScene>(key: string | T): boolean {
		return this.getSceneStatus(key) !== Phaser.Scenes.INIT;
	}

	public start<T extends WithPhaserLifecycle>(key: string | T, data?: object): this {
		super.start(key, data);
		return this;
	}

	public wake<T extends WithPhaserLifecycle>(key: string | T, data?: object): this {
		const scene = this.getScene(key);

		// Making sure that event SceneEvents.SCENE_IS_READY_TO_RUN is going to be emitted after waking up
		scene.sys.events.once(Phaser.Scenes.Events.WAKE, () => {
			scene.wake();
		});
		super.wake(key, data);
		return this;
	}

	public stop<T extends WithPhaserLifecycle>(key: string | T, data?: object): this {
		const scene = this.getScene<WithPhaserLifecycle>(key);
		if (this.isActive(scene)) {
			scene.events.once(PhaserEvents.SHUTDOWN, () => {
				scene.shutdown();
			});
			super.stop(scene, data);
		}
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
				this.logger.warn(`Неподдерживаемый тип сцены [${scene.sceneType}]`);
		}
	}

	private getSceneStatus<T extends CoreScene>(key: string | T): number {
		return this.getScene(key).sys.getStatus();
	}

	private listenEvents() {
		this.game.events.addListener(GameEvents.MAIN_SCENE_CHANGE, (sceneKey: string) => {
			if (!this.currentMainScene || sceneKey != this.currentMainScene.sceneKey) {
				this.changeMainScene(sceneKey);
			}
		});
	}
}
