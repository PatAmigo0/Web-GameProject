// SceneInfo.decorator.ts

export function SceneInfo(sceneKey: string, sceneType: string) {
	return function <T extends { new (...args: any[]): {} }>(constructor: T) {
		return class extends constructor {
			constructor(...args: any[]) {
				super(sceneKey, sceneType, ...args);
			}
		};
	};
}
