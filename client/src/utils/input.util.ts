import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import { MAX_LOGIN_LENGTH, MAX_PASSWORD_LENGTH, ValidationMessage } from '@game/shared';
import type { ZodType } from 'zod';

const toggleError = (input: HTMLInputElement) => {
	input.classList.add('error');
};

const toggleSuccess = (input: HTMLInputElement) => {
	input.classList.add('success');
};

export function handleInputFormation<T extends CoreScene>(
	this: T,
	input: HTMLInputElement,
	schema: ZodType<any, any>,
) {
	const success = this.game.validatorService.validateData(input.value, schema);
	input.classList.remove('error', 'success');

	if (success) {
		toggleSuccess(input);
	} else {
		if (input.value.length > 0) {
			toggleError(input);
			const error = this.game.validatorService.getLastError();
			switch (error) {
				case ValidationMessage.LoginTooLong:
					input.value = input.value.slice(0, MAX_LOGIN_LENGTH + 1);
					break;
				case ValidationMessage.PasswordTooLong:
					input.value = input.value.slice(0, MAX_PASSWORD_LENGTH + 1);
					break;
			}
		}
	}
}
