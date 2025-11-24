import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import { listenSubSceneChange } from '@utils/ui-utils/routing.util';

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
		listenSubSceneChange.call(this, this.backButton, SceneKeys.MainMenu);
	}
	//#endregion
}
