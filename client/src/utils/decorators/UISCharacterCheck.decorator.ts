import type { UserInputService } from '@services/UserInputService';

// UIS -> UserInputService

export function UISCharacterCheck<T extends UserInputService>(
	_: T,
	__: string,
	descriptor: PropertyDescriptor,
): PropertyDescriptor {
	const originalMethod = descriptor.value as Function;
	descriptor.value = function (this: T, ...args: any[]) {
		if (this.localCharacter) {
			return originalMethod.call(this, ...args);
		}
	};
	return descriptor;
}
