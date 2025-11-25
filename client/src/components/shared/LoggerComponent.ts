export class Logger {
	constructor(private context: string) {}

	private format(baseLog: string): string {
		return `[${this.context}]: ${baseLog}`;
	}

	public debug(log: string, ...args: any[]) {
		if (!__LOGGER_ENABLED__) return;
		console.debug(`{DEBUG} ${this.format(log)}`, ...args);
	}

	public log(log: string, ...args: any[]) {
		if (!__LOGGER_ENABLED__) return;
		console.log(`{LOG} ${this.format(log)}`, ...args);
	}

	public warn(log: string, ...args: any[]) {
		if (!__LOGGER_ENABLED__) return;
		console.warn(`{WARN} ${this.format(log)}`, ...args);
	}

	public error(log: string, ...args: any[]) {
		if (__LOGGER_ENABLED__) {
			console.error(`{ERROR} ${this.format(' - [PARAMS] - ')}`, ...args);
		}
		throw new Error(this.format(log));
	}

	public quietError(log: string, ...args: any[]) {
		if (!__LOGGER_ENABLED__) return;
		console.error(`{QUIET ERROR} ${log}`, ...args);
	}
}
