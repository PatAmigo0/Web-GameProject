// src/manager/MapManager.ts

import { WorkingWithScene } from '../core/abstracts/WorkingWithScene';

export class MapManager extends WorkingWithScene {
	private map!: Phaser.Tilemaps.Tilemap;
	private tilesets: Phaser.Tilemaps.Tileset[] = [];
	private collidable: Phaser.Tilemaps.TilemapLayer[] = [];

	/**
	 * Создает карту из заранее загруженных ассетов
	 */
	public createMap(): Phaser.Tilemaps.Tilemap {
		this.map = this.scene.make.tilemap({ key: this.sceneKey });

		this.map.tilesets.forEach((tileset) =>
			this._addTilesetImage(tileset.name),
		);
		this.map.layers.forEach((layerData) => this._createLayer(layerData));
		console.log(this.map.objects);

		console.log(`[MapManager] Карта для сцены ${this.sceneKey} создана`);
		return this.map;
	}

	public initMapPhysics(): void {
		this.scene.physics.world.setBounds(
			0,
			0,
			this.map.widthInPixels,
			this.map.heightInPixels,
		);
		this.scene.getPlayer()?.setCollideWorldBounds(true);
		this.collidable.forEach((layer) => {
			const player = this.scene.getPlayer();
			if (player) {
				this.scene.physics.add.collider(player, layer);
			} else {
				console.error(
					'Ошибка [MapManager]: Не удалось найти игрока для инициализации физики',
				);
			}
		});
	}

	/* PRIVATE METHODS */
	private _addTilesetImage(tilesetName: string): void {
		// Я предполагаю что ключ текстуры в Phaser совпадает с именем тайлсета в Tiled
		// И вообще по хорошему так и должно быть
		const tileset = this.map.addTilesetImage(
			tilesetName,
			tilesetName,
			16,
			16,
		);

		if (tileset) this.tilesets.push(tileset);
		else
			console.warn(`[MapManager] Не удалось добавить тайлсет: "${tilesetName}"
            > Правильный ли ключ текстуры
            > Был ли он загружен через AssetManager
            > Совпадает ли имя в редакторе Tiled с именем файла`);
	}

	private _createLayer(layerData: Phaser.Tilemaps.LayerData): void {
		const layer = this.map.createLayer(layerData.name, this.tilesets, 0, 0);
		if (!layer) {
			console.warn(
				`[MapManager] Не удалось создать слой: "${layerData.name}"`,
			);
			return;
		}

		// Ишем все 'твердые' слои
		const properties = layerData.properties as [
			{ name?: string; value?: boolean },
		];
		if (
			Array.isArray(properties) &&
			properties.find((p) => p.name === 'collides')?.value === true
		) {
			layer.setCollisionByExclusion([-1]);
			this.collidable.push(layer);
		}
	}
}
