export abstract class NamedScene extends Phaser.Scene {
	static readonly sceneKey: string;

	constructor() {
		super(NamedScene.sceneKey);
	}
}
