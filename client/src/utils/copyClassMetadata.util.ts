import type { BaseClass } from '@gametypes/core.types';

export function copyClassMetadata<T extends BaseClass>(from: T, to: T): T {
	for (const key of Object.getOwnPropertyNames(from)) {
		if (key == 'prototype' || key == 'name') continue;
		Object.defineProperty(to, key, Object.getOwnPropertyDescriptor(from, key)!);
	}

	Object.defineProperty(to, 'name', {
		value: from.name,
		writable: false,
	});
	return to;
}
