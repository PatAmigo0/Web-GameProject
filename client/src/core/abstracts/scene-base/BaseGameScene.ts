//#region IMPORTS
import { AbstractBaseScene } from '@abstracts/scene-base/AbstractBaseScene';
import type { Map } from '@components/phaser/scene-components/GameMap';
import { CAMERA_ZOOM } from '@config/render.config';
import { MapManager } from '@managers/MapManager';
//#endregion

//#region ABSTRACT SCENE DEFINITION
/**
 * Базовый класс для всех игровых сцен
 * Определяет общую структуру жизненного цикла (preload/create/update) и инициализацию карты/игрока
 */
export abstract class BaseGameScene extends AbstractBaseScene {
	//#region SCENE ATTRIBUTES
	protected map!: Map;
	//#endregion

	//#region PHASER LIFECYCLE METHODS
	public prepareAssets(): void {
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

		// const playerPosition =
		// 	TiledConverter.tiledObjectToPhaserCenter(spawnPoint);
		// this.player.setCollideWorldBounds(true);
		// this.player.setDepth(CHARACTER_DEPTH);

		this.onCreate();

		MapManager.initMapPhysics(this, this.map, mapData.collidableLayers);
	}

	public update(time: number, delta: number): void {
		this.heartbeat(time, delta);
	}

	public shutdown(): void {
		this.onShutdown();
	}
	//#endregion
}
//#endregion
