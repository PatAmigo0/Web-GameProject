// src/utils/Logger.ts (или где он у вас лежит)

export class Logger {
	constructor(private context: string) {}

	private format(baseLog: string): string {
		return `[${this.context}]: ${baseLog}`;
	}

	// ИСПОЛЬЗУЙТЕ ЭТОТ СИНТАКСИС (МЕТОД)
	public debug(log: string, ...args: any[]) {
		if (!__LOGGER_ENABLED__) return;
		console.debug(`{DEBUG} ${this.format(log)}`, ...args);
	}

	// И ЭТОТ
	public log(log: string, ...args: any[]) {
		if (!__LOGGER_ENABLED__) return;
		console.log(`{LOG} ${this.format(log)}`, ...args);
	}

	// И ЭТОТ
	public warn(log: string, ...args: any[]) {
		if (!__LOGGER_ENABLED__) return;
		console.warn(`{WARN} ${this.format(log)}`, ...args);
	}

	// НЕ ИСПОЛЬЗУЙТЕ: public warn = () => {};

	public error(log: string, ...args: any[]) {
		if (__LOGGER_ENABLED__) {
			console.error(`{ERROR} ${this.format(' - [PARAMS] - ')}`, ...args);
		}
		throw this.format(log);
	}
}
