import { STARTING_SCENE } from '../../config/game.config';
import { NamedScene } from '../../core/abstracts/NamedScene';
import { Game } from '../../main';
import type { NetworkService } from '../../services/NetworkService';
import { SceneKeys } from '../../types';
import { SceneKey } from '../../utils';

@SceneKey(SceneKeys.TMainMenu)
export class TMainMenuScene extends NamedScene {
	// buttons
	private createGameHost!: Phaser.GameObjects.Text;
	private createGameLocal!: Phaser.GameObjects.Text;
	private isStarting = false;

	async create(): Promise<void> {
		// Кнопка создать игру как хост
		this.createGameHost = this.add
			.text(
				this.cameras.main.centerX,
				200,
				'Создать игру (быть хостом)',
				{
					fontSize: '28px',
					backgroundColor: 'orange',
				},
			)
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });

		this.createGameHost.on('pointerdown', async () => {
			if (this.isStarting) return;
			this.isStarting = true;
			console.warn('[NON-IMPLEMENTED]');
			this._showErrorMessage();
		});

		// Кнопка создать локальную игру
		this.createGameLocal = this.add
			.text(this.cameras.main.centerX, 400, 'Создать игру (локально)', {
				fontSize: '28px',
				padding: { x: 10, y: 5 },
				backgroundColor: 'blue',
			})
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });

		this.createGameLocal.on('pointerdown', () => {
			if (this.isStarting) return;
			this.isStarting = true;
			console.log('Начинаю игру вне сети');
			this.scene.start(STARTING_SCENE);
		});
	}

	shutdown() {
		this.createGameHost.destroy(true);
		this.createGameLocal.destroy(true);
	}

	/* CLASS OWN METHODS */
	private _showErrorMessage() {
		const background = document.createElement('div');
		background.id = 'error-bg';
		background.innerHTML = '';

		this.add.dom(
			this.cameras.main.centerX,
			this.cameras.main.centerY,
			background,
		);

		const errorText = document.createElement('p');
		errorText.id = 'error-text';
		errorText.innerHTML = 'Невозможно создать: [NON-IMPLEMENTED]';

		this.add.dom(
			this.cameras.main.centerX,
			this.cameras.main.centerY,
			errorText,
		);

		setTimeout(() => {
			errorText.remove();
			background.remove();
			this.isStarting = false;
		}, 5000);
	}
}
