import { Logger } from '@components/shared/LoggerComponent';
import type { BaseClass, IInitializiable } from '@gametypes/core.types';
import { copyClassMetadata } from '@utils/copyClassMetadata.util';
import { ObjectUtils } from '@utils/Object.util';

export function injectInitializator(initLogic: (instance: any, ...args: any[]) => Promise<any>) {
	return function <T extends BaseClass>(constructor: T) {
		class InitializableClass extends constructor implements IInitializiable {
			// @ts-ignore
			private __initialized__ = false;
			// @ts-ignore
			private __initializing__ = false;

			constructor(...args: any[]) {
				super(...args);

				return new Proxy(this, {
					get: (target: any, prop: string | symbol, receiver: any) => {
						const value = Reflect.get(target, prop, receiver);

						if (prop === 'init' || typeof value !== 'function') {
							return value;
						}

						if (target.__initialized__ || target.__initializing__) {
							return value;
						}

						return (): any => {
							const logger = new Logger(target.constructor.name);
							logger.warn(`Вызов метода '${String(prop)}' пропущен: сервис не готов.`);
							return undefined;
						};
					},
				});
			}

			public async init(...args: any[]) {
				const logger = new Logger(this.constructor.name);
				if (!this.__initialized__) {
					this.__initializing__ = true;

					try {
						await initLogic(this, ...args);

						this.__initialized__ = true;
						ObjectUtils.freezeProperty(this, '__initialized__');
					} catch (error) {
						logger.error(`Ошибка при инициализации ${this.constructor.name}`, error);
					} finally {
						this.__initializing__ = false;
					}
				} else {
					const logger = new Logger(this.constructor.name);
					logger.warn('Сервис уже инициализирован. Почему произошла вторая авторизация???');
				}
			}
		}

		return copyClassMetadata(constructor, InitializableClass);
	};
}
