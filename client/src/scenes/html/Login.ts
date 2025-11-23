import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { loginSchemaRule, passwordSchemaRule } from '@game/shared';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import { handleInputFormation } from '@utils/input.util';

@SceneInfo(SceneKeys.LoginScene, SceneTypes.HTMLScene, { to: [SceneKeys.MainMenu, SceneKeys.SignupScene] })
export class LoginScene extends BaseHtmlScene {
	private changeToSignUpButton!: HTMLButtonElement;
	private loginButton!: HTMLButtonElement;

	private loginInput!: HTMLInputElement;
	private passwordInput!: HTMLInputElement;

	public onPreload(): void {}
	public onCreate(): void {
		this._init_class_attributes();
		this._init_click_events();
	}

	public heartbeat(): void {}
	public onShutdown(): void {}

	private _init_class_attributes() {
		this.changeToSignUpButton = this.div.querySelector('#change-to-login') as HTMLButtonElement;
		this.loginButton = this.div.querySelector('#loginBtn') as HTMLButtonElement;
		this.loginInput = this.div.querySelector('#login-input');
		this.passwordInput = this.div.querySelector('#password-input');
	}

	private _init_click_events() {
		this.changeToSignUpButton.addEventListener('click', () => {
			this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.SignupScene);
		});

		this.loginButton.addEventListener('click', () => {
			this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.MenuWrapper);
		});

		this.loginInput.addEventListener('input', () => {
			handleInputFormation.call(this, this.loginInput, loginSchemaRule);
		});

		this.passwordInput.addEventListener('input', () => {
			handleInputFormation.call(this, this.passwordInput, passwordSchemaRule);
		});
	}
}
