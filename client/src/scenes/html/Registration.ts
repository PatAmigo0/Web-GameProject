import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.SignupScene, SceneTypes.HTMLScene, { to: [SceneKeys.MainMenu, SceneKeys.LoginScene] })
export class RegistrationScene extends BaseHtmlScene {
	private changeToLoginButton!: HTMLButtonElement;
	private registrationButton!: HTMLButtonElement;

	public onPreload(): void {}

	public onCreate(): void {
		this._init_class_attributes();
		this._init_click_events();
	}

	public heartbeat(): void {}
	public onShutdown(): void {}

	private _init_class_attributes() {
		this.changeToLoginButton = this.div.querySelector('#s') as HTMLButtonElement;

		this.registrationButton = this.div.querySelector('#registerBtn') as HTMLButtonElement;
	}

	private _init_click_events() {
		this.changeToLoginButton.addEventListener('click', () => {
			this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.LoginScene);
		});

		this.registrationButton.addEventListener('click', () => {
			this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.MainMenu);
		});
	}
}
