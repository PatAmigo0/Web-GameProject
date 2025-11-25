import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';

export abstract class AbstractFormScene<TDto, TRes = Response> extends BaseHtmlScene {
	protected abstract submitButton: HTMLButtonElement;
	protected locked = false;

	protected async submitForm(): Promise<void> {
		if (this.locked) return;

		const dto = await this.getFormData();
		if (!dto) return;

		this.setLockState(true);

		try {
			const response = await this.sendRequest(dto);

			await this.onSuccess(response);
		} catch (error) {
			this.onError(error);
		} finally {
			this.setLockState(false);
		}
	}

	/**
	 * @returns Данные или null, если валидация не прошла
	 */
	protected abstract getFormData(): Promise<TDto | null>;

	/**
	 * Вызывает сервисы (AuthService, RoomService и т.д.)
	 */
	protected abstract sendRequest(data: TDto): Promise<TRes>;

	/**
	 * Логика при успешном ответе
	 */
	protected abstract onSuccess(response: TRes): Promise<void> | void;

	/**
	 * Логика при ошибке
	 */
	protected onError(error: any): void {
		this.logger.warn('Form submission failed', error);
		this.game.notificationService.show(`Произошла ошибка при отправке: ${error}`, 'error');
	}

	/**
	 * Управление визуальной блокировкой
	 */
	protected setLockState(isLocked: boolean): void {
		this.locked = isLocked;
		if (this.submitButton) {
			this.submitButton.disabled = isLocked;
		}
	}
}
