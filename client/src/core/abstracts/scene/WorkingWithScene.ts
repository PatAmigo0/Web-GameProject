// src/utils/abstracts/scenes/WorkingWithScene.ts

import type { BaseGameScene } from '@abstracts/scene/BaseGameScene';

export abstract class WorkingWithScene {
	protected scene!: BaseGameScene;
	protected sceneKey!: string;

	constructor(scene: BaseGameScene) {
		this.scene = scene;
		this.sceneKey = scene.sceneKey;
	}
}
