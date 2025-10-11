import type { BasicGameScene } from '../scene/BasicGameScene';

export abstract class WorkingWithScene {
	protected scene!: BasicGameScene;
	protected sceneKey!: string;

	constructor(scene: BasicGameScene) {
		this.scene = scene;
		this.sceneKey = scene.scene.key;
	}
}
