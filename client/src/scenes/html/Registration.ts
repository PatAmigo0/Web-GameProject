import { BaseHtmlScene } from '@abstracts/scene/BaseHtmlScene';
import { GAME_EVENT_TYPES } from '@config/events.config';
import { SceneInfo } from '@decorators/SceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.SignupScene, SceneTypes.HTMLScene)
export class RegistrationScene extends BaseHtmlScene {
	private changeToLoginButton!: HTMLButtonElement;
	private registrationButton!: HTMLButtonElement;

	public onPreload(): void {}

	public onCreate(): void {
		this._init_class_attributes();
		this._init_click_events();
	}

	public heartbeat(time?: number, delta?: number): void {}
	public onShutdown(): void {}

	private _init_class_attributes() {
		this.changeToLoginButton = this.div.querySelector(
			'#s',
		) as HTMLButtonElement;

		this.registrationButton = this.div.querySelector(
			'#registerBtn',
		) as HTMLButtonElement;
	}

	private _init_click_events() {
		this.changeToLoginButton.addEventListener('click', () => {
			this.game.events.emit(
				GAME_EVENT_TYPES.MAIN_SCENE_CHANGE,
				SceneKeys.LoginScene,
			);
		});

		this.registrationButton.addEventListener('click', () => {
			this.game.events.emit(
				GAME_EVENT_TYPES.MAIN_SCENE_CHANGE,
				SceneKeys.MainMenu,
			);
		});
	}
}
