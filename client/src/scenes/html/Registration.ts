import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import {
	ErrorCode,
	loginSchemaRule,
	passwordSchemaRule,
	type ApiResponse,
	type RegisterDto,
} from '@game/shared';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import { handleInputFormation, validateAuthDto } from '@utils/ui-utils/forms.util';

@SceneInfo(SceneKeys.SignupScene, SceneTypes.HTMLScene, { to: [SceneKeys.MainMenu, SceneKeys.LoginScene] })
export class RegistrationScene extends BaseHtmlScene {
	private changeToLoginButton!: HTMLButtonElement;
	private registrationButton!: HTMLButtonElement;
	private loginInput!: HTMLInputElement;
	private passwordInput!: HTMLInputElement;
	private confirmPassowrdInput!: HTMLInputElement;

	private passwordConfirm = false;
	private locked = false;

	public onPreload(): void {}

	public onCreate(): void {
		this._init_class_attributes();
		this._init_click_events();
	}

	public heartbeat(): void {}
	public onShutdown(): void {}

	private _init_class_attributes() {
		this.changeToLoginButton = this.div.querySelector('#change-to-login') as HTMLButtonElement;
		this.registrationButton = this.div.querySelector('#registerBtn') as HTMLButtonElement;
		this.loginInput = this.div.querySelector('#login-input');
		this.passwordInput = this.div.querySelector('#password-input');
		this.confirmPassowrdInput = this.div.querySelector('#confirm-password-input');
	}

	private _init_click_events() {
		const passwordValidator = (type: 'password' | 'confirm') => {
			const input = (type == 'password' && this.passwordInput) || this.confirmPassowrdInput;
			const success = handleInputFormation.call(this, input, passwordSchemaRule);
			this.passwordConfirm = handleInputFormation.call(this, this.confirmPassowrdInput, () => {
				return (success && this.passwordInput.value === this.confirmPassowrdInput.value) || false;
			});
		};

		this.listenEvent({
			element: this.changeToLoginButton,
			event: 'click',
			callback: () => {
				this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.LoginScene);
			},
		});

		this.listenEvent({
			element: this.registrationButton,
			event: 'click',
			callback: async () => {
				if (this.locked) return;
				const registerDto = {
					login: this.loginInput.value,
					password: this.passwordInput.value,
				} as RegisterDto;

				if (!this.passwordConfirm || !validateAuthDto.call(this, registerDto)) {
					this.game.notificationService.show('Неверные данные для регистрации', 'error');
					return;
				}

				this.locked = true;
				const response = await this.game.authService.register(registerDto);
				if (response.ok) this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.MenuWrapper);
				else {
					const data = (await response.json()) as ApiResponse;
					this.game.notificationService.show(`Ошибка регистрации: ${data.error.code}`, 'error');

					switch (data.error.code) {
						case ErrorCode.LoginTaken:
							this.loginInput.value = '';
							handleInputFormation.call(this, this.loginInput, loginSchemaRule);
							break;
						case ErrorCode.RateLimitExceed:
							this.logger.debug('Мы в муте сервером');
							break;
						default:
							this.logger.warn('Мне пришла доволи неизвестная ошибка, почему?');
					}
				}
				this.locked = false;
			},
		});

		this.listenEvent({
			element: this.loginInput,
			event: 'input',
			callback: () => {
				handleInputFormation.call(this, this.loginInput, loginSchemaRule);
			},
		});

		this.listenEvent({
			element: this.passwordInput,
			event: 'input',
			callback: () => {
				passwordValidator('password');
			},
		});

		this.listenEvent({
			element: this.confirmPassowrdInput,
			event: 'input',
			callback: () => {
				passwordValidator('confirm');
			},
		});
	}
}
