// src/game/utils/ABC/NamedScene.ts

import Phaser from 'phaser';

export abstract class NamedScene extends Phaser.Scene {
	public sceneKey!: string;

	constructor(sceneKey: string) {
		super(sceneKey);
		this.sceneKey = sceneKey;
	}
}
