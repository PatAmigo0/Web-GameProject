import type { TypedScene } from '@abstracts/scene/TypedScene';
import type {
	IHtmlAssetManifest,
	IMapAssetManifest,
} from '@gametypes/interface.types';
import type { AssetManager } from '@managers/AssetManager';

export function ManifestEntryCheck(
	_: typeof AssetManager,
	__: string,
	descriptor: PropertyDescriptor,
): PropertyDescriptor {
	const originalMethod = descriptor.value;
	descriptor.value = function (this: typeof AssetManager, ...args: any[]) {
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
