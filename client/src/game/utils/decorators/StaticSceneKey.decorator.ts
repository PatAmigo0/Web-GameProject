// utils/decorators/SceneKey.decorator.ts
export function StaticSceneKey(key: string) {
	return function (constructor: Function) {
		Object.defineProperty(constructor, 'sceneKey', {
			value: key,
			writable: false,
		});
	};
}
