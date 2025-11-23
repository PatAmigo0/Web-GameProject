import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.LoginScene, SceneTypes.HTMLScene, { to: [SceneKeys.MainMenu, SceneKeys.SignupScene] })
export class LoginScene extends BaseHtmlScene {
	private changeToSignUpButton!: HTMLButtonElement;
	private loginButton!: HTMLButtonElement;

	public onPreload(): void {}
	public onCreate(): void {
		this._init_class_attributes();
		this._init_click_events();
	}

	public heartbeat(): void {}
	public onShutdown(): void {}

	private _init_class_attributes() {
		this.changeToSignUpButton = this.div.querySelector('#l') as HTMLButtonElement;

		this.loginButton = this.div.querySelector('#loginBtn') as HTMLButtonElement;
	}

	private _init_click_events() {
		this.changeToSignUpButton.addEventListener('click', () => {
			this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.SignupScene);
		});

		this.loginButton.addEventListener('click', () => {
			this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.MenuWrapper);
		});
	}
}
