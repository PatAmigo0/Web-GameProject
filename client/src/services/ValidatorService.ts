import type { Logger } from '@components/shared/LoggerComponent';
import { injectLogger } from '@decorators/injectLogger.decorator';
import type { ZodError, ZodType } from 'zod';

@injectLogger()
export class ValidatorService {
	private declare logger: Logger;
	private lastError!: ZodError;

	public validateData(data: any, schema: ZodType<any, any>): boolean {
		try {
			schema.parse(data);
			return true;
		} catch (e) {
			// this.logger.warn('Ошибка валидации:', (e as ZodError).issues);
			this.lastError = e as ZodError;
			return false;
		}
	}

	public getLastError() {
		if (!this.lastError) {
			this.logger.warn('Последней ошибки нет');
			return;
		}

		return this.lastError;
	}
}
