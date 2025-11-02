//#region IMPORTS
// импортируем наш кастомный тип сцены, чтобы Phaser знал про sceneKey
import { ASSET_KEYS, ASSET_URLS } from '@config/assets.config';
import type { TypedScene } from '@core/abstracts/TypedScene';
import type { MapAssetManifest } from '@gametypes/phaser.types';

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
	private static readonly assetManifest: Record<string, MapAssetManifest> =
		{};

	// флаг, что манифест собран, чтобы случайно не начать грузить ассеты раньше времени
	private static manifestBuilt = false;
	//#endregion

	//#region PUBLIC STATIC METHODS
	/**
     * СИНХРОННО: Загружает ассеты для указанной сцены, используя запись
     * из предварительно созданного манифеста
     * @param scene Сцена, в которую нужно загрузить ассеты

     */
	public static loadMapAssets(scene: TypedScene): void {
		// проверочка, что buildManifest() уже отработал

		if (!this.manifestBuilt) {
			console.error(
				'Ошибка [AssetManager]: Манифест ассетов еще не был создан. Вызовите AssetManager.buildManifest() в загрузочной сцене',
			);
			return;
		}

		// по ключу сцены (типа 'test_place') находим нужные ей ассеты
		const manifestEntry = this.assetManifest[scene.sceneKey];
		if (!manifestEntry) {
			console.error(
				`[AssetManager] Не найдена запись в манифесте для сцены: ${scene.sceneKey}`,
			);
			return;
		}

		console.log(
			`[AssetManager] Загрузка ассетов для сцены: ${scene.sceneKey}`,
		);

		// Загружаем все необходимые изображения тайлсетов
		for (const url of manifestEntry.tilesetUrls) {
			// ключ для Phaser - это просто имя файла без расширения
			const tilesetKey = url.split('/').pop()!.replace('.png', '');

			// мелкая оптимизация: не грузить картинку, если она уже есть
			if (!scene.textures.exists(tilesetKey))
				scene.load.image(tilesetKey, url);
		}

		// Загружаем JSON карту
		scene.load.tilemapTiledJSON(scene.sceneKey, manifestEntry.mapJsonUrl);
	}

	/**
	 * АСИНХРОННО: Этот метод должен быть вызван ОДИН РАЗ при запуске игры
	 * (например, в BootScene), до загрузки игровых сцен
	 */
	public static async buildManifest(): Promise<void> {
		if (this.manifestBuilt) return;

		const response = await fetch(ASSET_URLS[ASSET_KEYS.MAPS_MANIFEST]);
		const manifestData = (await response.json()) as Record<
			string,
			MapAssetManifest
		>;

		Object.assign(this.assetManifest, manifestData);

		this.manifestBuilt = true;
		console.log(
			'[AssetManager] Манифест ассетов успешно создан',

			this.assetManifest,
		);
	}
	//#endregion
}
//#endregion
