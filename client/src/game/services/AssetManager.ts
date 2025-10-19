import type { NamedScene } from '../core/abstracts/NamedScene';

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

/**
 * Статический класс для управления ассетами
 * Отвечает за создание манифеста (списка всех ассетов) при запуске
 * и за загрузку нужных ассетов для каждой конкретной сцены
 */
export class AssetManager {
	// Этот манифест будет хранить все заранее найденные пути к ассетам для каждой карты
	// Это словарь, сопоставляющий ключ сцены (например, 'test_place') со списком её ассетов
	private static readonly assetManifest: Record<string, MapAssetManifest> =
		{};
	private static manifestBuilt = false;

	/**
	 * СИНХРОННО: Загружает ассеты для указанной сцены, используя запись
	 * из предварительно созданного манифеста
	 * Вызывайте этот метод из preload() вашей игровой сцены
	 * @param scene Сцена, в которую нужно загрузить ассеты
	 */
	public static loadMapAssets(scene: NamedScene): void {
		if (!this.manifestBuilt) {
			console.error(
				'Ошибка [AssetManager]: Манифест ассетов еще не был создан. Вызовите AssetManager.buildManifest() в загрузочной сцене.',
			);
			return;
		}

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
			const tilesetKey = url.split('/').pop()!.replace('.png', '');
			if (!scene.textures.exists(tilesetKey))
				scene.load.image(tilesetKey, url);
		}

		// Загружаем JSON карту
		scene.load.tilemapTiledJSON(scene.sceneKey, manifestEntry.mapJsonUrl);
	}

	/**
	 * АСИНХРОННО: Этот метод должен быть вызван ОДИН РАЗ при запуске игры
	 * (например, в BootScene), до загрузки игровых сцен
	 * Он находит все карты, анализирует их зависимости и создает полный assetManifest
	 */
	public static async buildManifest(): Promise<void> {
		if (this.manifestBuilt) return;

		console.log('[AssetManager] Начинаю создание манифеста ассетов');

		// 1 Находим все доступные файлы JSON и PNG
		const jsonFiles = import.meta.glob('/src/assets/maps/json/*.json', {
			query: '?url',
			import: 'default',
		});
		const textureFiles = import.meta.glob(
			'/src/assets/maps/tilesets/*.png',
			{ query: '?url', import: 'default' },
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
						error,
					);
				}
			},
		);

		// Ждем, пока все обработки закончатся
		await Promise.all(manifestPromises);

		// Завершаем создание манифеста ассетов
		this.manifestBuilt = true;
		console.log(
			'[AssetManager] Манифест ассетов успешно создан',
			this.assetManifest,
		);
	}
}
