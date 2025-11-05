import type { AssetManager } from '@/managers/AssetManager';

export function ManifestExistsCheck(
	_: typeof AssetManager,
	__: string,
	descriptor: PropertyDescriptor,
): PropertyDescriptor {
	const originalMethod = descriptor.value;
	descriptor.value = function (this: typeof AssetManager, ...args: any[]) {
		if (!this.manifestBuilt) {
			if (!this.manifestBuilt) {
				throw 'Ошибка [AssetManager]: Манифест ассетов еще не был создан. Вызовите AssetManager.buildManifest() в загрузочной сцене';
			}
		}
		return originalMethod.apply(this, args);
	};
	return descriptor;
}
