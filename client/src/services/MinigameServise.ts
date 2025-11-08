// src/services/MinigameService.ts
import { BaseService } from '@abstracts/service/BaseService';

export class MinigameService extends BaseService {
	private activeMinigame: string | null = null;

	public init(): void {
		console.log('MinigameService initialized');
	}

	public launchMinigame(minigameKey: string): void {
		this.activeMinigame = minigameKey;

		// Используем game вместо scene, так как BaseService имеет доступ к game
		const currentScene = this.game.scene.getScenes(true)[0]; // Получаем текущую активную сцену

		if (currentScene) {
			currentScene.scene.pause();
			currentScene.scene.launch(minigameKey);

			// Слушаем завершение мини-игры
			const minigameScene = currentScene.scene.get(minigameKey);
			if (minigameScene) {
				minigameScene.events.once('shutdown', () =>
					this.onMinigameComplete(currentScene),
				);
			}
		}
	}

	private onMinigameComplete(originalScene: Phaser.Scene): void {
		console.log('Minigame completed');
		this.activeMinigame = null;
		originalScene.scene.resume();
	}
}
