// src/systems/InteractionSystem.ts
import { InteractionZone } from '@components/phaser/scene/InteractionZone';
import type { InteractionConfig } from '@config/interaction.config';

export class InteractionSystem {
	private static instance: InteractionSystem;
	private zones: Map<string, InteractionZone> = new Map();
	private currentZone: InteractionZone | null = null;

	public static getInstance(): InteractionSystem {
		if (!InteractionSystem.instance) {
			InteractionSystem.instance = new InteractionSystem();
		}
		return InteractionSystem.instance;
	}

	public registerZone(scene: Phaser.Scene, config: InteractionConfig): void {
		const zone = new InteractionZone(scene, config);
		this.zones.set(config.key, zone);
	}

	public checkInteractions(playerX: number, playerY: number): void {
		let foundZone = false;

		this.zones.forEach((zone) => {
			if (zone.isPlayerInRange(playerX, playerY)) {
				if (this.currentZone !== zone) {
					this.currentZone?.hidePrompt();
					this.currentZone = zone;
					zone.showPrompt();
				}
				foundZone = true;
			}
		});

		if (!foundZone && this.currentZone) {
			this.currentZone.hidePrompt();
			this.currentZone = null;
		}
	}

	public triggerInteraction(): void {
		if (this.currentZone) {
			this.currentZone.execute();
			this.currentZone.hidePrompt();
			this.currentZone = null;
		}
	}

	public cleanup(): void {
		this.zones.clear();
		this.currentZone = null;
	}
}
