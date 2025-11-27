import type { Logger } from '@components/shared/LoggerComponent';
import { injectLogger } from '@decorators/injectLogger.decorator';
import type { ZodError, ZodType } from 'zod';

@injectLogger()
export class ValidatorService {
	private declare logger: Logger;
	private lastError!: ZodError;
	private lastData!: any;

	public validateData<T = any>(data: any, schema: ZodType<any, any>): boolean {
		try {
			this.lastData = schema.parse(data) as T;
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

	public getLastData<T = any>() {
		if (!this.lastError) {
			this.logger.warn('Невозможно получить последние данные');
			return;
		}

		return this.lastData as T;
	}
}
