import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import {
	ErrorCode,
	loginSchemaRule,
	passwordSchemaRule,
	type ApiResponse,
	type LoginDto,
} from '@game/shared';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import { handleInputFormation, validateDto } from '@utils/ui-utils/forms.util';

@SceneInfo(SceneKeys.LoginScene, SceneTypes.HTMLScene, { to: [SceneKeys.MainMenu, SceneKeys.SignupScene] })
export class LoginScene extends BaseHtmlScene {
	private changeToSignUpButton!: HTMLButtonElement;
	private loginButton!: HTMLButtonElement;

	private loginInput!: HTMLInputElement;
	private passwordInput!: HTMLInputElement;
	private locked = false;

	public onPreload(): void {}
	public onCreate(): void {
		this._init_class_attributes();
		this._init_click_events();
	}

	public heartbeat(): void {}
	public onShutdown(): void {}

	private _init_class_attributes() {
		this.changeToSignUpButton = this.div.querySelector('#change-to-singup') as HTMLButtonElement;
		this.loginButton = this.div.querySelector('#loginBtn') as HTMLButtonElement;
		this.loginInput = this.div.querySelector('#login-input');
		this.passwordInput = this.div.querySelector('#password-input');
	}

	private _init_click_events() {
		this.changeToSignUpButton.addEventListener('click', () => {
			this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.SignupScene);
		});

		this.loginButton.addEventListener('click', async () => {
			if (this.locked) return;
			const loginDto = { login: this.loginInput.value, password: this.passwordInput.value } as LoginDto;

			if (!validateDto.call(this, loginDto)) {
				this.game.notificationService.show('Неверные данные для входа', 'error');
				return;
			}

			this.locked = true;
			const response = await this.game.authService.login(loginDto);
			if (response.ok) this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.MenuWrapper);
			else {
				const data = (await response.json()) as ApiResponse;
				this.game.notificationService.show(`Ошибка регистрации: ${data.error.code}`, 'error');

				switch (data.error.code) {
					case ErrorCode.UserNotFound:
						this.loginInput.value = '';
						handleInputFormation.call(this, this.loginInput, loginSchemaRule);
						break;
					case ErrorCode.UserWrongPassword:
						this.passwordInput.value = '';
						handleInputFormation.call(this, this.passwordInput, passwordSchemaRule);
						break;
				}
			}
			this.locked = false;
		});

		this.loginInput.addEventListener('input', () => {
			handleInputFormation.call(this, this.loginInput, loginSchemaRule);
		});

		this.passwordInput.addEventListener('input', () => {
			handleInputFormation.call(this, this.passwordInput, passwordSchemaRule);
		});
	}
}
