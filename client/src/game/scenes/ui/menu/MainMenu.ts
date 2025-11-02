import { STARTING_SCENE } from '../../../config/game.config';
import { TypedScene } from '../../../core/abstracts/TypedScene';
import { SceneKeys, SceneTypes } from '../../../types';
import { SceneInfo } from '../../../utils/decorators/SceneInfo.decorator';

@SceneInfo(SceneKeys.MainMenu, SceneTypes.UIScene)
export class MainMenuScene extends TypedScene {
	//#region CLASS ATTRIBUTES
	private createGameHost!: Phaser.GameObjects.Text;
	private createGameLocal!: Phaser.GameObjects.Text;
	private isStarting = false;
	//#endregion

	//#region PHASER LIFECYCLE METHODS
	async create(): Promise<void> {
		this._build_bg();
		this._build_face();
		this._init_click_events();
	}

	public shutdown() {
		this.createGameHost.destroy(true);
		this.createGameLocal.destroy(true);
	}
	//#endregion

	//#region BUILDERS
	private _build_bg() {}

	private _build_face() {
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

		// Кнопка создать локальную игру
		this.createGameLocal = this.add
			.text(this.cameras.main.centerX, 400, 'Создать игру (локально)', {
				fontSize: '28px',
				padding: { x: 10, y: 5 },
				backgroundColor: 'blue',
			})
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });
	}
	//#endregion

	//#region INITIALIZERS
	private _init_click_events() {
		this.createGameHost.on('pointerdown', async () => {
			if (this.isStarting) return;
			this.isStarting = true;
			console.warn('[NON-IMPLEMENTED]');
			this._showErrorMessage();
		});

		this.createGameLocal.on('pointerdown', () => {
			if (this.isStarting) return;
			this.isStarting = true;
			console.log('Начинаю игру вне сети');
			this.scene.start(STARTING_SCENE);
		});
	}
	//#endregion

	//#region HELPER METHODS
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
	//#endregion
}
