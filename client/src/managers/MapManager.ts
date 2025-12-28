//#region IMPORTS
import type { BaseGameScene } from '@abstracts/scene-base/BaseGameScene';
import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import { Map } from '@components/phaser/scene-components/GameMap';
import { LayerProperties, Layers, ObjectNames } from '@config/tiled.config';
import { TILE_SIZE } from '@config/world.config';
import { injectLogger } from '@decorators/InjectLogger.decorator';
import type { IBooleanPropertie, IPropertie } from '@gametypes/world.types';
import type { Logger } from '@utils/Logger';
//#endregion

/**
 * Статический класс-менеджер для создания и настройки карт Tiled
 * Работает как набор утилит, не хранит состояниe
 * Типа "библиотека" функций чисто для карт
 */
//#region CLASS DEFINITION
@injectLogger({ static: true })
export class MapManager {
	private declare static logger: Logger;

	//#region PUBLIC STATIC METHODS
	/**
	 * Основной метод, который создает карту и все ее компоненты
	 * он возвращает готовый "пакет" со всем нужным
	 * @param scene - Сцена, в которой создается карта
	 * @returns Объект, содержащий созданную карту, слои для коллизий и точку спавна игрока
	 */
	public static createMap(scene: CoreScene): {
		map: Map;
		collidableLayers: Phaser.Tilemaps.TilemapLayer[]; // слои, в которые можно врезаться
		playerSpawn: Phaser.Types.Tilemaps.TiledObject | null; // где появляется игрок
	} {
		// создаем экземпляр нашего класса Map, который внутри себя создает Tilemap
		const map = new Map(scene);
		const tilesets: Phaser.Tilemaps.Tileset[] = [];
		const collidableLayers: Phaser.Tilemaps.TilemapLayer[] = [];

		// 1. Добавляем тайлсеты
		// пробегаем по всем тайлсетам, которые есть в json'е карты
		map.tilesets.forEach((tilesetData) => {
			const tileset = this._addTilesetImage(map, tilesetData.name);
			if (tileset) {
				tilesets.push(tileset);
			}
		});

		// 2. Создаем слои
		console.debug(map.layers);
		// теперь пробегаем по всем слоям
		map.layers.forEach((layerData) => {
			// создаем слой и определяем, коллайдится ли он
			const result = this._createLayer(map, layerData, tilesets);
			if (result && result.isCollidable) {
				collidableLayers.push(result.layer);
			}
		});

		// 3. Находим объекты, например, точку спавна
		// ищем объект спавна
		const playerSpawn = this._findPlayerSpawn(map);
		if (!playerSpawn) {
			console.warn('[MapManager] Не удалось найти объект спавна игрока');
		}
		MapManager.logger.debug(`Карта для сцены ${scene.sceneKey} создана`);

		return { map, collidableLayers, playerSpawn };
	}

	/**
	 * Инициализирует физику для карты и игрока
	 * @param scene - Сцена, в которой настраивается физика
	 * @param map - Объект карты
	 * @param collidableLayers - Массив слоев, с которыми должен сталкиваться игрок
	 */
	public static initMapPhysics(
		scene: BaseGameScene, // тут нужен BasicGameScene, тк в нем есть getPlayer()
		map: Map,
		collidableLayers: Phaser.Tilemaps.TilemapLayer[],
	): void {
		// устанавливаем границы мира по размеру карты, чтоб игрок не улетел в бесконечность
		scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

		// player.setCollideWorldBounds(true);
		// collidableLayers.forEach((layer) => {
		// 	scene.physics.add.collider(player, layer); // создаем коллизию
		// });
	}
	//#endregion

	//#region PRIVATE STATIC HELPERS
	private static _addTilesetImage(
		map: Map,
		tilesetName: string, // 'grass', 'water' и тд
	): Phaser.Tilemaps.Tileset | null {
		const tileset = map.addTilesetImage(tilesetName, tilesetName, TILE_SIZE.width, TILE_SIZE.height);

		if (!tileset) {
			MapManager.logger.warn(`Не удалось добавить тайлсет: "${tilesetName}"
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
			MapManager.logger.warn(`Не удалось создать слой: "${layerData.name}"`);
			return null;
		}

		let isCollidable = false;
		const properties = layerData.properties as IBooleanPropertie[];

		// ищем проперти 'collides' и проверяем, что оно 'true'
		if (Array.isArray(properties)) {
			isCollidable = MapManager._initLayer(layer, properties).isCollidable;
		}
		// возвращаем и слой, и флаг
		return { layer, isCollidable };
	}

	private static _initLayer(
		layer: Phaser.Tilemaps.TilemapLayer,
		properties: IPropertie[],
	): { isCollidable: boolean } {
		let isCollidable = false;
		if (properties.find((p) => p.name === LayerProperties.Collides)?.value === true) {
			// Устанавливаем коллизию для всех тайлов, кроме -1 (пустого)
			layer.setCollisionByExclusion([-1]);
			isCollidable = true;
		}

		// Устанавливаем глубину (Z-порядок) из Tiled
		layer.setDepth(properties.find((p) => p.name === LayerProperties.Depth)?.value || layer.depth);

		return { isCollidable };
	}

	private static _findPlayerSpawn(map: Map): Phaser.Types.Tilemaps.TiledObject | null {
		return map.findObject(
			Layers.Spawns, // 'spawns'
			(obj) => obj.name === ObjectNames.PlayerSpawn, // 'PlayerSpawn'
		);
	}
	//#endregion
}
//#endregion
