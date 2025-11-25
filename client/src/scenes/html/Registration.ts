import { AbstractAuthScene } from '@abstracts/scene-base/AbstractAuthScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { ErrorCode, type RegisterDto, loginSchemaRule, passwordSchemaRule } from '@game/shared';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import { handleInputFormation, validateAuthDto } from '@utils/ui-utils/forms.util';

@SceneInfo(SceneKeys.SignupScene, SceneTypes.HTMLScene, { to: [SceneKeys.MainMenu, SceneKeys.LoginScene] })
export class RegistrationScene extends AbstractAuthScene<RegisterDto> {
	private confirmPasswordInput!: HTMLInputElement;
	private isPasswordConfirmed = false;

	public onPreload(): void {}

	public onCreate(): void {
		this.initAuthUI({
			loginSelector: '#login-input',
			passwordSelector: '#password-input',
			submitBtnSelector: '#registerBtn',
			switchBtnSelector: '#change-to-login',
			switchTargetScene: SceneKeys.LoginScene,
		});

		this.confirmPasswordInput = this.div.querySelector('#confirm-password-input') as HTMLInputElement;

		this.listenEvent({
			element: this.confirmPasswordInput,
			event: 'input',
			callback: () => this.validateConfirmPassword(),
		});
	}

	public heartbeat(): void {}
	public onShutdown(): void {}

	protected onPasswordInput(): void {
		super.onPasswordInput();
		this.validateConfirmPassword();
	}

	private validateConfirmPassword() {
		this.isPasswordConfirmed = handleInputFormation.call(this, this.confirmPasswordInput, () => {
			const isMainPasswordValid = passwordSchemaRule.safeParse(this.passwordInput.value).success;
			return isMainPasswordValid && this.passwordInput.value === this.confirmPasswordInput.value;
		});
	}

	protected async getFormData(): Promise<RegisterDto | null> {
		const registerDto: RegisterDto = {
			login: this.loginInput.value,
			password: this.passwordInput.value,
		};

		if (!this.isPasswordConfirmed || !validateAuthDto.call(this, registerDto)) {
			this.onError('Неверные данные для регистрации');
			return null;
		}
		return registerDto;
	}

	protected sendRequest(data: RegisterDto): Promise<Response> {
		return this.game.authService.register(data);
	}

	protected handleSpecificAuthErrors(code: ErrorCode): void {
		if (code === ErrorCode.LoginTaken) {
			this.loginInput.value = '';
			handleInputFormation.call(this, this.loginInput, loginSchemaRule);
			this.game.notificationService.show('Этот логин уже занят', 'error');
		} else {
			this.logger.warn(`Неизвестная ошибка регистрации: ${code}`);
		}
	}
}
