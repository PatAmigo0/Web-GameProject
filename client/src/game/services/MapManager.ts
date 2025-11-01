// импортируем константы для Tiled, чтоб не писать строки руками
import {
	DEPTH_PROPERTIE_NAME,
	LAYER_PROPERTIE_COLLIDES,
	OBJECT_SPAWNS_LAYER,
	PLAYER_SPAWN,
} from '../config/tiled.config';
// импортируем наш кастомный класс Map
import { Map } from '../components/entities/GameMap';
// импортируем типы, чтоб TypeScript не ругался
import type { BooleanPropertie, Propertie } from '../types/layer.types';
import type { NamedScene } from '../core/abstracts/NamedScene';
import type { BasicGameScene } from '../core/abstracts/BasicGameScene';
import { TILE_SIZE } from '../config/game.config';

/**
 * Статический класс-менеджер для создания и настройки карт Tiled
 * Работает как набор утилит, не хранит состояниe
 * Типа "библиотека" функций чисто для карт
 */
export class MapManager {
	/**
	 * Основной метод, который создает карту и все ее компоненты
	 * Вызываешь его, а он тебе возвращает готовый "пакет" со всем нужным
	 * @param scene - Сцена, в которой создается карта
	 * @returns Объект, содержащий созданную карту, слои для коллизий и точку спавна игрока
	 */
	public static createMap(scene: NamedScene): {
		map: Map; // сама карта
		collidableLayers: Phaser.Tilemaps.TilemapLayer[]; // слои, в которые можно врезаться
		playerSpawn: Phaser.Types.Tilemaps.TiledObject | null; // где появляется игрок
	} {
		// создаем экземпляр нашего класса Map, который внутри себя создает Tilemap
		const map = new Map(scene);
		// пустые "коробки" для тайлсетов и слоев
		const tilesets: Phaser.Tilemaps.Tileset[] = [];
		const collidableLayers: Phaser.Tilemaps.TilemapLayer[] = [];

		// 1. Добавляем тайлсеты
		// бежим по всем тайлсетам, которые есть в json'е карты
		map.tilesets.forEach((tilesetData) => {
			// _addTilesetImage - это наш приватный хелпер (помощник) внизу
			const tileset = this._addTilesetImage(map, tilesetData.name);
			// если тайлсет успешно создался, кидаем его в нашу "коробку"
			if (tileset) {
				tilesets.push(tileset);
			}
		});

		// 2. Создаем слои
		console.log(map.layers); // позырить в консоли, какие слои вообще есть
		// теперь бежим по всем слоям из json'а
		map.layers.forEach((layerData) => {
			// _createLayer - еще один хелпер, он создает слой и говорит, коллайдится ли он
			const result = this._createLayer(map, layerData, tilesets);
			// если слой создался И он коллайдится (типа стена)
			if (result && result.isCollidable) {
				// кидаем его во вторую "коробку" для коллизий
				collidableLayers.push(result.layer);
			}
		});

		// 3. Находим объекты, например, точку спавна
		// _findPlayerSpawn - третий хелпер, ищет объект спавна
		const playerSpawn = this._findPlayerSpawn(map);
		if (!playerSpawn) {
			// если не нашли, надо бы предупредить
			console.warn('[MapManager] Не удалось найти объект спавна игрока');
		}
		console.log(`[MapManager] Карта для сцены ${scene.sceneKey} создана`);

		// возвращаем тот самый "пакет" со всем добром
		return { map, collidableLayers, playerSpawn };
	}

	/**
	 * Инициализирует физику для карты и игрока
	 * @param scene - Сцена, в которой настраивается физика
	 * @param map - Объект карты
	 * @param collidableLayers - Массив слоев, с которыми должен сталкиваться игрок
	 */
	public static initMapPhysics(
		scene: BasicGameScene, // тут нужен BasicGameScene, тк в нем есть getPlayer()
		map: Map,
		collidableLayers: Phaser.Tilemaps.TilemapLayer[],
	): void {
		// устанавливаем границы мира по размеру карты, чтоб игрок не улетел в бесконечность
		scene.physics.world.setBounds(
			0,
			0,
			map.widthInPixels,
			map.heightInPixels,
		);

		const player = scene.getPlayer();
		if (!player) {
			// если игрока нет, то и физику настраивать не для кого
			console.error(
				'Ошибка [MapManager]: Не удалось найти игрока для инициализации физики',
			);
			return;
		}

		// говорим игроку, чтоб он бился о границы мира (которые мы выше поставили)
		player.setCollideWorldBounds(true);
		// а теперь говорим ему биться о каждый слой из нашего списка
		collidableLayers.forEach((layer) => {
			scene.physics.add.collider(player, layer); // вот эта строка и создает коллизию
		});
	}

	/* * PRIVATE STATIC HELPERS
	 * Это внутренние функции, которые помогают createMap,
	 * снаружи они не нужны, поэтому приватные
	 */

	private static _addTilesetImage(
		map: Map,
		tilesetName: string, // 'grass', 'water' и тд
	): Phaser.Tilemaps.Tileset | null {
		// Предполагаем, что ключ текстуры в Phaser совпадает с именем тайлсета в Tiled
		// типа, картинка 'grass.png' в Tiled называется 'grass', и в Phaser мы ее загрузили как 'grass'
		const tileset = map.addTilesetImage(
			tilesetName,
			tilesetName,
			TILE_SIZE.width,
			TILE_SIZE.height,
		);

		if (!tileset) {
			// если фейл, пишем в консоль, что могло пойти не так
			console.warn(`[MapManager] Не удалось добавить тайлсет: "${tilesetName}"
			> Правильный ли ключ текстуры?
			> Был ли он загружен?
			> Совпадает ли имя в Tiled с именем файла?`);
		}
		return tileset;
	}

	private static _createLayer(
		map: Map,
		layerData: Phaser.Tilemaps.LayerData,
		tilesets: Phaser.Tilemaps.Tileset[],
	): { layer: Phaser.Tilemaps.TilemapLayer; isCollidable: boolean } | null {
		const layer = map.createLayer(layerData.name, tilesets, 0, 0);
		if (!layer) {
			console.warn(
				`[MapManager] Не удалось создать слой: "${layerData.name}"`,
			);
			return null;
		}

		// по дефолту слой не коллайдится
		let isCollidable = false;
		// берем кастомные проперти слоя из Tiled
		const properties = layerData.properties as BooleanPropertie[];

		// ищем проперти 'collides' и проверяем, что оно 'true'
		if (Array.isArray(properties)) {
			isCollidable = MapManager._initLayer(
				layer,
				properties,
			).isCollidable;
		}
		// возвращаем и слой, и флаг
		return { layer, isCollidable };
	}

	private static _initLayer(
		layer: Phaser.Tilemaps.TilemapLayer,
		properties: Propertie[],
	): { isCollidable: boolean } {
		let isCollidable = false;
		if (
			properties.find((p) => p.name === LAYER_PROPERTIE_COLLIDES)
				?.value === true
		) {
			layer.setCollisionByExclusion([-1]);
			isCollidable = true;
		}

		layer.setDepth(
			properties.find((p) => p.name === DEPTH_PROPERTIE_NAME)?.value ||
				layer.depth,
		);

		console.log(`${layer.name} depth: ${layer.depth}`);

		return { isCollidable };
	}

	private static _findPlayerSpawn(
		map: Map,
	): Phaser.Types.Tilemaps.TiledObject | null {
		return map.findObject(
			OBJECT_SPAWNS_LAYER, // 'spawns'
			(obj) => obj.name === PLAYER_SPAWN, // 'PlayerSpawn'
		);
	}
}
