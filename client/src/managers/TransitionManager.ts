import type { WithPhaserLifecycle } from '@abstracts/scene-base/WithPhaserLifecycle';
import { SceneEvents } from '@gametypes/event.types';
import type { SceneManager } from './SceneManager';

/**
 * Отвечает за плавный переход между сценами
 */
export class TransitionManager extends Phaser.Events.EventEmitter {
	constructor(private sceneManager: SceneManager) {
		super();
	}

	public swapScenes(
		oldScene: WithPhaserLifecycle,
		newScene: WithPhaserLifecycle,
		finishCallback?: Function,
	) {
		newScene.events.once(SceneEvents.SCENE_IS_READY_TO_RUN, () => {
			this.sceneManager.stop(oldScene);
			finishCallback?.call(this);
		});
		this.sceneManager.start(newScene);
	}

	public swapSubScenes<T extends WithPhaserLifecycle>(
		mainScene: T,
		oldScene: T | string | undefined,
		newScene: T | string,
		finishCallback?: Function,
	) {
		if (typeof newScene === 'string') newScene = this.sceneManager.getScene<T>(newScene);
		newScene.events.once(SceneEvents.SCENE_IS_READY_TO_RUN, () => {
			if (oldScene && this.sceneManager.isInitialized(oldScene)) mainScene.sleepLinked(oldScene);
			finishCallback?.call(this);
		});
		mainScene.launchLinked(newScene);
	}
}
