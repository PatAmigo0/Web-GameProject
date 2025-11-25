import { AbstractAuthScene } from '@abstracts/scene-base/AbstractAuthScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { ErrorCode, type LoginDto, loginSchemaRule, passwordSchemaRule } from '@game/shared';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import { handleInputFormation, validateAuthDto } from '@utils/ui-utils/forms.util';

@SceneInfo(SceneKeys.LoginScene, SceneTypes.HTMLScene, { to: [SceneKeys.MainMenu, SceneKeys.SignupScene] })
export class LoginScene extends AbstractAuthScene<LoginDto> {
	public onPreload(): void {}

	public onCreate(): void {
		this.initAuthUI({
			loginSelector: '#login-input',
			passwordSelector: '#password-input',
			submitBtnSelector: '#loginBtn',
			switchBtnSelector: '#change-to-singup',
			switchTargetScene: SceneKeys.SignupScene,
		});
	}

	public heartbeat(): void {}
	public onShutdown(): void {}

	protected async getFormData(): Promise<LoginDto | null> {
		const loginDto: LoginDto = {
			login: this.loginInput.value,
			password: this.passwordInput.value,
		};

		if (!validateAuthDto.call(this, loginDto)) {
			this.onError('Неверные данные для входа');
			return null;
		}
		return loginDto;
	}

	protected sendRequest(data: LoginDto): Promise<Response> {
		return this.game.authService.login(data);
	}

	protected handleSpecificAuthErrors(code: ErrorCode): void {
		switch (code) {
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
}
