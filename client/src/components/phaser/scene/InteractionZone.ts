// src/components/phaser/scene/InteractionZone.ts
import type { InteractionConfig } from '@config/interaction.config';
import { InteractDisplay } from '../ui/InteractDisplay';

export class InteractionZone {
	public zone: Phaser.GameObjects.Zone;
	public display: InteractDisplay;
	private debugGraphics: Phaser.GameObjects.Graphics;

	constructor(private scene: Phaser.Scene, public config: InteractionConfig) {
		this.zone = this.createZone(); // ← БЫЛО: createZone, СТАЛО: createZone
		this.display = new InteractDisplay(scene, config.x, config.y - 50);
		this.setupPhysics();

		// ВИЗУАЛИЗАЦИЯ ДЛЯ ТЕСТИРОВАНИЯ
		this.debugGraphics = scene.add.graphics();
		this.drawDebugZone();
	}

	private createZone(): Phaser.GameObjects.Zone {
		// ← БЫЛО: createZone, СТАЛО: createZone
		return this.scene.add.zone(
			this.config.x,
			this.config.y,
			this.config.width,
			this.config.height,
		);
	}

	private setupPhysics(): void {
		this.scene.physics.add.existing(this.zone);
		const body = this.zone.body as Phaser.Physics.Arcade.Body;
		body.setAllowGravity(false);
	}

	private drawDebugZone(): void {
		// Зеленая рамка для зоны взаимодействия
		this.debugGraphics.lineStyle(2, 0x00ff00, 0.8);
		this.debugGraphics.strokeRect(
			this.config.x - this.config.width / 2,
			this.config.y - this.config.height / 2,
			this.config.width,
			this.config.height,
		);

		// Текст с названием зоны
		this.scene.add
			.text(this.config.x, this.config.y, this.config.key, {
				fontSize: '12px',
				color: '#00FF00',
				backgroundColor: '#000000',
				padding: { x: 5, y: 2 },
			})
			.setOrigin(0.5);
	}

	public isPlayerInRange(playerX: number, playerY: number): boolean {
		const distance = Phaser.Math.Distance.Between(
			playerX,
			playerY,
			this.config.x,
			this.config.y,
		);
		return distance < 80;
	}

	public showPrompt(): void {
		this.display.show(this.config.promptText);
	}

	public hidePrompt(): void {
		this.display.hide();
	}

	public execute(): void {
		console.log('🚀 Запускаем мини-игру:', this.config.minigame);
		this.scene.scene.pause();
		this.scene.scene.launch(this.config.minigame);
	}
}
