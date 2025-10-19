// src/game/core/abstracts/BasicGameScene.ts

import type { Map } from '../../components/entities/GameMap';
import { AssetManager } from '../../services/AssetManager';
import { MapManager } from '../../services/MapManager';
import { SceneEventHandler } from '../handlers/SceneEventHandler';
import { NamedScene } from './NamedScene';
import { TiledConverter } from '../../utils'; // Импортируем нашу утилиту
import { ASSET_KEYS, ASSET_URLS } from '../../config/assets.config';

export abstract class BasicGameScene extends NamedScene {
	protected eventHandler!: SceneEventHandler;
	protected map!: Map;
	protected player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

	// Абстрактные методы
	abstract onPreload(): void;
	abstract onCreate(): void;
	abstract heartbeat(time: number, delta: number): void;

	preload(): void {
		AssetManager.loadMapAssets(this);
		this.load.image(
			ASSET_KEYS.PLAYER_SPRITE,
			ASSET_URLS[ASSET_KEYS.PLAYER_SPRITE],
		);
		this.onPreload();
	}

	create(): void {
		this.eventHandler = new SceneEventHandler(this);
		this.eventHandler.setupCommonListeners();

		const mapData = MapManager.createMap(this);
		this.map = mapData.map;

		const spawnPoint = mapData.playerSpawn;

		if (!spawnPoint) {
			console.error('Кто-то забыл добавить спавн на карту -_-');
			return;
		}

		const playerPosition =
			TiledConverter.tiledObjectToPhaserCenter(spawnPoint);

		this.player = this.physics.add.sprite(
			playerPosition.x,
			playerPosition.y,
			ASSET_KEYS.PLAYER_SPRITE,
		);
		this.player.setCollideWorldBounds(true);

		this.onCreate();

		MapManager.initMapPhysics(this, this.map, mapData.collidableLayers);
	}

	update(time: number, delta: number): void {
		this.heartbeat(time, delta);
	}

	public getPlayer(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null {
		return this.player || null;
	}
}
