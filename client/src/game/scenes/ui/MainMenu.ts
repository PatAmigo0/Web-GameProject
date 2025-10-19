import { STARTING_SCENE } from '../../config/game.config';
import { NamedScene } from '../../core/abstracts/NamedScene';
import type { NetworkService } from '../../services/NetworkService';
import { SceneKeys } from '../../types';
import { SceneKey } from '../../utils';

@SceneKey(SceneKeys.TMainMenu)
export class TMainMenuScene extends NamedScene {
	private NetworkService!: NetworkService;

	// buttons
	private createGameHost!: Phaser.GameObjects.Text;
	private createGameLocal!: Phaser.GameObjects.Text;

	async create(): Promise<void> {
		this.NetworkService = this.registry.get('NetworkService');

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
			console.log('Начинаю создавать игру!');

			try {
				const id = await this.NetworkService.startPeer(true);
				console.log(`Ваш id: ${id}`);
				this.scene.start(STARTING_SCENE);
			} catch (error) {
				console.warn(error);
				this._showErrorMessage();
			}
		});

		// Кнопка создать локальную игру
		this.createGameLocal = this.add
			.text(this.cameras.main.centerX, 400, 'Создать игру (локально)', {
				fontSize: '28px',
				backgroundColor: 'blue',
			})
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });

		this.createGameLocal.on('pointerdown', () => {
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
		errorText.innerHTML =
			'Не удалось создать сетевую сессию, вы не в сети! Это сообщение пропадет через 5 секунд.';

		this.add.dom(
			this.cameras.main.centerX,
			this.cameras.main.centerY,
			errorText,
		);

		setTimeout(() => {
			errorText.remove();
			background.remove();
		}, 5000);
	}
}
