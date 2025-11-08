// src/scenes/minigames/TestMinigame.ts
import { BaseGameScene } from '@abstracts/scene/BaseGameScene';
import { SceneInfo } from '@decorators/SceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.TestMinigame, SceneTypes.GameScene) // ← Используем GameScene
export class TestMinigame extends BaseGameScene {
	public onPreload(): void {
		console.log('🔧 TestMinigame: preload');
	}

	public onCreate(): void {
		console.log('✅ Мини-игра запущена! Система взаимодействия РАБОТАЕТ!');

		const background = this.add.rectangle(400, 300, 600, 400, 0x333333);
		const title = this.add
			.text(400, 150, 'ТЕСТОВАЯ МИНИ-ИГРА', {
				fontSize: '32px',
				color: '#FFFFFF',
			})
			.setOrigin(0.5);

		const message = this.add
			.text(400, 250, 'Система взаимодействия работает!', {
				fontSize: '20px',
				color: '#00FF00',
			})
			.setOrigin(0.5);

		const closeButton = this.add
			.text(400, 350, 'Закрыть [ESC]', {
				fontSize: '18px',
				color: '#FFFFFF',
				backgroundColor: '#555555',
				padding: { x: 20, y: 10 },
			})
			.setOrigin(0.5)
			.setInteractive();

		closeButton.on('pointerdown', () => this.closeMinigame());
		this.input.keyboard?.on('keydown-ESC', () => this.closeMinigame());
	}

	public heartbeat(time: number, delta: number): void {
		// Пустая реализация
	}

	public onShutdown(): void {
		console.log('🔧 TestMinigame: shutdown');
		this.input.keyboard?.off('keydown-ESC');
	}

	private closeMinigame(): void {
		console.log('✅ Мини-игра закрыта, возврат в основную игру');
		this.scene.stop();
		this.scene.resume(SceneKeys.TestPlace);
	}
}
