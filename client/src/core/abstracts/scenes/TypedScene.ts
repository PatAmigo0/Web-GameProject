// src/game/utils/ABC/TypedScene.ts
import Phaser from 'phaser';
import { SceneTypes } from '@gametypes/scene.types';

export abstract class TypedScene extends Phaser.Scene {
	public sceneKey!: string;
	public sceneType!: SceneTypes;

	constructor(
		sceneKey: string,
		sceneType: SceneTypes = SceneTypes.Undefined,
	) {
		super(sceneKey);
		this.sceneKey = sceneKey;
		if (sceneType == SceneTypes.Undefined)
			console.warn(
				'[ WARNING ] У сцены не определен стиль, это очень плохо',
			);
		this.sceneType = sceneType;
	}
}
