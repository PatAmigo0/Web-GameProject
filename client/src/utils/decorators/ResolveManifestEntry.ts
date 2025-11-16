import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import type { IHtmlAssetManifest, IMapAssetManifest } from '@gametypes/assets.types';
import type { AssetManager } from '@managers/AssetManager';

export function resolveManifestEntry<T extends AssetManager>(
	_: T,
	__: string,
	descriptor: PropertyDescriptor,
): PropertyDescriptor {
	const originalMethod = descriptor.value as Function;
	descriptor.value = function (this: T, ...args: any[]) {
		if (!this.manifestBuilt) {
			this.logger.error(
				'Манифест ассетов еще не был создан. Вызовите AssetManager.buildManifest() в загрузочной сцене',
			);
		}

		const scene = args[0] as CoreScene;
		const manifestEntry: IMapAssetManifest | IHtmlAssetManifest | undefined =
			this.assetManifest[scene.sceneKey] || this.stylesManifest[scene.sceneKey];

		if (!manifestEntry) {
			this.logger.error(`Не найдена запись в манифесте для сцены: ${scene.sceneKey}`);
		}

		this.logger.debug(`Загрузка ассетов для сцены: ${scene.sceneKey}`);
		return originalMethod.call(this, ...args, manifestEntry);
	};

	return descriptor;
}
