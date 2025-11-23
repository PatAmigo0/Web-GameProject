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
		this.transitionManager = new TransitionManager(this.game.scene);
		this.launchScene(SceneKeys.MainMenu, true);
	}

	public heartbeat(): void {}

	public onShutdown(): void {}

	private launchScene(key: SceneKeys, first?: boolean) {
		this.game.events.once(GameEvents.SUB_SCENE_CHANGE, (_: SceneKeys) => {
			this.launchScene(this.getOppositeScene(key));
		});

		this.transitionManager.swapSubScenes(this, (!first && this.getOppositeScene(key)) || undefined, key);
	}

	private getOppositeScene(key: SceneKeys) {
		if (key == SceneKeys.MainMenu) return SceneKeys.ServerList;
		return SceneKeys.MainMenu;
	}
}
