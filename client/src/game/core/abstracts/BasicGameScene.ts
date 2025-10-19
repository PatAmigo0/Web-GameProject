// src/game/utils/ABC/BasicGameScene.ts

import { AssetManager } from '../../services/AssetManager';
import { MapManager } from '../../services/MapManager';
import { SceneEventHandler } from '../handlers/SceneEventHandler';
import { NamedScene } from './NamedScene';

export abstract class BasicGameScene extends NamedScene {
	protected eventHandler!: SceneEventHandler;
	public assetManager!: AssetManager;
	protected mapManager!: MapManager;
	protected map!: Phaser.Tilemaps.Tilemap;
	protected player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

	// Абстрактные методы
	abstract onPreload(): void;
	abstract onCreate(): void;
	abstract heartbeat(time: number, delta: number): void;

	preload(): void {
		// Создаём экземпляры менеджеров
		this.assetManager = new AssetManager(this);
		this.mapManager = new MapManager(this);

		this.assetManager.loadMapAssets();
		this.onPreload();
	}

	create(): void {
		this.eventHandler = new SceneEventHandler(this);
		this.eventHandler.setupCommonListeners();

		this.map = this.mapManager.createMap();

		this.onCreate();

		this.mapManager.initMapPhysics();
	}

	update(time: number, delta: number): void {
		this.heartbeat(time, delta);
	}

	public getPlayer(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null {
		return this.player || null;
	}
}
