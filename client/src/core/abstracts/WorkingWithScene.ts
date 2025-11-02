// src/game/utils/ABC/WorkingWithScene.ts

import type { BasicGameScene } from '@core/abstracts/BasicGameScene';

export abstract class WorkingWithScene {
	protected scene!: BasicGameScene;
	protected sceneKey!: string;

	constructor(scene: BasicGameScene) {
		this.scene = scene;
		this.sceneKey = scene.sceneKey; // alias для scene.sceneKey
	}
}
