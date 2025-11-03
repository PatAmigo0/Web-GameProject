// src/game/utils/ABC/TypedScene.ts
import Phaser from 'phaser';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import type { GameService } from '@services/GameService';

export abstract class TypedScene extends Phaser.Scene {
	public sceneKey!: SceneKeys;
	public sceneType!: SceneTypes;
	declare game: GameService;

	constructor(
		sceneKey: SceneKeys,
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
