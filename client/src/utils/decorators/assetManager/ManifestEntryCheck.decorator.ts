import type { TypedScene } from '@abstracts/scenes/TypedScene';
import type {
	IHtmlAssetManifest,
	IMapAssetManifest,
} from '@gametypes/interface.types';
import type { AssetManager } from '@managers/AssetManager';

export function ManifestEntryCheck<T extends AssetManager>(
	_: T,
	__: string,
	descriptor: PropertyDescriptor,
) {
	const originalMethod = descriptor.value;
	descriptor.value = function (this: T, ...args: any[]) {
		const scene = args[0] as TypedScene;
		const manifestEntry:
			| IMapAssetManifest
			| IHtmlAssetManifest
			| undefined =
			this.assetManifest[scene.sceneKey] ||
			this.stylesManifest[scene.sceneKey];

		if (!manifestEntry) {
			throw `Ошибка [AssetManager] Не найдена запись в манифесте для сцены: ${scene.sceneKey}`;
		}

		console.debug(
			`[AssetManager] загрузка ассетов для сцены: ${scene.sceneKey}`,
		);
		return originalMethod.apply(this, [...args, manifestEntry]);
	};

	return descriptor;
}
