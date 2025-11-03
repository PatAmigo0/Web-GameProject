//#region IMPORTS
import { ASSET_KEYS, ASSET_URLS } from '@config/assets.config';
import type { TypedScene } from '@abstracts/scenes/TypedScene';
import type {
	MapAssetManifest,
	UIStylesManifest,
} from '@gametypes/phaser.types';
import { BaseHtmlScene } from '@/core/abstracts/scenes/BaseHtmlScene';
import { ManifestExistsCheck } from '@decorators/assetManager/ManifestExistsCheck.decorator';
import { ManifestEntryCheck } from '@decorators/assetManager/ManifestEntryCheck.decorator';
import { SceneTypes } from '@gametypes/scene.types';
//#endregion

//#region CLASS DEFINITION
/**
 * Статический класс для управления ассетами
 * Отвечает за создание манифеста (списка всех ассетов) при запуске
 * и за загрузку нужных ассетов для каждой конкретной сцены
 */
export class AssetManager {
	//#region STATIC STATE
	// Этот манифест будет хранить все заранее найденные пути к ассетам для каждой карты
	// Это словарь, сопоставляющий ключ сцены (например, 'test_place') со списком её ассетов
	public static readonly assetManifest: Record<string, MapAssetManifest> = {};
	assetManifest: Record<string, MapAssetManifest>;

	public static readonly stylesManifest: Record<string, MapAssetManifest> =
		{};
	stylesManifest: Record<string, MapAssetManifest>;

	// флаг, что манифест собран, чтобы случайно не начать грузить ассеты раньше времени
	public static manifestBuilt = false;
	manifestBuilt: boolean;
	//#endregion

	//#region PUBLIC STATIC METHODS
	/**
	 * Метод AssetManager, который сам выбирает как ему загружать сценц
	 * @param scene поддерживаемый тип сцены
	 */
	public static loadAssets(scene: TypedScene | BaseHtmlScene): void {
		switch (scene.sceneType) {
			case SceneTypes.GameScene:
				this.loadMapAssets(scene);
				break;
			case SceneTypes.UIScene:
				if (!(scene instanceof BaseHtmlScene)) {
					console.error('Не UI сцена имеет тип UI, ошибка');
					break;
				}
				this.loadHtmlAssets(scene);
				break;
			default:
				console.warn(
					'Тип сцены не поддерживается для загрузки ассетов',
				);
		}
	}

	/**
	 * СИНХРОННО: Загружает ассеты для указанной сцены, используя запись
	 * из предварительно созданного манифеста
	 * @param scene Сцена, в которую нужно загрузить ассеты
	 */
	@ManifestEntryCheck // 2
	@ManifestExistsCheck // 1
	public static loadMapAssets(
		scene: TypedScene,
		manifestEntry?: MapAssetManifest,
	): void {
		// Загружаем все необходимые изображения тайлсетов
		for (const url of manifestEntry.tilesetUrls) {
			// ключ для Phaser - это просто имя файла без расширения
			const tilesetKey = url.split('/').pop()!.replace('.png', '');
			if (!scene.textures.exists(tilesetKey))
				scene.load.image(tilesetKey, url);
		}

		// Загружаем JSON карту
		scene.load.tilemapTiledJSON(scene.sceneKey, manifestEntry.mapJsonUrl);
	}

	/**
	 * СИНХРОННО: Загружает ассеты для указанной ui сцены (html / scc)
	 * из предварительно созданного манифеста (stylesManifest)
	 * @param scene Сцена, в которую нужно загрузить ассеты
	 */
	@ManifestEntryCheck // 2
	@ManifestExistsCheck // 1
	public static loadHtmlAssets(
		scene: BaseHtmlScene,
		manifestEntry?: UIStylesManifest,
	): void {
		scene.load.html(scene.sceneKey, manifestEntry.HTML);
		scene.loadCSS(manifestEntry.CSS);
	}

	/**
	 * АСИНХРОННО: Этот метод должен быть вызван ОДИН РАЗ при запуске игры
	 * (например, в BootScene), до загрузки игровых сцен
	 */
	public static async buildManifest(): Promise<void> {
		if (this.manifestBuilt) return;

		// Map manifest
		let response = await fetch(ASSET_URLS[ASSET_KEYS.MAP_MANIFEST]);
		let manifestData = (await response.json()) as Record<
			string,
			MapAssetManifest
		>;
		Object.assign(this.assetManifest, manifestData);

		// Html manifest
		response = await fetch(ASSET_URLS[ASSET_KEYS.HTML_MANIFEST]);
		manifestData = (await response.json()) as Record<
			string,
			MapAssetManifest
		>;
		Object.assign(this.stylesManifest, manifestData);

		this.manifestBuilt = true;
		console.log(
			'[AssetManager] Манифест ассетов успешно создан',
			this.assetManifest,
			this.stylesManifest,
		);
	}
	//#endregion
}
//#endregion
