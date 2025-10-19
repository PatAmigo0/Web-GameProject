import type { GameData } from '../../types/game.types';
import { NetworkedScene } from '../../core/abstracts/NetworkedScene';
import obstacleImg from '../../../assets/images/typescript.svg';
import playerImg from '../../../assets/images/Walk.png';
import { SceneKey } from '../../utils/decorators/SceneKey.decorator';
import { SceneKeys } from '../../types';

@SceneKey(SceneKeys.TestPlace)
export default class test_scene2 extends NetworkedScene {
	private keys!: { [key: string]: Phaser.Input.Keyboard.Key } | undefined;

	onPreload() {
		this.load.image('obstacle', obstacleImg);
		this.load.spritesheet('player', playerImg, {
			frameWidth: 16,
			frameHeight: 32,
		});
	}

	onCreate() {
		const obstacle = this.add.image(400, 300, 'obstacle');
		this.tweens.add({
			targets: obstacle,
			y: 500,
			duration: 2000,
			ease: 'Power2',
			yoyo: true,
			loop: -1,
		});

		this.player = this.physics.add.sprite(0, 0, 'player');
		this.player.body.setSize(8, 5, false); // width, height, center = true
		this.player.body.setOffset(4, 27);

		this.keys = this.input.keyboard?.addKeys('W,A,S,D') as {
			[key: string]: Phaser.Input.Keyboard.Key;
		};
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setZoom(4);

		// Анимации (без дублирования)
		this.anims.create({
			key: 'walk-down',
			frames: this.anims.generateFrameNumbers('player', {
				start: 0,
				end: 3,
			}),
			frameRate: 7,
			repeat: -1,
		});

		this.anims.create({
			key: 'walk-up',
			frames: this.anims.generateFrameNumbers('player', {
				start: 16,
				end: 19,
			}),
			frameRate: 7,
			repeat: -1,
		});

		this.anims.create({
			key: 'walk-side', // ← одна анимация для лево/право
			frames: this.anims.generateFrameNumbers('player', {
				start: 8,
				end: 11,
			}),
			frameRate: 7,
			repeat: -1,
		});

		this.anims.create({
			key: 'walk-up-diag', // ← диагонали вверх
			frames: this.anims.generateFrameNumbers('player', {
				start: 12,
				end: 15,
			}),
			frameRate: 6,
			repeat: -1,
		});

		this.anims.create({
			key: 'walk-down-diag', // ← диагонали вниз
			frames: this.anims.generateFrameNumbers('player', {
				start: 4,
				end: 7,
			}),
			frameRate: 6,
			repeat: -1,
		});

		this.anims.create({
			key: 'idle',
			frames: [{ key: 'player', frame: 0 }],
			repeat: -1,
		});
	}

	heartbeat(): void {
		if (!this.player || !this.player.anims) return;

		const moveSpeed = 120;
		let isMoving = false;

		this.player.setVelocity(0);

		// 🔥 Диагонали — проверяем СНАЧАЛА
		if (this.keys?.W.isDown && this.keys?.A.isDown) {
			this.player.setVelocity(-moveSpeed, -moveSpeed);
			this.player.flipX = false; // ← лицом влево
			this.player.play('walk-up-diag', true);
			isMoving = true;
		} else if (this.keys?.W.isDown && this.keys?.D.isDown) {
			this.player.setVelocity(moveSpeed, -moveSpeed);
			this.player.flipX = true; // ← лицом вправо
			this.player.play('walk-up-diag', true);
			isMoving = true;
		} else if (this.keys?.S.isDown && this.keys?.A.isDown) {
			this.player.setVelocity(-moveSpeed, moveSpeed);
			this.player.flipX = false; // ← лицом влево
			this.player.play('walk-down-diag', true);
			isMoving = true;
		} else if (this.keys?.S.isDown && this.keys?.D.isDown) {
			this.player.setVelocity(moveSpeed, moveSpeed);
			this.player.flipX = true; // ← лицом вправо
			this.player.play('walk-down-diag', true);
			isMoving = true;
		}
		// 🔽 Вертикаль
		else if (this.keys?.W.isDown) {
			this.player.setVelocityY(-moveSpeed);
			this.player.play('walk-up', true);
			isMoving = true;
		} else if (this.keys?.S.isDown) {
			this.player.setVelocityY(moveSpeed);
			this.player.play('walk-down', true);
			isMoving = true;
		}
		// ↔ Горизонталь
		else if (this.keys?.A.isDown) {
			this.player.setVelocityX(-moveSpeed);
			this.player.flipX = false; // ← лицом влево
			this.player.play('walk-side', true);
			isMoving = true;
		} else if (this.keys?.D.isDown) {
			this.player.setVelocityX(moveSpeed);
			this.player.flipX = true; // ← лицом вправо
			this.player.play('walk-side', true);
			isMoving = true;
		}

		if (!isMoving) {
			this.player.play('idle', true);
		}
	}

	onPlayerConnected(_peerId: string): void {}
	onPlayerDisconnected(_peerId: string): void {}
	handleNetworkData(_peerId: string, _data: GameData): void {}
}
