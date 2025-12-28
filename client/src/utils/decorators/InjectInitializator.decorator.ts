import type { BaseClass, IInitializiable } from '@gametypes/core.types';
import { copyClassMetadata } from '@utils/CopyClassMetadata';
import { ObjectUtils } from '@utils/ObjectUtils';

export function injectInitializator(initLogic: (instance: any, ...args: any[]) => void) {
	return function <T extends BaseClass>(constructor: T) {
		return copyClassMetadata(
			constructor,
			class extends constructor implements IInitializiable {
				private __initialized__ = false;
				public init(...args: any) {
					if (!this.__initialized__) {
						this.__initialized__ = true;
						ObjectUtils.freezeProperty(this, '__initialized__');
						return initLogic(this, ...args);
					}
				}
			},
		);
	};
}
