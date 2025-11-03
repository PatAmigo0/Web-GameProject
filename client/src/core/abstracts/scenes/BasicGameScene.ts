//#region IMPORTS
import type { Map } from '@components/entities/GameMap';
import { AssetManager } from '@services/AssetManager';
import { MapManager } from '@services/MapManager';
import { SceneEventHandler } from '@core/handlers/SceneEventHandler';
import { TypedScene } from '@/core/abstracts/scenes/TypedScene';
import { TiledConverter } from '@utils/TiledConverter';
import { ASSET_KEYS, ASSET_URLS } from '@config/assets.config';
import { PLAYER_DEPTH } from '@config/game.config';
//#endregion

//#region ABSTRACT SCENE DEFINITION
/**
 * Базовый класс для всех игровых сцен
 * Определяет общую структуру жизненного цикла (preload/create/update) и инициализацию карты/игрока
 */
export abstract class BasicGameScene extends TypedScene {
	//#region SCENE ATTRIBUTES
	protected eventHandler!: SceneEventHandler;
	protected map!: Map;
	protected player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	//#endregion

	//#region ABSTRACT LIFECYCLE HOOKS
	// Абстрактные методы, которые должны быть реализованы в дочерних сценах
	abstract onPreload(): void;
	abstract onCreate(): void;
	abstract heartbeat(time: number, delta: number): void;
	//#endregion

	//#region PHASER LIFECYCLE METHODS

	preload(): void {
		// 1. Загрузка ассетов карты (Tiled JSON и тайлсеты)
		AssetManager.loadMapAssets(this);
		// 2. Загрузка основного спрайта игрока (или других общих ассетов)
		this.load.image(
			ASSET_KEYS.PLAYER_SPRITE,
			ASSET_URLS[ASSET_KEYS.PLAYER_SPRITE],
		);
		// 3. Вызов хука для специфической загрузки дочерней сцены
		this.onPreload();
	}

	create(): void {
		// 1. Инициализация обработчика событий
		this.eventHandler = new SceneEventHandler(this);
		this.eventHandler.setupCommonListeners();

		// 2. Создание карты
		const mapData = MapManager.createMap(this);
		this.map = mapData.map;

		// 3. Обработка спавна игрока
		const spawnPoint = mapData.playerSpawn;
		if (!spawnPoint) {
			console.error('Кто-то забыл добавить спавн на карту -_-');
			return;
		}

		// 4. Позиционирование и создание игрока
		const playerPosition =
			TiledConverter.tiledObjectToPhaserCenter(spawnPoint);

		this.player = this.physics.add.sprite(
			playerPosition.x,
			// Смещение по Y, чтобы центр физического тела был на точке спавна, а не голова
			playerPosition.y - spawnPoint.height! / 2,
			ASSET_KEYS.PLAYER_SPRITE,
		);
		this.player.setCollideWorldBounds(true);
		this.player.setDepth(PLAYER_DEPTH);

		// 5. Вызов хука для специфической инициализации дочерней сцены
		this.onCreate();

		// 6. Инициализация физики карты (коллизии игрока и слоев)
		MapManager.initMapPhysics(this, this.map, mapData.collidableLayers);
	}

	update(time: number, delta: number): void {
		// Делегируем логику кадра абстрактному методу
		this.heartbeat(time, delta);
	}
	//#endregion

	//#region ACCESSORS
	/**
	 * Предоставляет доступ к объекту игрока для других компонентов (например, MapManager)
	 */
	public getPlayer(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null {
		return this.player || null;
	}
	//#endregion
}
//#endregion
