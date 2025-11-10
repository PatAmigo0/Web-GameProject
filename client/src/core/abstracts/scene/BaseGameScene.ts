//#region IMPORTS
import { AbstractBaseScene } from '@abstracts/scene/AbstractBaseScene';
import type { Map } from '@components/phaser/scene/GameMap';
import { ASSET_KEYS, ASSET_URLS } from '@config/assets.config';
import { CAMERA_ZOOM, PLAYER_DEPTH } from '@config/game.config';
import { MapManager } from '@managers/MapManager';
import { TiledConverter } from '@utils/TiledConverter';
//#endregion

//#region ABSTRACT SCENE DEFINITION
/**
 * Базовый класс для всех игровых сцен
 * Определяет общую структуру жизненного цикла (preload/create/update) и инициализацию карты/игрока
 */
export abstract class BaseGameScene extends AbstractBaseScene {
	//#region SCENE ATTRIBUTES
	protected map!: Map;
	protected player!: Phaser.Physics.Arcade.Sprite;
	//#endregion

	//#region PHASER LIFECYCLE METHODS
	public prepareAssets(): void {
		this.load.image(
			ASSET_KEYS.PLAYER_SPRITE,
			ASSET_URLS[ASSET_KEYS.PLAYER_SPRITE],
		);
		this.onPreload();
	}

	public setupScene(): void {
		const mapData = MapManager.createMap(this);
		this.map = mapData.map;

		const spawnPoint = mapData.playerSpawn;
		if (!spawnPoint) {
			throw 'Кто-то забыл добавить спавн на карту -_-';
		}

		this.cameras.main.setZoom(CAMERA_ZOOM);

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

		this.onCreate();

		MapManager.initMapPhysics(this, this.map, mapData.collidableLayers);
		console.warn(this.cache);
	}

	public update(time: number, delta: number): void {
		this.heartbeat(time, delta);
	}

	public shutdown(): void {
		this.onShutdown();
	}
	//#endregion

	//#region ACCESSORS
	/**
	 * Предоставляет доступ к объекту игрока для других компонентов (например, MapManager)
	 */
	public getPlayer(): Phaser.Physics.Arcade.Sprite | null {
		return this.player || null;
	}
	//#endregion
}
//#endregion
