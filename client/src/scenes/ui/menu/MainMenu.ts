import { STARTING_SCENE } from '@config/game.config';
import { TypedScene } from '@core/abstracts/TypedScene';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import { SceneInfo } from '@utils/decorators/SceneInfo.decorator';
import '@styles/mainMenu.css';

@SceneInfo(SceneKeys.MainMenu, SceneTypes.UIScene)
export class MainMenuScene extends TypedScene {
	//#region CLASS ATTRIBUTES
	private createGameLocal!: HTMLButtonElement;
	private isStarting = false;
	private div!: Phaser.GameObjects.DOMElement;
	//#endregion

	//#region PHASER LIFECYCLE METHODS
	async preload(): Promise<void> {
		this.load.html('MainMenu', '/html/mainMenu.html');
	}

	async create(): Promise<void> {
		this._build_bg();
		this._build_face();
		this._init_class_attributes();
		this._init_click_events();
	}

	public shutdown() {
		this.div.destroy();
	}
	//#endregion

	//#region BUILDERS
	private _build_bg() {}

	private _build_face() {
		this.div = this.add.dom(500, 400).createFromCache('MainMenu');
	}
	//#endregion

	//#region INITIALIZERS
	private _init_class_attributes() {
		this.createGameLocal = this.div.node.querySelector(
			'#play-button',
		) as HTMLButtonElement;
	}

	private _init_click_events() {
		this.createGameLocal.addEventListener('click', () => {
			if (this.isStarting) this._showErrorMessage();
			this.isStarting = true;
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
