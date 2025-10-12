export abstract class NamedScene extends Phaser.Scene {
	public readonly sceneKey!: string;

	constructor(sceneKey: string) {
		super(sceneKey);
		this.sceneKey = sceneKey;
	}
}
