import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.ServerList, SceneTypes.HTMLScene, { to: SceneKeys.CharacterTestPlace })
export class ServerListScene extends BaseHtmlScene {
	//#region CLASS ATTRIBUTES
	//#endregion

	//#region PHASER LIFECYCLE METHODS
	public onPreload(): void {}

	public onCreate(): void {
		this._build_bg();
		this._build_face();
		this._init_class_attributes();
		this._init_click_events();
	}
	public heartbeat(): void {}
	public onShutdown(): void {}

	//#endregion

	//#region BUILDERS
	private _build_bg() {}
	private _build_face() {}
	//#endregion

	//#region INITIALIZERS
	private _init_class_attributes() {}

	private _init_click_events() {}
	//#endregion
}
