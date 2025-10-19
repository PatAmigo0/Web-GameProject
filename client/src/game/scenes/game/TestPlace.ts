/**
 * ЭТОТ ФАЙЛ СЛУЖИТ ХАРД КОДОМ
 * ДЛЯ ФУНКЦИЙ, КОТОРЫЕ ПОСЛЕ БУДУТ ОПТИМИЗИРОВАНЫ
 * В ОТДЕЛЬНЫЕ МОДУЛИ!
 */

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

	// переменная для хранения последней анимации покоя
	private lastIdleAnim: string = 'idle-down';
	private lastFlipX: boolean = false;
	// Таймер "блокировки" диагональной анимации
	private idleAnimLockTimer: number = 0;
	// Длительность блокировки в мс (можешь поменять на 100 или 120, если 80 мало)
	private readonly IDLE_ANIM_LOCK_DURATION = 80;
	// ---

	//================================================================
	// ПАБЛИК МЕТОДЫ PHASER (ЖИЗНЕННЫЙ ЦИКЛ)
	//================================================================

	onPreload() {
		this.load.image('obstacle', obstacleImg);
		// Грузим спрайтшиты
		this.load.spritesheet(
			ASSET_KEYS.NEW_PLAYER_SPRITE,
			ASSET_URLS[ASSET_KEYS.NEW_PLAYER_SPRITE],
			{
				frameWidth: 16,
				frameHeight: 32,
			},
		);
		this.load.spritesheet(
			ASSET_KEYS.PLAYER_IDLE,
			ASSET_URLS[ASSET_KEYS.PLAYER_IDLE],
			{ frameWidth: 16, frameHeight: 32 },
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
	heartbeat(_: number, delta: number): void {
		this._handlePlayerMovement(delta);
	}

	//================================================================
	// ПРИВАТНЫЕ МЕТОДЫ (ЛОГИКА СЦЕНЫ)
	//================================================================

	/**
	 * Вся логика движения и анимаций игрока
	 */
	private _handlePlayerMovement(delta: number): void {
		// --- ИЗМЕНЕНИЕ ТУТ ---
		// 1. Уменьшаем таймер, если он есть
		if (this.idleAnimLockTimer > 0) {
			this.idleAnimLockTimer -= delta;
		}

		// 2. Получаем инпут
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

		// 3. Применяем скорость к телу
		this.player.setVelocity(velocityX, velocityY);

		// 4. Решаем, какую анимацию играть
		this._updatePlayerAnimation(velocityX, velocityY);
	}

	/**
	 * Обновляет анимацию игрока на основе его итоговой скорости
	 * Содержит фикс с таймером, чтобы поймать диагональный 'idle'
	 */
	private _updatePlayerAnimation(vx: number, vy: number): void {
		const isMoving = vx !== 0 || vy !== 0;
		const isDiagonal = vx !== 0 && vy !== 0;

		if (isMoving) {
			// --- СЛУЧАЙ 1: МЫ ДВИГАЕМСЯ ---

			if (isDiagonal) {
				// --- 1a: Идем по диагонали ---
				this.idleAnimLockTimer = this.IDLE_ANIM_LOCK_DURATION; // Включаем "лок"
				if (vy < 0) {
					this.player.play('walk-up-diag', true);
					this.lastIdleAnim = 'idle-diag-up';
				} else {
					this.player.play('walk-down-diag', true);
					this.lastIdleAnim = 'idle-diag-down';
				}
			} else {
				// --- 1b: Идем прямо (не диагональ) ---

				// Мы обновляем 'idle' анимацию, ТОЛЬКО ЕСЛИ
				// таймер "блокировки" диагонали истек
				if (this.idleAnimLockTimer <= 0) {
					if (vy < 0) {
						this.player.play('walk-up', true);
						this.lastIdleAnim = 'idle-up';
					} else if (vy > 0) {
						this.player.play('walk-down', true);
						this.lastIdleAnim = 'idle-down';
					} else {
						// vy === 0
						this.player.play('walk-side', true);
						this.lastIdleAnim = 'idle-left';
					}
				} else {
					// **БУФЕРНЫЙ ПЕРИОД** (пока таймер тикает)
					// Мы не меняем lastIdleAnim (он остается диагональным)
					// Но нам нужно проиграть правильную *анимацию ходьбы* (не диагональную)
					if (vy < 0) this.player.play('walk-up', true);
					else if (vy > 0) this.player.play('walk-down', true);
					else this.player.play('walk-side', true);
				}
			}

			// Обновляем поворот спрайта и запоминаем его
			if (vx < 0) this.lastFlipX = false;
			else if (vx > 0) this.lastFlipX = true;
			this.player.flipX = this.lastFlipX;
		} else {
			// --- СЛУЧАЙ 2: МЫ СТОИМ ---

			// Если мы остановились, таймер блокировки нам больше не нужен
			this.idleAnimLockTimer = 0;

			// Врубаем последнюю сохраненную 'idle' анимацию
			this.player.play(this.lastIdleAnim, true);
			// и восстанавливаем последний поворот
			this.player.flipX = this.lastFlipX;
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
		// ставим игрока поверх всего
		this.player.setDepth(10);
	}

	/**
	 * Создаем все анимации
	 * Я сделал мелкую функцию-хелпер, чтоб не было копипасты
	 */
	private _initAnimations(): void {
		// Хелпер для быстрой нарезки анимаций
		// sheetKey - какой спрайтшип режем
		// animKey - как называем анимацию
		// start/end - кадры
		// rate - скорость
		const createAnim = (
			sheetKey: string,
			animKey: string,
			start: number,
			end: number,
			rate: number,
		) => {
			this.anims.create({
				key: animKey,
				frames: this.anims.generateFrameNumbers(sheetKey, {
					start,
					end,
				}),
				frameRate: rate,
				repeat: -1,
			});
		};

		// --- Анимации ХОДЬБЫ (из основного спрайтшита) ---
		const walkSheet = ASSET_KEYS.NEW_PLAYER_SPRITE;
		createAnim(walkSheet, 'walk-down', 0, 3, 7);
		createAnim(walkSheet, 'walk-down-diag', 4, 7, 6);
		createAnim(walkSheet, 'walk-side', 8, 11, 7);
		createAnim(walkSheet, 'walk-up-diag', 12, 15, 6);
		createAnim(walkSheet, 'walk-up', 16, 19, 7);

		// --- Анимации ПОКОЯ (IDLE) (из отдельного спрайтшита) ---
		const idleSheet = ASSET_KEYS.PLAYER_IDLE;
		createAnim(idleSheet, 'idle-down', 0, 3, 3);
		createAnim(idleSheet, 'idle-diag-down', 4, 7, 3);
		createAnim(idleSheet, 'idle-left', 8, 11, 3); // 'idle-right' будет этим же, но с flipX
		createAnim(idleSheet, 'idle-diag-up', 12, 15, 3);
		createAnim(idleSheet, 'idle-up', 16, 19, 3);
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
