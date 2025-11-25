//#region IMPORTS
import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import type { WithPhaserLifecycle } from '@abstracts/scene-base/WithPhaserLifecycle';
import { BaseService } from '@abstracts/service-base/BaseService';
import type { Logger } from '@components/shared/LoggerComponent';
import { ASSET_KEYS, ASSET_URLS } from '@config/assets.config';
import { injectInitializator } from '@decorators/injectInitializator.decorator';
import { injectLogger } from '@decorators/injectLogger.decorator';
import { resolveManifestEntry } from '@decorators/resolveManifestEntry';
import type { IHtmlAssetManifest, IMapAssetManifest } from '@gametypes/assets.types';
import { SceneTypes } from '@gametypes/scene.types';
import type { GameService } from '@services/GameService';
import type { StyleManager } from './StyleManager';
//#endregion

//#region CLASS DEFINITION
/**
 * Класс для управления ассетами
 *
 * Отвечает за создание манифеста (списка всех ассетов) при запуске
 * и за загрузку нужных ассетов для каждой конкретной сцены
 */
@injectLogger()
@injectInitializator(async () => {})
export class AssetManager extends BaseService {
	protected declare logger: Logger;

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
	public readonly stylesManifest: Record<string, IHtmlAssetManifest> = {};

	/**
	 *  Флаг, что манифест собран, чтобы случайно не начать грузить ассеты раньше времени
	 */
	public manifestBuilt = false;
	//#endregion

	/**
	 *
	 * @param game
	 * @param assetManager
	 * Экзэмпляр мэнэджера по управлению стилями (CSS)
	 *
	 * Нужен для разделения работы AssetManager и подгрузки css для HTML сцен
	 */
	constructor(game: GameService, private styleManager: StyleManager) {
		super(game);
	}

	//#region PUBLIC METHODS
	public declare init: () => Promise<void>;

	/**
	 * Метод AssetManager, который сам выбирает как ему загружать ассеты в сцену
	 * @param scene поддерживаемый тип сцены
	 */
	public loadAssets(scene: CoreScene): void {
		scene.sceneType.forEach((type) => {
			switch (type) {
				case SceneTypes.GameScene:
					this.loadMapAssets(scene);
					break;
				case SceneTypes.HTMLScene:
					this.loadHtmlAssets(scene);
					break;
				default:
					this.logger.warn('Тип сцены не поддерживается для загрузки ассетов');
			}
		});
	}

	/**
	 * СИНХРОННО: Загружает ассеты для указанной сцены, используя запись
	 * из предварительно созданного манифеста
	 * @param scene Сцена, в которую нужно загрузить ассеты
	 */
	@resolveManifestEntry
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
	@resolveManifestEntry
	public loadHtmlAssets(
		scene: WithPhaserLifecycle | BaseHtmlScene,
		manifestEntry?: IHtmlAssetManifest,
	): void {
		if (scene instanceof BaseHtmlScene && !scene.cache.html.has(scene.sceneKey)) {
			scene.load.html(scene.sceneKey, manifestEntry.HTML);
		} else {
			this.logger.debug(`Not loading html for ${scene.sceneKey}`);
		}

		let url = manifestEntry.CSS;
		if (!__PRODUCTION__) url = `${url}?direct`;

		this.styleManager.preloadStyle(scene, url);
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
		this.logger.log('Манифест ассетов успешно создан', this.assetManifest, this.stylesManifest);
	}
	//#endregion
}
//#endregion
