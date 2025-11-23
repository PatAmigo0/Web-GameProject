import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { CacheComponent } from '@components/shared/CacheComponent';
import { CacheKeys, CacheNames } from '@config/cache.config';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import type { UserBaseInfo } from '@gametypes/cache.types';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.MainMenu, SceneTypes.HTMLScene, { to: SceneKeys.CharacterTestPlace })
export class MainMenuScene extends BaseHtmlScene {
	//#region CLASS ATTRIBUTES
	private playButton!: HTMLButtonElement;
	private playerNickname!: HTMLSpanElement;
	private userCache!: CacheComponent;
	//#endregion

	//#region PHASER LIFECYCLE METHODS
	public onPreload(): void {}

	public onCreate(): void {
		this._init_class_attributes();
		this._init_click_events();
	}
	public heartbeat(): void {}
	public onShutdown(): void {}

	//#endregion

	//#region INITIALIZERS
	private _init_class_attributes() {
		this.userCache = new CacheComponent(CacheNames.User);
		this.playButton = this.div.querySelector('#play-btn');
		this.playerNickname = this.div.querySelector('#player-nickname');

		this.playerNickname.innerText = (this.userCache.get(CacheKeys.UserBaseInfo) as UserBaseInfo).login;
	}

	private _init_click_events() {
		this.playButton.addEventListener('click', () => {
			this.game.events.emit(GameEvents.SUB_SCENE_CHANGE, this.sceneKey);
		});
	}
	//#endregion
}
