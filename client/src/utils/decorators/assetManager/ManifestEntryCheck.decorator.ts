import type { TypedScene } from '@abstracts/scenes/TypedScene';
import type { AssetManager } from '@services/AssetManager';
import type {
	MapAssetManifest,
	UIStylesManifest,
} from '@gametypes/phaser.types';

export function ManifestEntryCheck<T extends AssetManager>(
	_: T,
	__: string,
	descriptor: PropertyDescriptor,
) {
	const originalMethod = descriptor.value;
	descriptor.value = function (this: T, ...args: any[]) {
		const scene = args[0] as TypedScene;
		const manifestEntry: MapAssetManifest | UIStylesManifest | undefined =
			this.assetManifest[scene.sceneKey] ||
			this.stylesManifest[scene.sceneKey];

		if (!manifestEntry) {
			console.error(
				`[AssetManager] Не найдена запись в манифесте для сцены: ${scene.sceneKey}`,
			);
			return;
		}
		console.debug(
			`[AssetManager] Загрузка ассетов для сцены: ${scene.sceneKey}`,
		);
		return originalMethod.apply(this, [...args, manifestEntry]);
	};

	return descriptor;
}
