// src/utils/ABC/WorkingWithScene.ts

import type { BaseGameScene } from '@abstracts/scenes/BaseGameScene';

export abstract class WorkingWithScene {
	protected scene!: BaseGameScene;
	protected sceneKey!: string;

	constructor(scene: BaseGameScene) {
		this.scene = scene;
		this.sceneKey = scene.sceneKey; // alias для scene.sceneKey
	}
}
