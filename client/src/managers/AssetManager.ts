//#region IMPORTS
import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import { BaseService } from '@abstracts/service-base/BaseService';
import { ASSET_KEYS, ASSET_URLS } from '@config/assets.config';
import { ManifestEntryCheck } from '@decorators/ManifestEntryCheck.decorator';
import { ManifestExistsCheck } from '@decorators/ManifestExistsCheck.decorator';
import type { IHtmlAssetManifest, IMapAssetManifest } from '@gametypes/assets.types';
import { SceneTypes } from '@gametypes/scene.types';
import { StyleManager } from './StyleManager';
//#endregion

//#region CLASS DEFINITION
/**
 * Класс для управления ассетами
 *
 * Отвечает за создание манифеста (списка всех ассетов) при запуске
 * и за загрузку нужных ассетов для каждой конкретной сцены
 */
export class AssetManager extends BaseService {
	//#region ATTRIBUTES
	/**
	 * Этот манифест будет хранить все заранее найденные пути к ассетам для каждой карты
	 *
	 * Это словарь, сопоставляющий ключ сцены (например, 'test_place') со списком её ассетов
	 */
	public readonly assetManifest: Record<string, IMapAssetManifest> = {};

	/**
	 * Этот манифест будет хранить все заранее найденные пути в html и css для каждой HTML сцены
	 *
	 * Это словарь, сопоставляющий ключ сцены (например, 'Login') с хранилищем путей (по одному) к HTML и CSS файлам
	 */
	public readonly stylesManifest: Record<string, IMapAssetManifest> = {};

	/**
	 *  Флаг, что манифест собран, чтобы случайно не начать грузить ассеты раньше времени
	 */
	public manifestBuilt = false;

	/**
	 * Экзэмпляр мэнэджера по управлению стилями (CSS)
	 *
	 * Нужен для разделения работы AssetManager и подгрузки css для HTML сцен
	 */
	private styleManager!: StyleManager;
	//#endregion

	//#region PUBLIC METHODS
	public init(): void {
		this.styleManager = new StyleManager();
	}

	/**
	 * Метод AssetManager, который сам выбирает как ему загружать ассеты в сцену
	 * @param scene поддерживаемый тип сцены
	 */
	public loadAssets(scene: CoreScene): void {
		switch (scene.sceneType) {
			case SceneTypes.GameScene:
				this.loadMapAssets(scene);
				break;
			case SceneTypes.HTMLScene:
				if (!(scene instanceof BaseHtmlScene)) {
					throw 'Не HTML сцена имеет тип HTML, ошибка';
				}
				this.loadHtmlAssets(scene);
				break;
			default:
				console.warn('Тип сцены не поддерживается для загрузки ассетов');
		}
	}

	/**
	 * СИНХРОННО: Загружает ассеты для указанной сцены, используя запись
	 * из предварительно созданного манифеста
	 * @param scene Сцена, в которую нужно загрузить ассеты
	 */
	@ManifestEntryCheck // 2
	@ManifestExistsCheck // 1
	public loadMapAssets(scene: CoreScene, manifestEntry?: IMapAssetManifest): void {
		// Загружаем все необходимые изображения тайлсетов
		for (const url of manifestEntry.tilesetUrls) {
			// ключ для Phaser - это просто имя файла без расширения
			const tilesetKey = url.split('/').pop()!.replace('.png', '');
			if (!scene.textures.exists(tilesetKey)) {
				scene.load.image(tilesetKey, url);
			}
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
	public loadHtmlAssets(scene: BaseHtmlScene, manifestEntry?: IHtmlAssetManifest): void {
		if (!scene.cache.html.has(scene.sceneKey)) {
			scene.load.html(scene.sceneKey, manifestEntry.HTML);
		}
		this.styleManager.preloadStyle(scene, manifestEntry.CSS);
	}

	/**
	 * АСИНХРОННО: Этот метод должен быть вызван ОДИН РАЗ при запуске игры
	 * (например, в BootScene), до загрузки игровых сцен
	 */
	public async buildManifest(): Promise<void> {
		if (this.manifestBuilt) return;

		// Map manifest
		let response = await fetch(ASSET_URLS[ASSET_KEYS.MAP_MANIFEST]);
		let manifestData = (await response.json()) as Record<string, IMapAssetManifest>;
		Object.assign(this.assetManifest, manifestData);

		// Html manifest
		response = await fetch(ASSET_URLS[ASSET_KEYS.HTML_MANIFEST]);
		manifestData = (await response.json()) as Record<string, IMapAssetManifest>;
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
