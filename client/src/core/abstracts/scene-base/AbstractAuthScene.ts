import { type ApiResponse, ErrorCode, loginSchemaRule, passwordSchemaRule } from '@game/shared';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys } from '@gametypes/scene.types';
import { handleInputFormation } from '@utils/ui-utils/forms.util';
import { AbstractFormScene } from './AbstractFormScene'; // Тот самый общий класс форм

export abstract class AbstractAuthScene<T> extends AbstractFormScene<T, Response> {
	protected loginInput!: HTMLInputElement;
	protected passwordInput!: HTMLInputElement;
	protected switchSceneButton!: HTMLButtonElement;
	protected submitButton!: HTMLButtonElement;

	protected initAuthUI(config: {
		loginSelector: string;
		passwordSelector: string;
		submitBtnSelector: string;
		switchBtnSelector: string;
		switchTargetScene: SceneKeys;
	}) {
		this.loginInput = this.div.querySelector(config.loginSelector) as HTMLInputElement;
		this.passwordInput = this.div.querySelector(config.passwordSelector) as HTMLInputElement;
		this.submitButton = this.div.querySelector(config.submitBtnSelector) as HTMLButtonElement; // Поле родителя AbstractFormScene
		this.switchSceneButton = this.div.querySelector(config.switchBtnSelector) as HTMLButtonElement;

		this.listenEvent({
			element: this.loginInput,
			event: 'input',
			callback: () => handleInputFormation.call(this, this.loginInput, loginSchemaRule),
		});

		this.listenEvent({
			element: this.passwordInput,
			event: 'input',
			callback: () => this.onPasswordInput(),
		});

		this.listenEvent({
			element: this.submitButton,
			event: 'click',
			callback: () => this.submitForm(),
		});

		this.listenEvent({
			element: this.switchSceneButton,
			event: 'click',
			callback: () => {
				this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, config.switchTargetScene);
			},
		});
	}

	protected onPasswordInput(): void {
		handleInputFormation.call(this, this.passwordInput, passwordSchemaRule);
	}

	protected async onSuccess(response: Response): Promise<void> {
		if (response.ok) {
			this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.MenuWrapper);
		} else {
			const data = (await response.json()) as ApiResponse;
			this.game.notificationService.show(`Ошибка аунтефикации: ${data.error.code}`, 'error');

			if (data.error.code === ErrorCode.RateLimitExceed) {
				this.logger.debug('Мы в муте сервером (Rate Limit)');
				return;
			}

			this.handleSpecificAuthErrors(data.error.code);
		}
	}

	/**
	 * Этот метод должен реализовать конкретный класс (Login или Registration),
	 * чтобы обработать свои уникальные коды ошибок.
	 */
	protected abstract handleSpecificAuthErrors(code: ErrorCode): void;
}
