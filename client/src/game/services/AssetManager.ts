//#region IMPORTS
// импортируем наш кастомный тип сцены, чтобы Phaser знал про sceneKey
import type { TypedScene } from '../core/abstracts/TypedScene';
//#endregion

//#region TYPE DEFINITIONS
/**
 * Чучуть теории:
 * Манифест - 'инструкция по сборке'
 */

// Интерфейсы для типобезопасности
interface TiledTileset {
	// тут только то, что нам реально нужно из Tiled json
	image: string;
}

interface TiledMapJson {
	// а это как бы весь json карты, но нам оттуда нужно только поле tilesets
	tilesets: TiledTileset[];
}

// Определяет структуру для заранее собранного списка ассетов для одной карты
interface MapAssetManifest {
	mapJsonUrl: string; // путь к самому json
	tilesetUrls: string[]; // массив путей ко всем картинкам тайлсетов
}
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
	// P.S. readonly значит, что мы не можем заменить сам объект, но можем менять его содержимое
	private static readonly assetManifest: Record<string, MapAssetManifest> =
		{};
	// флаг, что манифест собран, чтобы случайно не начать грузить ассеты раньше времени
	private static manifestBuilt = false;
	//#endregion

	//#region PUBLIC STATIC METHODS
	/**
	 * СИНХРОННО: Загружает ассеты для указанной сцены, используя запись
	 * из предварительно созданного манифеста
	 * Вызывайте этот метод из preload() вашей игровой сцены
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

		// если для этой сцены в манифесте ничего нет - косяк
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
		// ключ карты = ключ сцены, мы так договорились
		scene.load.tilemapTiledJSON(scene.sceneKey, manifestEntry.mapJsonUrl);
	}

	/**
	 * АСИНХРОННО: Этот метод должен быть вызван ОДИН РАЗ при запуске игры
	 * (например, в BootScene), до загрузки игровых сцен
	 * Он находит все карты, анализирует их зависимости и создает полный assetManifest
	 */
	public static async buildManifest(): Promise<void> {
		// если уже собрали, второй раз не надо
		if (this.manifestBuilt) return;

		console.log('[AssetManager] Начинаю создание манифеста ассетов');

		// 1 Находим все доступные файлы JSON и PNG
		// это магия Vite - import.meta.glob
		const jsonFiles = import.meta.glob('/src/assets/maps/json/*.json', {
			query: '?url', // ?url значит, что нам нужен не сам файл, а путь к нему
			import: 'default', // и импортировать как default
		});
		// то же самое для картинок
		const textureFiles = import.meta.glob(
			'/src/assets/maps/tilesets/*.png',
			{ query: '?url', import: 'default' },
		);

		// Создаем карту для быстрого поиска полных URL-адресов тайлсетов по их именам и расиширением [filename.ext]
		// типа 'grass.png' -> 'http://localhost:5173/src/assets/maps/tilesets/grass.png'
		const availableTilesets = new Map<string, string>();
		for (const path in textureFiles) {
			// import.meta.glob возвращает не сам url, а функцию, которая вернет Promise с url
			const getUrl = textureFiles[path] as () => Promise<string>;
			const url = await getUrl();
			// получаем например 'grass.png' из '/src/assets/maps/tilesets/grass.png'
			const filename = path.split('/').pop()!;

			// кидаем в нашу "базу данных"
			availableTilesets.set(filename, url);
		}

		// 2 Обрабатываем все JSON-файлы одновременно
		// map тут - это как forEach, но для объекта, и он возвращает массив
		const manifestPromises = Object.entries(jsonFiles).map(
			// делаем асинхронную функцию для каждого файла
			async ([path, getUrl]) => {
				// getUrl - это () => Promise<unknown>, приводим к норм типу
				const url = await (getUrl as () => Promise<string>)();
				// Получаем имя файла и удаляем из него его расширение
				// это и будет ключ сцены, типа 'test_place'
				const sceneKey = path.split('/').pop()!.replace('.json', '');

				try {
					// качаем json, чтобы посмотреть, что внутри
					const response = await fetch(url);
					// парсим его
					const mapData: TiledMapJson = await response.json();

					// теперь для каждого тайлсета в карте...
					const requiredTilesetUrls = mapData.tilesets
						.map((tileset) => {
							// ...берем его имя файла ('grass.png')
							const filename = tileset?.image.split('/').pop()!;
							// ...и ищем полный url в нашей Map'е
							return availableTilesets.get(filename);
						})
						// отфильтровываем все ненайденные (вдруг в Tiled путь кривой или файла нет)
						.filter((foundUrl): foundUrl is string => !!foundUrl);

					// Сохраняем результат в наш манифест
					// УРА! Записываем результат
					this.assetManifest[sceneKey] = {
						mapJsonUrl: url,
						tilesetUrls: requiredTilesetUrls,
					};
				} catch (error) {
					// если какой-то json битый или не скачался
					console.error(
						`Не удалось создать манифест для ${sceneKey}:`,
						error,
					);
				}
			},
		);

		// Ждем, пока все обработки закончатся
		// Promise.all ждет, пока выполнятся все промисы из массива
		await Promise.all(manifestPromises);

		// Завершаем создание манифеста ассетов
		this.manifestBuilt = true; // ставим флаг, что все готово
		console.log(
			'[AssetManager] Манифест ассетов успешно создан',
			this.assetManifest, // выводим в консоль, что получилось, для дебага
		);
	}
	//#endregion
}
//#endregion
