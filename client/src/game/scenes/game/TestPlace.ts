// src/game/scenes/game/TestPlace.ts

// import type { GameData } from '../../types/game.types';
import { NetworkedScene } from '../../core/abstracts/NetworkedScene';
import obstacleImg from '../../../assets/images/typescript.svg';
import { SceneKey } from '../../utils/decorators/SceneKey.decorator';
import { SceneKeys } from '../../types';
import { ASSET_KEYS } from '../../config/assets.config';

@SceneKey(SceneKeys.TestPlace)
export class TestPlace extends NetworkedScene {
	private keys!: { [key: string]: Phaser.Input.Keyboard.Key } | undefined;
	private obstaclesGroup!: Phaser.Physics.Arcade.StaticGroup;

	onPreload() {
		this.load.image('obstacle', obstacleImg);
	}

	onCreate() {
		this.obstaclesGroup = this.physics.add.staticGroup();
		const obstacle = this.obstaclesGroup.create(
			this.player.x + 30,
			this.player.y + 50,
			ASSET_KEYS.PLAYER_SPRITE,
		);
		this.physics.add.collider(this.player, this.obstaclesGroup);

		this.keys = this.input.keyboard?.addKeys('W,A,S,D') as {
			[key: string]: Phaser.Input.Keyboard.Key;
		};

		this.cameras.main.startFollow(this.player);
		this.cameras.main.setZoom(4);
	}

	heartbeat(): void {
		const moveSpeed = 200;

		this.player.setVelocity(0);

		if (this.keys?.W.isDown) {
			this.player.setVelocityY(-moveSpeed);
		} else if (this.keys?.S.isDown) {
			this.player.setVelocityY(moveSpeed);
		}

		if (this.keys?.A.isDown) {
			this.player.setVelocityX(-moveSpeed);
		} else if (this.keys?.D.isDown) {
			this.player.setVelocityX(moveSpeed);
		}
	}

	onPlayerConnected(): void {}

	onPlayerDisconnected(): void {}

	handleNetworkData(): void {}
}
