import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { CacheComponent } from '@components/shared/CacheComponent';
import { CacheKeys, CacheNames } from '@config/cache.config';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import type { UserBaseInfo } from '@gametypes/cache.types';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import { subSceneChange } from '@utils/ui-utils/routing.util';

@SceneInfo(SceneKeys.MainMenu, SceneTypes.HTMLScene, { to: [SceneKeys.ServerList] })
export class MainMenuScene extends BaseHtmlScene {
	//#region CLASS ATTRIBUTES
	private joinButton!: HTMLButtonElement;
	private createButton!: HTMLButtonElement;
	private logoutButton!: HTMLButtonElement;
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
		this.joinButton = this.div.querySelector('#join-btn');
		this.createButton = this.div.querySelector('#create-btn');
		this.logoutButton = this.div.querySelector('#logout-btn');
		this.playerNickname = this.div.querySelector('#player-nickname');

		this.playerNickname.innerText = (this.userCache.get(CacheKeys.UserBaseInfo) as UserBaseInfo).login;
	}

	private _init_click_events() {
		subSceneChange.call(this, this.joinButton, SceneKeys.ServerList);
		subSceneChange.call(this, this.createButton, SceneKeys.CreateRoom);

		this.logoutButton.addEventListener('click', () => {
			this.game.authService.logout();
		});
	}
	//#endregion
}
