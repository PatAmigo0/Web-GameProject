import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.ServerList, SceneTypes.HTMLScene, { to: SceneKeys.CharacterTestPlace })
export class ServerListScene extends BaseHtmlScene {
	//#region CLASS ATTRIBUTES
	private backButton!: HTMLButtonElement;
	//#endregion

	//#region PHASER LIFECYCLE METHODS
	public onPreload(): void {}

	public onCreate(): void {
		this._init_class_attributes();
		this._init_click_events();
	}
	public heartbeat(): void {}
	public onShutdown(): void {}

	//#endregion

	//#region INITIALIZERS
	private _init_class_attributes() {
		this.backButton = this.div.querySelector('#back-btn');
	}

	private _init_click_events() {
		this.backButton.addEventListener('click', () => {
			this.game.events.emit(GameEvents.SUB_SCENE_CHANGE, this.sceneKey);
		});
	}
	//#endregion
}
