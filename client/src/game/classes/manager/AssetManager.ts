// src/manager/AssetManager.ts

import { WorkingWithScene } from '../ABC/WorkingWithScene';
import type { BasicGameScene } from '../scene/BasicGameScene';

/**
 * Чучуть теории:
 * Манифест - 'инструкция по сборке'
 */

// Интерфейсы для типобезопасности
interface TiledTileset {
	image: string;
}

interface TiledMapJson {
	tilesets: TiledTileset[];
}

// Определяет структуру для заранее собранного списка ассетов для одной карты
interface MapAssetManifest {
	mapJsonUrl: string;
	tilesetUrls: string[];
}

export class AssetManager extends WorkingWithScene {
	// Этот манифест будет хранить все заранее найденные пути к ассетам для каждой карты
	// Это словарь, сопоставляющий ключ сцены (например, 'test_place') со списком её ассетов
	private static readonly assetManifest: Record<string, MapAssetManifest> =
		{};
	private static manifestBuilt = false;

	constructor(scene: BasicGameScene) {
		super(scene);
		if (!AssetManager.manifestBuilt)
			console.error(
				'Ошибка [AssetManager]: Манифест ассетов еще не был создан, кто не вызовал AssetManager.buildManifest() в загрузочной сцене??'
			);
	}

	/**
	 * СИНХРОННО: Загружает ассеты для текущей сцены, используя запись
	 * из предварительно созданного манифеста
	 * Вызывайте этот метод из preload() вашей игровой сцены
	 */
	public loadMapAssets(): void {
		const manifestEntry = AssetManager.assetManifest[this.sceneKey];

		if (!manifestEntry) {
			console.error(
				`[AssetManager] Не найдена запись в манифесте для сцены: ${this.sceneKey}`
			);
			return;
		}

		console.log(
			`[AssetManager] Загрузка ассетов для сцены: ${this.sceneKey}`
		);

		// Загружаем все необходимые изображения тайлсетов
		for (const url of manifestEntry.tilesetUrls) {
			const tilesetKey = url.split('/').pop()!.replace('.png', '');
			if (!this.scene.textures.exists(tilesetKey))
				this.scene.load.image(tilesetKey, url);
		}

		// Загружаем JSON карту
		this.scene.load.tilemapTiledJSON(
			this.sceneKey,
			manifestEntry.mapJsonUrl
		);
	}

	/**
	 * АСИНХРОННО: Этот метод должен быть вызван ОДИН РАЗ при запуске игры
	 * Он находит все карты, получает их, анализирует зависимости
	 * и создает полный assetManifest
	 */
	public static async buildManifest(): Promise<void> {
		if (this.manifestBuilt) return;

		console.log('[AssetManager] Начинаем создание манифеста ассетов');

		// 1 Находим все доступные файлы JSON и PNG
		const jsonFiles = import.meta.glob(
			'/src/game/assets/maps/json/*.json',
			{ query: '?url', import: 'default' }
		);
		const textureFiles = import.meta.glob(
			'/src/game/assets/maps/tilesets/*.png',
			{ query: '?url', import: 'default' }
		);

		// Создаем карту для быстрого поиска полных URL-адресов тайлсетов по их именам и расиширением
		const availableTilesets = new Map<string, string>();
		for (const path in textureFiles) {
			const getUrl = textureFiles[path] as () => Promise<string>;
			const url = await getUrl();
			const filename = path.split('/').pop()!;

			availableTilesets.set(filename, url);
		}

		// 2 Обрабатываем все JSON-файлы одновременно
		const manifestPromises = Object.entries(jsonFiles).map(
			async ([path, getUrl]) => {
				const url = await (getUrl as () => Promise<string>)();
				const sceneKey = path.split('/').pop()!.replace('.json', ''); // Получаем имя файла и удаляем из него его расширение

				try {
					const response = await fetch(url);
					const mapData: TiledMapJson = await response.json();

					const requiredTilesetUrls = mapData.tilesets
						.map((tileset) => {
							const filename = tileset?.image.split('/').pop()!;
							return availableTilesets.get(filename);
						})
						.filter((foundUrl): foundUrl is string => !!foundUrl); // Отфильтровываем все ненайденные

					// Сохраняем результат в наш манифест
					this.assetManifest[sceneKey] = {
						mapJsonUrl: url,
						tilesetUrls: requiredTilesetUrls,
					};
				} catch (error) {
					console.error(
						`Не удалось создать манифест для ${sceneKey}:`,
						error
					);
				}
			}
		);

		// Ждем, пока все обработки закончатся
		await Promise.all(manifestPromises);

		// Завершаем создание манифеста ассетов
		this.manifestBuilt = true;
		console.log(
			'[AssetManager] Манифест ассетов успешно создан',
			this.assetManifest
		);
	}
}
