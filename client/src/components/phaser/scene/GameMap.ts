//#region IMPORTS
import type { CoreScene } from '@abstracts/scene/CoreScene';
import Phaser from 'phaser';
//#endregion

//#region CLASS DEFINITION
export class Map extends Phaser.Tilemaps.Tilemap {
	//#region CLASS ATTRIBUTES
	public playerSpawn?: Phaser.Types.Tilemaps.TiledObject;
	//#endregion

	//#region CONSTRUCTOR
	constructor(scene: CoreScene) {
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
