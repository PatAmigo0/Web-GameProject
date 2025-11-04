import type { AssetManager } from '@/managers/AssetManager';

export function ManifestExistsCheck<T extends AssetManager>(
	_: T,
	__: string,
	descriptor: PropertyDescriptor,
) {
	const originalMethod = descriptor.value;
	descriptor.value = function (this: T, ...args: any[]) {
		if (!this.manifestBuilt) {
			if (!this.manifestBuilt) {
				throw 'Ошибка [AssetManager]: Манифест ассетов еще не был создан. Вызовите AssetManager.buildManifest() в загрузочной сцене';
			}
		}
		return originalMethod.apply(this, args);
	};
	return descriptor;
}
