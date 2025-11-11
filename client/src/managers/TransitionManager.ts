import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import { SceneEvents } from '@gametypes/event.types';

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
		newScene.events.once(SceneEvents.SCENE_IS_READY_TO_RUN, () => {
			this.scenePlugin.stop(oldScene);
		});
	}
}
