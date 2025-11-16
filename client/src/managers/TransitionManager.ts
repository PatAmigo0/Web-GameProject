import type { WithPhaserLifecycle } from '@abstracts/scene-base/WithPhaserLifecycle';
import { SceneEvents } from '@gametypes/event.types';
import { SceneDisposalService } from '@services/SceneDisposalService';
import type { SceneManager } from './SceneManager';

/**
 * Отвечает за плавный переход между сценами
 */
export class TransitionManager extends Phaser.Events.EventEmitter {
	constructor(private sceneManager: SceneManager, private sceneDisposalService: SceneDisposalService) {
		super();
	}

	public swapScenes(oldScene: WithPhaserLifecycle, newScene: WithPhaserLifecycle) {
		this.sceneManager.start(newScene);
		newScene.events.once(SceneEvents.SCENE_IS_READY_TO_RUN, () => {
			this.sceneManager.stop(oldScene);
			(() => this.sceneDisposalService.shake())();
		});
	}
}
