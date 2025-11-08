import { BaseHtmlScene } from '@abstracts/scene/BaseHtmlScene';
import { GAME_EVENT_TYPES } from '@config/events.config';
import { TEST_SCENE } from '@config/game.config';
import { SceneInfo } from '@decorators/SceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.MainMenu, SceneTypes.HTMLScene)
export class MainMenuScene extends BaseHtmlScene {
	//#region CLASS ATTRIBUTES
	private createGameLocal!: HTMLButtonElement;
	//#endregion

	//#region PHASER LIFECYCLE METHODS
	public onPreload(): void {}

	public onCreate(): void {
		this._build_bg();
		this._build_face();
		this._init_class_attributes();
		this._init_click_events();
	}
	public heartbeat(): void {}
	public onShutdown(): void {}

	//#endregion

	//#region BUILDERS
	private _build_bg() {}
	private _build_face() {}
	//#endregion

	//#region INITIALIZERS
	private _init_class_attributes() {
		this.createGameLocal = this.div.querySelector(
			'.play-button',
		) as HTMLButtonElement;
	}

	private _init_click_events() {
		this.createGameLocal.addEventListener('click', () => {
			this.game.events.emit(
				GAME_EVENT_TYPES.MAIN_SCENE_CHANGE,
				TEST_SCENE,
			);
		});
	}
	//#endregion
}
