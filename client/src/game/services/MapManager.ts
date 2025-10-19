import {
	LAYER_PROPERTIE_COLLIDES,
	OBJECT_SPAWNS_LAYER,
	PLAYER_SPAWN,
} from '../config/tiled.config';
import { Map } from '../components/entities/GameMap';
import type { BooleanPropertie } from '../types/layer.types';
import type { NamedScene } from '../core/abstracts/NamedScene';
import type { BasicGameScene } from '../core/abstracts/BasicGameScene';

/**
 * Статический класс-менеджер для создания и настройки карт Tiled
 * Работает как набор утилит, не хранит состояниe
 */
export class MapManager {
	/**
	 * Основной метод, который создает карту и все ее компоненты
	 * @param scene - Сцена, в которой создается карта
	 * @returns Объект, содержащий созданную карту, слои для коллизий и точку спавна игрока
	 */
	public static createMap(scene: NamedScene): {
		map: Map;
		collidableLayers: Phaser.Tilemaps.TilemapLayer[];
		playerSpawn: Phaser.Types.Tilemaps.TiledObject | null;
	} {
		const map = new Map(scene);
		const tilesets: Phaser.Tilemaps.Tileset[] = [];
		const collidableLayers: Phaser.Tilemaps.TilemapLayer[] = [];

		// 1. Добавляем тайлсеты
		map.tilesets.forEach((tilesetData) => {
			const tileset = this._addTilesetImage(map, tilesetData.name);
			if (tileset) {
				tilesets.push(tileset);
			}
		});

		// 2. Создаем слои
		console.log(map.layers);
		map.layers.forEach((layerData) => {
			const result = this._createLayer(map, layerData, tilesets);
			if (result && result.isCollidable) {
				collidableLayers.push(result.layer);
			}
		});

		// 3. Находим объекты, например, точку спавна
		const playerSpawn = this._findPlayerSpawn(map);
		if (!playerSpawn) {
			console.warn('[MapManager] Не удалось найти объект спавна игрока');
		}

		console.log(`[MapManager] Карта для сцены ${scene.sceneKey} создана`);

		return { map, collidableLayers, playerSpawn };
	}

	/**
	 * Инициализирует физику для карты и игрока
	 * @param scene - Сцена, в которой настраивается физика
	 * @param map - Объект карты
	 * @param collidableLayers - Массив слоев, с которыми должен сталкиваться игрок
	 */
	public static initMapPhysics(
		scene: BasicGameScene,
		map: Map,
		collidableLayers: Phaser.Tilemaps.TilemapLayer[],
	): void {
		scene.physics.world.setBounds(
			0,
			0,
			map.widthInPixels,
			map.heightInPixels,
		);

		const player = scene.getPlayer();
		if (!player) {
			console.error(
				'Ошибка [MapManager]: Не удалось найти игрока для инициализации физики',
			);
			return;
		}

		player.setCollideWorldBounds(true);
		collidableLayers.forEach((layer) => {
			scene.physics.add.collider(player, layer);
		});
	}

	/* PRIVATE STATIC HELPERS */

	private static _addTilesetImage(
		map: Map,
		tilesetName: string,
	): Phaser.Tilemaps.Tileset | null {
		// Предполагаем, что ключ текстуры в Phaser совпадает с именем тайлсета в Tiled
		const tileset = map.addTilesetImage(tilesetName, tilesetName, 16, 16);

		if (!tileset) {
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

		let isCollidable = false;
		const properties = layerData.properties as BooleanPropertie[];
		if (
			Array.isArray(properties) &&
			properties.find((p) => p.name === LAYER_PROPERTIE_COLLIDES)
				?.value === true
		) {
			layer.setCollisionByExclusion([-1]);
			isCollidable = true;
		}
		return { layer, isCollidable };
	}

	private static _findPlayerSpawn(
		map: Map,
	): Phaser.Types.Tilemaps.TiledObject | null {
		return map.findObject(
			OBJECT_SPAWNS_LAYER,
			(obj) => obj.name === PLAYER_SPAWN,
		);
	}
}
