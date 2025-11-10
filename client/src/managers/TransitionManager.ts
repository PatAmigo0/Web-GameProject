import type { CoreScene } from '@abstracts/scene/CoreScene';
import { SCENE_EVENT_TYPES } from '@config/events.config';

/**
 * Отвечает за плавный переход между сценами
 * В своей основе изсользует html2canvas
 */
export class TransitionManager extends Phaser.Events.EventEmitter {
	private scenePlugin!: Phaser.Scenes.SceneManager;

	constructor(scenePlugin: Phaser.Scenes.SceneManager) {
		super();
		this.scenePlugin = scenePlugin;
	}

	public swapScenes(oldScene: CoreScene, newScene: CoreScene) {
		this.scenePlugin.start(newScene);
		newScene.events.once(SCENE_EVENT_TYPES.SCENE_IS_READY_TO_RUN, () => {
			this.scenePlugin.stop(oldScene);
		});
	}
}
