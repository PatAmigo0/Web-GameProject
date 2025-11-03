//#region IMPORTS
import type { TypedScene } from '@/core/abstracts/scenes/TypedScene';
import Phaser from 'phaser';
//#endregion

//#region CLASS DEFINITION
export class Map extends Phaser.Tilemaps.Tilemap {
	//#region CLASS ATTRIBUTES
	public playerSpawn?: Phaser.Types.Tilemaps.TiledObject;
	//#endregion

	//#region CONSTRUCTOR
	constructor(scene: TypedScene) {
		super(
			scene,
			// Парсинг JSON-данных карты из кэша по ключу сцены
			Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled(
				scene.sceneKey, // name
				scene.cache.tilemap.get(scene.sceneKey).data, // source
				false, // insertNull
			)!,
		);
	}
	//#endregion
}
//#endregion
