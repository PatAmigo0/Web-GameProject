import type { GameData } from '../../types/game.types';
import { NetworkedScene } from '../../core/abstracts/NetworkedScene';
import obstacleImg from '../../../assets/images/typescript.svg';
import playerImg from '../../../assets/images/Walk.png';
import { SceneKey } from '../../utils/decorators/SceneKey.decorator';
import { SceneKeys } from '../../types';
import { CAMERA_ZOOM } from '../../config/settings.config';
import { MOVE_SPEED } from '../../config/game.config';

@SceneKey(SceneKeys.TestPlace)
export class TestPlace extends NetworkedScene {
	// Явно переопределяем тип player в этом классе
	declare player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

	private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
	private obstaclesGroup!: Phaser.Physics.Arcade.StaticGroup;

	onPreload() {
		this.load.image('obstacle', obstacleImg);
		this.load.spritesheet('player', playerImg, {
			frameWidth: 16,
			frameHeight: 32,
		});
	}

	onCreate() {
		// Настройка существующего игрока (он уже создан в NetworkedScene)
		this.player.setTexture('player');
		this.player.setFrame(0);

		// Тело гарантированно существует благодаря типу SpriteWithDynamicBody
		this.player.body.setSize(8, 5, false);
		this.player.body.setOffset(4, 27);

		// === Анимации ===
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
			key: 'walk-side',
			frames: this.anims.generateFrameNumbers('player', {
				start: 8,
				end: 11,
			}),
			frameRate: 7,
			repeat: -1,
		});

		this.anims.create({
			key: 'walk-up-diag',
			frames: this.anims.generateFrameNumbers('player', {
				start: 12,
				end: 15,
			}),
			frameRate: 6,
			repeat: -1,
		});

		this.anims.create({
			key: 'walk-down-diag',
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
			frameRate: 1,
			repeat: -1,
		});

		// === Препятствия ===
		this.obstaclesGroup = this.physics.add.staticGroup();
		this.obstaclesGroup.create(
			this.player.x + 30,
			this.player.y + 50,
			'obstacle',
		);
		this.physics.add.collider(this.player, this.obstaclesGroup);

		// === Управление ===
		this.keys = this.input.keyboard?.addKeys('W,A,S,D') as {
			[key: string]: Phaser.Input.Keyboard.Key;
		};

		// === Камера ===
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setZoom(CAMERA_ZOOM);
	}

	heartbeat(): void {
		let isMoving = false;
		this.player.setVelocity(0);

		// Диагонали (проверяем первыми!)
		if (this.keys.W.isDown && this.keys.A.isDown) {
			this.player.setVelocity(-MOVE_SPEED, -MOVE_SPEED);
			this.player.flipX = false;
			this.player.play('walk-up-diag', true);
			isMoving = true;
		} else if (this.keys.W.isDown && this.keys.D.isDown) {
			this.player.setVelocity(MOVE_SPEED, -MOVE_SPEED);
			this.player.flipX = true;
			this.player.play('walk-up-diag', true);
			isMoving = true;
		} else if (this.keys.S.isDown && this.keys.A.isDown) {
			this.player.setVelocity(-MOVE_SPEED, MOVE_SPEED);
			this.player.flipX = false;
			this.player.play('walk-down-diag', true);
			isMoving = true;
		} else if (this.keys.S.isDown && this.keys.D.isDown) {
			this.player.setVelocity(MOVE_SPEED, MOVE_SPEED);
			this.player.flipX = true;
			this.player.play('walk-down-diag', true);
			isMoving = true;
		}
		// Вертикаль
		else if (this.keys.W.isDown) {
			this.player.setVelocityY(-MOVE_SPEED);
			this.player.play('walk-up', true);
			isMoving = true;
		} else if (this.keys.S.isDown) {
			this.player.setVelocityY(MOVE_SPEED);
			this.player.play('walk-down', true);
			isMoving = true;
		}
		// Горизонталь
		else if (this.keys.A.isDown) {
			this.player.setVelocityX(-MOVE_SPEED);
			this.player.flipX = false;
			this.player.play('walk-side', true);
			isMoving = true;
		} else if (this.keys.D.isDown) {
			this.player.setVelocityX(MOVE_SPEED);
			this.player.flipX = true;
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
