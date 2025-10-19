import type { GameData } from '../../types/game.types';
import { NetworkedScene } from '../../core/abstracts/NetworkedScene';
import obstacleImg from '../../../assets/images/typescript.svg';
import { SceneKey } from '../../utils/decorators/SceneKey.decorator';
import { SceneKeys } from '../../types';
import { CAMERA_ZOOM } from '../../config/settings.config';
import { MOVE_SPEED } from '../../config/game.config';
import { ASSET_KEYS, ASSET_URLS } from '../../config/assets.config';

@SceneKey(SceneKeys.TestPlace)
export class TestPlace extends NetworkedScene {
	private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
	private obstaclesGroup!: Phaser.Physics.Arcade.StaticGroup;

	//================================================================
	// ПАБЛИК МЕТОДЫ PHASER (ЖИЗНЕННЫЙ ЦИКЛ)
	//================================================================

	onPreload() {
		this.load.image('obstacle', obstacleImg);
		this.load.spritesheet(
			ASSET_KEYS.NEW_PLAYER_SPRITE,
			ASSET_URLS[ASSET_KEYS.NEW_PLAYER_SPRITE],
			{
				frameWidth: 16,
				frameHeight: 32,
			},
		);
	}

	onCreate() {
		this._initPlayer();
		this._initAnimations();
		this._initObstacles();
		this._initInput();
		this._initCamera();
	}

	/**
	 * heartbeat (update)
	 * Он просто вызывает один метод, отвечающий за всю логику кадра
	 */
	heartbeat(): void {
		this._handlePlayerMovement();
	}

	//================================================================
	// ПРИВАТНЫЕ МЕТОДЫ (ЛОГИКА СЦЕНЫ)
	//================================================================

	/**
	 * Вся логика движения и анимаций игрока
	 */
	private _handlePlayerMovement(): void {
		let velocityX = 0;
		let velocityY = 0;

		if (this.keys.A.isDown) {
			velocityX = -MOVE_SPEED;
		} else if (this.keys.D.isDown) {
			velocityX = MOVE_SPEED;
		}

		if (this.keys.W.isDown) {
			velocityY = -MOVE_SPEED;
		} else if (this.keys.S.isDown) {
			velocityY = MOVE_SPEED;
		}

		// 2. Применяем скорость к телу
		this.player.setVelocity(velocityX, velocityY);

		// 3. Решаем, какую анимацию играть (вынесли в отдельный метод)
		this._updatePlayerAnimation(velocityX, velocityY);
	}

	/**
	 * Обновляет анимацию игрока на основе его итоговой скорости
	 */
	private _updatePlayerAnimation(vx: number, vy: number): void {
		// Стоим на месте
		if (vx === 0 && vy === 0) {
			this.player.play('idle', true);
			return;
		}

		// Определяем поворот спрайта (flipX)
		if (vx < 0) {
			this.player.flipX = false;
		} else if (vx > 0) {
			this.player.flipX = true;
		}

		// Играем анимации
		if (vy < 0) {
			// Движемся вверх (прямо или по диагонали)
			this.player.play(vx === 0 ? 'walk-up' : 'walk-up-diag', true);
		} else if (vy > 0) {
			// Движемся вниз (прямо или по диагонали)
			this.player.play(vx === 0 ? 'walk-down' : 'walk-down-diag', true);
		} else {
			// Движемся только по горизонтали (vy === 0)
			this.player.play('walk-side', true);
		}
	}

	//================================================================
	// ПРИВАТНЫЕ МЕТОДЫ ИНИЦИАЛИЗАЦИИ
	//================================================================

	private _initPlayer(): void {
		this.player.setTexture(ASSET_KEYS.NEW_PLAYER_SPRITE);
		this.player.setFrame(0);
		this.player.body.setSize(8, 5, false);
		this.player.body.setOffset(4, 27);
	}

	private _initAnimations(): void {
		this.anims.create({
			key: 'walk-down',
			frames: this.anims.generateFrameNumbers(
				ASSET_KEYS.NEW_PLAYER_SPRITE,
				{
					start: 0,
					end: 3,
				},
			),
			frameRate: 7,
			repeat: -1,
		});

		this.anims.create({
			key: 'walk-up',
			frames: this.anims.generateFrameNumbers(
				ASSET_KEYS.NEW_PLAYER_SPRITE,
				{
					start: 16,
					end: 19,
				},
			),
			frameRate: 7,
			repeat: -1,
		});

		this.anims.create({
			key: 'walk-side',
			frames: this.anims.generateFrameNumbers(
				ASSET_KEYS.NEW_PLAYER_SPRITE,
				{
					start: 8,
					end: 11,
				},
			),
			frameRate: 7,
			repeat: -1,
		});

		this.anims.create({
			key: 'walk-up-diag',
			frames: this.anims.generateFrameNumbers(
				ASSET_KEYS.NEW_PLAYER_SPRITE,
				{
					start: 12,
					end: 15,
				},
			),
			frameRate: 6,
			repeat: -1,
		});

		this.anims.create({
			key: 'walk-down-diag',
			frames: this.anims.generateFrameNumbers(
				ASSET_KEYS.NEW_PLAYER_SPRITE,
				{
					start: 4,
					end: 7,
				},
			),
			frameRate: 6,
			repeat: -1,
		});

		this.anims.create({
			key: 'idle',
			frames: [{ key: ASSET_KEYS.NEW_PLAYER_SPRITE, frame: 0 }],
			frameRate: 1,
			repeat: -1,
		});
	}

	private _initObstacles(): void {
		this.obstaclesGroup = this.physics.add.staticGroup();
		this.obstaclesGroup.create(
			this.player.x + 30,
			this.player.y + 50,
			'obstacle',
		);
		this.physics.add.collider(this.player, this.obstaclesGroup);
	}

	private _initInput(): void {
		this.keys = this.input.keyboard?.addKeys('W,A,S,D') as {
			[key: string]: Phaser.Input.Keyboard.Key;
		};
	}

	private _initCamera(): void {
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setZoom(CAMERA_ZOOM);
	}

	//================================================================
	// СЕТЕВЫЕ МЕТОДЫ (не используются)
	//================================================================

	onPlayerConnected(_peerId: string): void {}
	onPlayerDisconnected(_peerId: string): void {}
	handleNetworkData(_peerId: string, _data: GameData): void {}
}
