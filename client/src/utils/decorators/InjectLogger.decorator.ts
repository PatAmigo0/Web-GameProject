import type { BaseClass } from '@gametypes/core.types';
import { Logger } from '@utils/Logger';

export function injectLogger(config?: { loggerKey?: string; static?: boolean }) {
	return function <T extends BaseClass>(constructor: T) {
		const loggerPropertyKey = config?.loggerKey ?? 'logger';
		Object.defineProperty(config?.static ? constructor : constructor.prototype, loggerPropertyKey, {
			configurable: true,
			enumerable: false,
			// ленивый геттер
			get() {
				const logger = new Logger(constructor.name);
				Object.defineProperty(this, loggerPropertyKey, {
					value: logger,
					writable: true,
				});
				return logger;
			},
		});
	};
}
