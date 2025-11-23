import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import { TransitionManager } from '@managers/TransitionManager';

@SceneInfo(SceneKeys.MenuWrapper, SceneTypes.HTMLScene)
export class MenuWrapperScene extends BaseHtmlScene {
	private transitionManager!: TransitionManager;

	public onPreload(): void {}

	public onCreate(): void {
		this.transitionManager = this.game.transitionManager;
		this.launchScene(SceneKeys.MainMenu);
	}

	public heartbeat(): void {}

	public onShutdown(): void {}

	private launchScene(to: SceneKeys, from?: SceneKeys) {
		this.game.events.once(GameEvents.SUB_SCENE_CHANGE, (_: SceneKeys, target: SceneKeys) => {
			this.logger.warn(`Launching ${to} -> ${target}`);
			this.launchScene(target, to); // to is now reffers to 'from' scene
		});

		this.transitionManager.swapSubScenes(this, from, to);
	}
}
