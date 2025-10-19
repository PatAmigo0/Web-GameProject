import type { NamedScene } from '../../core/abstracts/NamedScene';
import Phaser from 'phaser';

export class Map extends Phaser.Tilemaps.Tilemap {
	public playerSpawn?: Phaser.Types.Tilemaps.TiledObject;

	constructor(scene: NamedScene) {
		super(
			scene,
			Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled(
				scene.sceneKey, // name
				scene.cache.tilemap.get(scene.sceneKey).data, // source
				false, // insertNull
			)!,
		);
	}
}
