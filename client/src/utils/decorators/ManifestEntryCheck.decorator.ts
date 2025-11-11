import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import type { IHtmlAssetManifest, IMapAssetManifest } from '@gametypes/assets.types';
import type { AssetManager } from '@managers/AssetManager';

export function ManifestEntryCheck<T extends AssetManager>(
	_: T,
	__: string,
	descriptor: PropertyDescriptor,
): PropertyDescriptor {
	const originalMethod = descriptor.value;
	descriptor.value = function (this: T, ...args: any[]) {
		const scene = args[0] as CoreScene;
		const manifestEntry: IMapAssetManifest | IHtmlAssetManifest | undefined =
			this.assetManifest[scene.sceneKey] || this.stylesManifest[scene.sceneKey];

		if (!manifestEntry) {
			throw `Ошибка [AssetManager] Не найдена запись в манифесте для сцены: ${scene.sceneKey}`;
		}

		console.debug(`[AssetManager] загрузка ассетов для сцены: ${scene.sceneKey}`);
		return originalMethod.apply(this, [...args, manifestEntry]);
	};

	return descriptor;
}
