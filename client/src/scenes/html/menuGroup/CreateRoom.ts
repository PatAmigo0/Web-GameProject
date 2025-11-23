import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import { subSceneChange } from '@utils/routing.util';

@SceneInfo(SceneKeys.CreateRoom, SceneTypes.HTMLScene)
export class CreateRoomScene extends BaseHtmlScene {
	private backButton!: HTMLButtonElement;

	public onPreload(): void {}

	public onCreate(): void {
		this._init_class_attributes();
		this._init_click_events();
	}

	public heartbeat(): void {}

	public onShutdown(): void {}

	private _init_class_attributes() {
		this.backButton = this.div.querySelector('#back-btn');
	}

	private _init_click_events() {
		subSceneChange.call(this, this.backButton, SceneKeys.MainMenu);
	}
}
