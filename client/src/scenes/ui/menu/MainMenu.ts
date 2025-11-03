import { BaseHtmlScene } from '@abstracts/scenes/BaseHtmlScene';
import { EventTypes } from '@config/events.config';
import { STARTING_SCENE } from '@config/game.config';
import { SceneInfo } from '@decorators/scene/SceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.MainMenu, SceneTypes.UIScene)
export class MainMenuScene extends BaseHtmlScene {
	//#region CLASS ATTRIBUTES
	private createGameLocal!: HTMLButtonElement;
	private isStarting = false;
	//#endregion

	//#region PHASER LIFECYCLE METHODS
	public async onPreload(): Promise<void> {}

	public async onCreate(): Promise<void> {
		this._build_bg();
		this._build_face();
		this._init_class_attributes();
		this._init_click_events();
	}

	public onShutdown() {}

	public heartbeat(): void {}
	//#endregion

	//#region BUILDERS
	private _build_bg() {}
	private _build_face() {}
	//#endregion

	//#region INITIALIZERS
	private _init_class_attributes() {
		this.createGameLocal = this.div.node.querySelector(
			'.play-button',
		) as HTMLButtonElement;
	}

	private _init_click_events() {
		this.createGameLocal.addEventListener('click', () => {
			if (this.isStarting) this._showErrorMessage();
			this.isStarting = true;
			this.game.events.emit(EventTypes.MAIN_SCENE_CHANGE, STARTING_SCENE);
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
