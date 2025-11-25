import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import type { IHtmlAssetManifest, IMapAssetManifest } from '@gametypes/assets.types';
import { SceneTypes } from '@gametypes/scene.types';
import type { AssetManager } from '@managers/AssetManager';

const styleModules = import.meta.glob('/src/styles/*.scss', {
	query: '?url',
	eager: true,
	import: 'default',
});

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
		let manifestEntry: IMapAssetManifest | IHtmlAssetManifest | undefined =
			this.assetManifest[scene.sceneKey] || this.stylesManifest[scene.sceneKey];

		if (scene.sceneType.has(SceneTypes.SystemScene)) {
			manifestEntry = { HTML: '__NONE__', CSS: '__PLACEHOLDER__' } as IHtmlAssetManifest;
		}

		if (!manifestEntry) {
			this.logger.error(`Не найдена запись в манифесте для сцены: ${scene.sceneKey}`);
		}

		const manifestTypeCheck = (
			entry: IMapAssetManifest | IHtmlAssetManifest,
		): entry is IHtmlAssetManifest => (entry as IHtmlAssetManifest)?.HTML !== undefined;

		// если HTML манифест, то обрабатываем соотв. образом
		if (manifestTypeCheck(manifestEntry)) {
			// manifestEntry.CSS изначально равен __PLACEHOLDER__, тут мы заменяем его либо на url реального scss, либо на undefuned (если не нашли)
			manifestEntry.CSS = styleModules[
				`/src/styles/${scene.sceneKey.charAt(0).toLowerCase().concat(scene.sceneKey.slice(1))}.scss`
			] as string;

			// manifestEntry != undefined
			if (!manifestEntry.CSS) {
				this.logger.error(`Не найден CSS в манифесте для сцены: ${scene.sceneKey}`);
			}
		}

		this.logger.debug(`Загрузка ассетов для сцены: ${scene.sceneKey}`);
		return originalMethod.call(this, ...args, manifestEntry);
	};

	return descriptor;
}
