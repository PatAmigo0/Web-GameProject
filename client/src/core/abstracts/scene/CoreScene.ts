// src/game/utils/ABC/CoreScene.ts
import { SCENE_EVENT_TYPES } from '@config/events.config';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import type { GameService } from '@services/GameService';
import Phaser from 'phaser';

export abstract class CoreScene extends Phaser.Scene {
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

	public preload(): void {
		this.game.assetManager.loadAssets(this);
	}

	public create(): void {
		this.events.emit(SCENE_EVENT_TYPES.SCENE_IS_READY_TO_RUN);
	}
}
