// SceneKey.decorator.ts

export function SceneKey(key: string) {
	return function <T extends { new (...args: any[]): {} }>(constructor: T) {
		return class extends constructor {
			constructor(...args: any[]) {
				super(key, ...args);
			}
		};
	};
}
