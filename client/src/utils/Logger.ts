// logger.ts
export class Logger {
	constructor(private context: string) {}

	private format(baseLog: string): string {
		return `[${this.context}]: ${baseLog}`;
	}

	public debug(log: string, ...args: any[]) {
		console.debug(`{DEBUG} ${this.format(log)}`, ...args);
	}

	public log(log: string, ...args: any[]) {
		console.log(`{LOG} ${this.format(log)}`, ...args);
	}

	public warn(log: string, ...args: any[]) {
		console.warn(`{WARN} ${this.format(log)}`, ...args);
	}
}
