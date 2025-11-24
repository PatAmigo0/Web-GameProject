import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import {
	credentialsBase,
	MAX_LOGIN_LENGTH,
	MAX_PASSWORD_LENGTH,
	MAX_ROOM_NAME_LENGTH,
	ValidationMessage,
	type AuthCredentials,
} from '@game/shared';
import type { ZodType } from 'zod';

const toggle = (input: HTMLInputElement, success?: boolean) => {
	if (success) {
		input.classList.add('success');
		input.classList.remove('error');
		return;
	}
	input.classList.add('error');
	input.classList.remove('success');
};

const clampInput = (input: HTMLInputElement, max: number) => {
	input.value = input.value.slice(0, max);
};

export function handleInputFormation<T extends CoreScene>(
	this: T,
	input: HTMLInputElement,
	check: ZodType<any, any> | Function,
) {
	input.classList.remove('error', 'success');
	if (input.value.length == 0) return;

	let success;
	if (typeof check === 'function') {
		success = check();
		toggle(input, success);
	} else {
		success = this.game.validatorService.validateData(input.value, check);

		if (success) {
			toggle(input, true);
		} else {
			toggle(input);

			let lengthError = false;
			let englishError = false;

			const error = this.game.validatorService.getLastError();

			error.issues.forEach((issue) => {
				switch (issue.message) {
					case ValidationMessage.LoginTooLong:
						lengthError = true;
						clampInput(input, MAX_LOGIN_LENGTH);
						break;
					case ValidationMessage.PasswordTooLong:
						lengthError = true;
						clampInput(input, MAX_PASSWORD_LENGTH);
						break;
					case ValidationMessage.RoomNameTooLong:
						lengthError = true;
						clampInput(input, MAX_ROOM_NAME_LENGTH);
						break;
					case ValidationMessage.OnlyEnglish:
						englishError = true;
						break;
				}
			});

			if (lengthError && !englishError) {
				toggle(input, true);
			} else if (lengthError && englishError) {
				// trying againg after the first one (after the main data formation)
				success = this.game.validatorService.validateData(input.value, check);
				if (success) toggle(input, true);
			}
		}
	}

	return success;
}

export function validateAuthDto<T extends CoreScene>(this: T, dto: AuthCredentials): boolean {
	const success = this.game.validatorService.validateData(dto, credentialsBase);
	return success;
}
