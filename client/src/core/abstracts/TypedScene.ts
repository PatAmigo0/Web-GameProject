// src/game/utils/ABC/TypedScene.ts

import { SceneTypes } from '@/types/scene.types';

export abstract class TypedScene extends Phaser.Scene {
	public sceneKey!: string;
	public sceneType!: string;

	constructor(sceneKey: string, sceneType: string = SceneTypes.Undefined) {
		super(sceneKey);
		this.sceneKey = sceneKey;
		if (sceneType == SceneTypes.Undefined)
			console.warn(
				'[ WARNING ] У сцены не определен стиль, это очень плохо',
			);
		this.sceneType = sceneType;
	}
}
